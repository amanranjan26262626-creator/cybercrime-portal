import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { firService } from '../services/firService';
import logger from '../utils/logger';

export const firController = {
  generate: async (req: AuthRequest, res: Response) => {
    try {
      const { complaint_id, station_code } = req.body;

      if (!complaint_id || !station_code) {
        return res.status(400).json({
          success: false,
          message: 'Complaint ID and station code are required',
        });
      }

      const fir = await firService.generateFIR({
        complaint_id,
        filed_by: req.user!.id,
        station_code,
      });

      res.status(201).json({
        success: true,
        message: 'FIR generated successfully',
        data: { fir },
      });
    } catch (error: any) {
      logger.error('Error generating FIR', { error: error.message });
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to generate FIR',
      });
    }
  },

  getByNumber: async (req: AuthRequest, res: Response) => {
    try {
      const fir = await firService.getFIRByNumber(req.params.firNumber);

      if (!fir) {
        return res.status(404).json({
          success: false,
          message: 'FIR not found',
        });
      }

      res.json({
        success: true,
        data: { fir },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch FIR',
      });
    }
  },

  getByComplaint: async (req: AuthRequest, res: Response) => {
    try {
      const fir = await firService.getFIRByComplaint(req.params.complaintId);

      if (!fir) {
        return res.status(404).json({
          success: false,
          message: 'FIR not found for this complaint',
        });
      }

      res.json({
        success: true,
        data: { fir },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch FIR',
      });
    }
  },
};

