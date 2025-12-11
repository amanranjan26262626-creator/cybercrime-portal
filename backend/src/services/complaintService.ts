import { ComplaintModel, Complaint, ComplaintStatus } from '../models/Complaint';
import { EvidenceModel } from '../models/Evidence';
import { generateComplaintNumber } from '../utils/helpers';
import { severityService } from './severityService';
import { ipfsService } from './ipfsService';
import { blockchainService } from './blockchainService';
import { firebaseService } from './firebaseService';
import { hyperledgerService } from './hyperledgerService';
import { Conversation } from '../models/Conversation';
import logger from '../utils/logger';

export interface CreateComplaintData {
  user_id: string;
  crime_type: string;
  description: string;
  amount?: number | null;
  location: any;
  evidence_files?: Array<{ buffer: Buffer; name: string; type: string; size: number }>;
}

export const complaintService = {
  async createComplaint(data: CreateComplaintData): Promise<Complaint> {
    try {
      // Upload evidence to IPFS and Firebase (dual storage)
      let ipfsHash = '';
      if (data.evidence_files && data.evidence_files.length > 0) {
        const files = data.evidence_files.map(f => ({
          buffer: f.buffer,
          name: f.name,
        }));
        const hashes = await ipfsService.uploadMultipleFiles(files);
        ipfsHash = hashes[0]; // Use first file hash as main hash
        
        // Also upload to Firebase as backup
        try {
          for (const file of files) {
            await firebaseService.uploadFile(file.buffer, file.name, 'evidence');
          }
          logger.info('Files uploaded to Firebase', { count: files.length });
        } catch (error: any) {
          logger.warn('Firebase upload failed, continuing with IPFS only', { error: error.message });
        }
      }

      // Calculate severity score
      const severityScore = severityService.calculateSeverity({
        crime_type: data.crime_type,
        amount: data.amount,
        has_video: data.evidence_files?.some(f => f.type.startsWith('video/')),
        has_audio: data.evidence_files?.some(f => f.type.startsWith('audio/')),
        has_screenshots: data.evidence_files?.some(f => f.type.startsWith('image/')),
      });

      // Generate complaint number
      const complaintNumber = generateComplaintNumber();

      // Create complaint in database
      const complaint = await ComplaintModel.create({
        complaint_number: complaintNumber,
        user_id: data.user_id,
        crime_type: data.crime_type,
        description: data.description,
        amount: data.amount || null,
        location: data.location,
        status: ComplaintStatus.SUBMITTED,
        severity_score: severityScore,
        ipfs_hash: ipfsHash,
        blockchain_tx_hash: null,
        assigned_to: null,
        verified_by: null,
        fir_number: null,
      });

      // Submit to Polygon blockchain
      let polygonTxHash = null;
      try {
        polygonTxHash = await blockchainService.submitComplaint(ipfsHash, severityScore);
        await ComplaintModel.update(complaint.id, { blockchain_tx_hash: polygonTxHash });
        logger.info('Complaint submitted to Polygon', { complaintId: complaint.id, txHash: polygonTxHash });
      } catch (error: any) {
        logger.error('Polygon submission failed', { error: error.message });
      }

      // Also submit to Hyperledger (private/consortium blockchain)
      try {
        await hyperledgerService.createComplaint({
          id: complaint.id,
          complaint_number: complaint.complaint_number,
          user_id: complaint.user_id,
          crime_type: complaint.crime_type,
          description: complaint.description,
          status: complaint.status,
          severity_score: complaint.severity_score,
          ipfs_hash: complaint.ipfs_hash,
          polygon_tx_hash: polygonTxHash || '',
          created_at: complaint.created_at.toISOString(),
        });
        logger.info('Complaint submitted to Hyperledger', { complaintId: complaint.id });
      } catch (error: any) {
        logger.error('Hyperledger submission failed', { error: error.message });
        // Continue even if Hyperledger fails
      }

      // Save evidence records
      if (data.evidence_files) {
        for (const file of data.evidence_files) {
          const fileHash = await ipfsService.uploadFile(file.buffer, file.name);
          await EvidenceModel.create({
            complaint_id: complaint.id,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            ipfs_hash: fileHash,
            verified: false,
          });
        }
      }

      // Create conversation record
      await Conversation.create({
        complaint_id: complaint.id,
        messages: [],
        language: 'hi',
        extracted_data: {},
      });

      logger.info('Complaint created', { complaintId: complaint.id });
      return complaint;
    } catch (error: any) {
      logger.error('Error creating complaint', { error: error.message });
      throw error;
    }
  },

  async getComplaintById(id: string, userId?: string): Promise<Complaint | null> {
    const complaint = await ComplaintModel.findById(id);
    if (!complaint) {
      return null;
    }

    // Check if user has access
    if (userId && complaint.user_id !== userId) {
      throw new Error('Unauthorized access');
    }

    return complaint;
  },

  async getUserComplaints(userId: string): Promise<Complaint[]> {
    return await ComplaintModel.findByUserId(userId);
  },

  async getAllComplaints(filters?: {
    status?: ComplaintStatus;
    severity?: number;
    assigned_to?: string;
  }): Promise<Complaint[]> {
    return await ComplaintModel.findAll(filters);
  },

  async updateStatus(
    complaintId: string,
    newStatus: ComplaintStatus,
    updatedBy: string
  ): Promise<Complaint> {
    const complaint = await ComplaintModel.findById(complaintId);
    if (!complaint) {
      throw new Error('Complaint not found');
    }

    // Update on blockchain
    try {
      const statusMap: Record<ComplaintStatus, number> = {
        [ComplaintStatus.SUBMITTED]: 0,
        [ComplaintStatus.VERIFIED]: 1,
        [ComplaintStatus.UNDER_INVESTIGATION]: 2,
        [ComplaintStatus.FIR_FILED]: 3,
        [ComplaintStatus.CLOSED]: 4,
        [ComplaintStatus.REJECTED]: 5,
      };
      await blockchainService.updateStatus(parseInt(complaint.id), statusMap[newStatus]);
    } catch (error: any) {
      logger.error('Blockchain status update failed', { error: error.message });
    }

    const updated = await ComplaintModel.update(complaintId, { status: newStatus });
    logger.info('Complaint status updated', { complaintId, newStatus, updatedBy });
    return updated;
  },
};

