import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { complaintService } from '../services/complaintService';
import { createComplaintSchema } from '../validators/complaintValidator';
import { validate } from '../middleware/validation';
import logger from '../utils/logger';

export const complaintController = {
  create: [
    validate(createComplaintSchema),
    async (req: AuthRequest, res: Response) => {
      try {
        const files = (req.files as Express.Multer.File[]) || [];
        const evidence_files = files.map(file => ({
          buffer: file.buffer,
          name: file.originalname,
          type: file.mimetype,
          size: file.size,
        }));

        const complaint = await complaintService.createComplaint({
          user_id: req.user!.id,
          crime_type: req.body.crime_type,
          description: req.body.description,
          amount: req.body.amount ? parseFloat(req.body.amount) : null,
          location: typeof req.body.location === 'string' ? JSON.parse(req.body.location) : req.body.location,
          evidence_files,
        });

        res.status(201).json({
          success: true,
          message: 'Complaint submitted successfully',
          data: { complaint },
        });
      } catch (error: any) {
        logger.error('Error creating complaint', { error: error.message });
        res.status(400).json({
          success: false,
          message: error.message || 'Failed to create complaint',
        });
      }
    },
  ],

  getAll: async (req: AuthRequest, res: Response) => {
    try {
      const complaints = await complaintService.getUserComplaints(req.user!.id);
      res.json({
        success: true,
        data: { complaints },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch complaints',
      });
    }
  },

  getById: async (req: AuthRequest, res: Response) => {
    try {
      const complaint = await complaintService.getComplaintById(
        req.params.id,
        req.user!.id
      );

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found',
        });
      }

      res.json({
        success: true,
        data: { complaint },
      });
    } catch (error: any) {
      res.status(error.message === 'Unauthorized access' ? 403 : 500).json({
        success: false,
        message: error.message || 'Failed to fetch complaint',
      });
    }
  },
};

