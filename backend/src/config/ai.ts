import dotenv from 'dotenv';

dotenv.config();

export const AI_CONFIG = {
  apiKey: process.env.GEMINI_API_KEY || '',
  model: 'gemini-pro',
};

export const validateAIConfig = (): void => {
  if (!AI_CONFIG.apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }
};

