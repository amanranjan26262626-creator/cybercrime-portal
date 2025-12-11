import { FIRModel, FIR } from '../models/FIR';
import { ComplaintModel, ComplaintStatus } from '../models/Complaint';
import { generateFIRNumber } from '../utils/helpers';
import { blockchainService } from './blockchainService';
import logger from '../utils/logger';

export interface GenerateFIRData {
  complaint_id: string;
  filed_by: string;
  station_code: string;
}

export const firService = {
  async generateFIR(data: GenerateFIRData): Promise<FIR> {
    try {
      // Get complaint
      const complaint = await ComplaintModel.findById(data.complaint_id);
      if (!complaint) {
        throw new Error('Complaint not found');
      }

      // Generate FIR number
      const firNumber = generateFIRNumber(data.station_code);

      // Create FIR record
      const fir = await FIRModel.create({
        complaint_id: data.complaint_id,
        fir_number: firNumber,
        filed_by: data.filed_by,
        station_code: data.station_code,
        status: 'filed',
        pdf_path: null,
      });

      // Update complaint status
      await ComplaintModel.update(data.complaint_id, {
        status: ComplaintStatus.FIR_FILED,
        fir_number: firNumber,
      });

      // File FIR on blockchain
      try {
        await blockchainService.fileFIR(parseInt(data.complaint_id), firNumber);
        logger.info('FIR filed on blockchain', { firNumber, complaintId: data.complaint_id });
      } catch (error: any) {
        logger.error('Blockchain FIR filing failed', { error: error.message });
      }

      logger.info('FIR generated', { firNumber, complaintId: data.complaint_id });
      return fir;
    } catch (error: any) {
      logger.error('Error generating FIR', { error: error.message });
      throw error;
    }
  },

  async getFIRByNumber(firNumber: string): Promise<FIR | null> {
    return await FIRModel.findByFIRNumber(firNumber);
  },

  async getFIRByComplaint(complaintId: string): Promise<FIR | null> {
    return await FIRModel.findByComplaintId(complaintId);
  },
};

