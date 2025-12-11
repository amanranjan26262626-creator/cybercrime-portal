import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { complaintService } from '../services/complaintService';
import { ComplaintModel, ComplaintStatus } from '../models/Complaint';
import logger from '../utils/logger';

export const policeController = {
  getAllComplaints: async (req: AuthRequest, res: Response) => {
    try {
      const { status, severity, assigned_to } = req.query;
      
      const filters: any = {};
      if (status) filters.status = status;
      if (severity) filters.severity = parseInt(severity as string);
      if (assigned_to) filters.assigned_to = assigned_to;

      const complaints = await complaintService.getAllComplaints(filters);

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

  getPendingComplaints: async (req: AuthRequest, res: Response) => {
    try {
      const complaints = await complaintService.getAllComplaints({
        status: ComplaintStatus.SUBMITTED,
      });

      res.json({
        success: true,
        data: { complaints },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch pending complaints',
      });
    }
  },

  getAssignedComplaints: async (req: AuthRequest, res: Response) => {
    try {
      const complaints = await complaintService.getAllComplaints({
        assigned_to: req.user!.id,
      });

      res.json({
        success: true,
        data: { complaints },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch assigned complaints',
      });
    }
  },

  getComplaintById: async (req: AuthRequest, res: Response) => {
    try {
      const complaint = await ComplaintModel.findById(req.params.id);

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
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch complaint',
      });
    }
  },

  updateStatus: async (req: AuthRequest, res: Response) => {
    try {
      const { status, notes } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required',
        });
      }

      const complaint = await complaintService.updateStatus(
        req.params.id,
        status,
        req.user!.id
      );

      res.json({
        success: true,
        message: 'Status updated successfully',
        data: { complaint },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update status',
      });
    }
  },

  assignComplaint: async (req: AuthRequest, res: Response) => {
    try {
      const { police_user_id } = req.body;

      if (!police_user_id) {
        return res.status(400).json({
          success: false,
          message: 'Police user ID is required',
        });
      }

      const complaint = await ComplaintModel.update(req.params.id, {
        assigned_to: police_user_id,
      });

      res.json({
        success: true,
        message: 'Complaint assigned successfully',
        data: { complaint },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to assign complaint',
      });
    }
  },
};

