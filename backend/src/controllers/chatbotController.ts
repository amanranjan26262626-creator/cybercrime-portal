import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { aiService } from '../services/aiService';
import { Conversation } from '../models/Conversation';
import logger from '../utils/logger';

export const chatbotController = {
  sendMessage: async (req: AuthRequest, res: Response) => {
    try {
      const { message, conversationId, language } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          message: 'Message is required',
        });
      }

      const { response, extractedData } = await aiService.sendMessage(
        message,
        conversationId,
        language || 'hi'
      );

      res.json({
        success: true,
        data: {
          response,
          extractedData,
        },
      });
    } catch (error: any) {
      logger.error('Chatbot error', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to process message',
      });
    }
  },

  getConversation: async (req: AuthRequest, res: Response) => {
    try {
      const { complaintId } = req.params;
      const conversation = await Conversation.findOne({ complaint_id: complaintId });

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found',
        });
      }

      res.json({
        success: true,
        data: { conversation },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch conversation',
      });
    }
  },
};

