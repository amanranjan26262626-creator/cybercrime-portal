import crypto from 'crypto';
import { DIDService as PythonDIDService } from '../../python-backend/services/did_service';
import logger from '../utils/logger';

// Call Python service for DID operations
export const didService = {
  async createCredential(data: {
    id: string;
    user_id: string;
    complaint_id: string;
    complaint_number: string;
    status: string;
  }): Promise<any> {
    try {
      const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';
      const response = await fetch(`${pythonServiceUrl}/api/did/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('DID service failed');
      }

      const result = await response.json();
      logger.info('DID credential created', { complaintId: data.complaint_id });
      return result.data;
    } catch (error: any) {
      logger.error('DID credential creation failed', { error: error.message });
      // Return mock credential if service unavailable
      return this.createMockCredential(data);
    }
  },

  async verifyCredential(credential: any): Promise<boolean> {
    try {
      const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';
      const response = await fetch(`${pythonServiceUrl}/api/did/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.verified;
    } catch (error: any) {
      logger.error('DID verification failed', { error: error.message });
      return false;
    }
  },

  createMockCredential(data: any): any {
    // Fallback mock credential
    return {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      id: `https://cybercrime-portal.in/credentials/${data.id}`,
      type: ['VerifiableCredential', 'CybercrimeComplaintCredential'],
      issuer: { id: 'did:web:cybercrime-portal.in' },
      issuanceDate: new Date().toISOString(),
      credentialSubject: data,
    };
  },
};

