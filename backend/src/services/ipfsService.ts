import axios from 'axios';
import FormData from 'form-data';
import { IPFS_CONFIG, validateIPFSConfig } from '../config/ipfs';
import logger from '../utils/logger';

export const ipfsService = {
  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<string> {
    validateIPFSConfig();

    try {
      const formData = new FormData();
      formData.append('file', fileBuffer, fileName);

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'pinata_api_key': IPFS_CONFIG.apiKey,
            'pinata_secret_api_key': IPFS_CONFIG.apiSecret,
            ...formData.getHeaders(),
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      const ipfsHash = response.data.IpfsHash;
      logger.info('File uploaded to IPFS', { fileName, ipfsHash });
      return ipfsHash;
    } catch (error: any) {
      logger.error('Error uploading file to IPFS', { error: error.message });
      throw new Error(`IPFS upload failed: ${error.message}`);
    }
  },

  async uploadMultipleFiles(files: Array<{ buffer: Buffer; name: string }>): Promise<string[]> {
    validateIPFSConfig();

    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file${index}`, file.buffer, file.name);
      });

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'pinata_api_key': IPFS_CONFIG.apiKey,
            'pinata_secret_api_key': IPFS_CONFIG.apiSecret,
            ...formData.getHeaders(),
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      const ipfsHashes = response.data.map((item: any) => item.IpfsHash);
      logger.info('Multiple files uploaded to IPFS', { count: files.length });
      return ipfsHashes;
    } catch (error: any) {
      logger.error('Error uploading files to IPFS', { error: error.message });
      throw new Error(`IPFS upload failed: ${error.message}`);
    }
  },

  async pinFile(ipfsHash: string): Promise<void> {
    validateIPFSConfig();

    try {
      await axios.post(
        'https://api.pinata.cloud/pinning/pinByHash',
        {
          hashToPin: ipfsHash,
        },
        {
          headers: {
            'pinata_api_key': IPFS_CONFIG.apiKey,
            'pinata_secret_api_key': IPFS_CONFIG.apiSecret,
          },
        }
      );
      logger.info('File pinned to IPFS', { ipfsHash });
    } catch (error: any) {
      logger.error('Error pinning file to IPFS', { error: error.message });
      throw error;
    }
  },

  getFileUrl(ipfsHash: string): string {
    return `${IPFS_CONFIG.gateway}${ipfsHash}`;
  },
};

