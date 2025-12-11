import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { registerSchema, loginSchema } from '../validators/userValidator';
import { validate } from '../middleware/validation';
import logger from '../utils/logger';

export const authController = {
  register: [
    validate(registerSchema),
    async (req: Request, res: Response) => {
      try {
        const { user, token } = await authService.register(req.body);
        res.status(201).json({
          success: true,
          message: 'User registered successfully',
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            },
            token,
          },
        });
      } catch (error: any) {
        logger.error('Registration error', { error: error.message });
        res.status(400).json({
          success: false,
          message: error.message || 'Registration failed',
        });
      }
    },
  ],

  login: [
    validate(loginSchema),
    async (req: Request, res: Response) => {
      try {
        const { user, token } = await authService.login(req.body);
        res.json({
          success: true,
          message: 'Login successful',
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            },
            token,
          },
        });
      } catch (error: any) {
        logger.error('Login error', { error: error.message });
        res.status(401).json({
          success: false,
          message: error.message || 'Login failed',
        });
      }
    },
  ],

  refresh: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token required',
        });
      }

      const token = await authService.refreshToken(refreshToken);
      res.json({
        success: true,
        data: { token },
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || 'Token refresh failed',
      });
    }
  },

  logout: async (req: Request, res: Response) => {
    // In a stateless JWT system, logout is handled client-side
    // But we can log it for audit purposes
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  },
};

