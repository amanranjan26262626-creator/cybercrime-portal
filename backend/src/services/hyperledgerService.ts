import { Gateway, Wallets } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';
import logger from '../utils/logger';

export interface HyperledgerComplaint {
  id: string;
  complaint_number: string;
  user_id: string;
  crime_type: string;
  description: string;
  status: string;
  severity_score: number;
  ipfs_hash: string;
  polygon_tx_hash: string;
  created_at: string;
}

export const hyperledgerService = {
  async connect(): Promise<Gateway> {
    try {
      const walletPath = path.join(process.cwd(), 'wallet');
      const wallet = await Wallets.newFileSystemWallet(walletPath);

      const connectionProfilePath = path.join(
        process.cwd(),
        'hyperledger',
        'connection-profile.json'
      );

      if (!fs.existsSync(connectionProfilePath)) {
        throw new Error('Hyperledger connection profile not found');
      }

      const connectionProfile = JSON.parse(
        fs.readFileSync(connectionProfilePath, 'utf8')
      );

      const gateway = new Gateway();
      await gateway.connect(connectionProfile, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true },
      });

      return gateway;
    } catch (error: any) {
      logger.error('Hyperledger connection failed', { error: error.message });
      throw error;
    }
  },

  async createComplaint(complaint: HyperledgerComplaint): Promise<string> {
    try {
      const gateway = await this.connect();
      const network = await gateway.getNetwork('mychannel');
      const contract = network.getContract('complaint');

      const complaintJSON = JSON.stringify(complaint);
      await contract.submitTransaction('CreateComplaint', complaintJSON);

      await gateway.disconnect();
      logger.info('Complaint stored on Hyperledger', { complaintId: complaint.id });
      return complaint.id;
    } catch (error: any) {
      logger.error('Hyperledger complaint creation failed', { error: error.message });
      throw error;
    }
  },

  async getComplaint(complaintId: string): Promise<HyperledgerComplaint | null> {
    try {
      const gateway = await this.connect();
      const network = await gateway.getNetwork('mychannel');
      const contract = network.getContract('complaint');

      const result = await contract.evaluateTransaction('GetComplaint', complaintId);
      const complaint = JSON.parse(result.toString());

      await gateway.disconnect();
      return complaint;
    } catch (error: any) {
      logger.error('Hyperledger get complaint failed', { error: error.message });
      return null;
    }
  },

  async updateStatus(complaintId: string, newStatus: string): Promise<void> {
    try {
      const gateway = await this.connect();
      const network = await gateway.getNetwork('mychannel');
      const contract = network.getContract('complaint');

      await contract.submitTransaction('UpdateStatus', complaintId, newStatus);
      await gateway.disconnect();

      logger.info('Complaint status updated on Hyperledger', { complaintId, newStatus });
    } catch (error: any) {
      logger.error('Hyperledger status update failed', { error: error.message });
      throw error;
    }
  },
};

