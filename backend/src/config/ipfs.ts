import dotenv from 'dotenv';

dotenv.config();

export const IPFS_CONFIG = {
  apiKey: process.env.IPFS_API_KEY || '',
  apiSecret: process.env.IPFS_API_SECRET || '',
  gateway: process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/',
};

export const validateIPFSConfig = (): void => {
  if (!IPFS_CONFIG.apiKey || !IPFS_CONFIG.apiSecret) {
    throw new Error('IPFS API credentials are not configured');
  }
};

