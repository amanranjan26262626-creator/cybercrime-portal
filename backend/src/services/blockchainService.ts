import { ethers } from 'ethers';
import { getProvider, getSigner, getContractAddress } from '../config/blockchain';
import logger from '../utils/logger';

// Contract ABI (simplified - will be generated after deployment)
const CONTRACT_ABI = [
  'function submitComplaint(string memory ipfsHash, uint8 severity) external returns (uint256)',
  'function updateStatus(uint256 complaintId, uint8 newStatus) external',
  'function assignComplaint(uint256 complaintId, address policeOfficer) external',
  'function fileFIR(uint256 complaintId, string memory firNumber) external',
  'function getComplaint(uint256 complaintId) external view returns (tuple(uint256 id, string ipfsHash, address reporter, uint8 severity, uint8 status, uint256 timestamp, address assignedTo, string firNumber))',
  'event ComplaintSubmitted(uint256 indexed complaintId, address indexed reporter, string ipfsHash, uint8 severity)',
  'event StatusUpdated(uint256 indexed complaintId, uint8 oldStatus, uint8 newStatus, address updatedBy)',
];

let contractInstance: ethers.Contract | null = null;

const getContract = (): ethers.Contract => {
  if (!contractInstance) {
    const address = getContractAddress();
    const signer = getSigner();
    contractInstance = new ethers.Contract(address, CONTRACT_ABI, signer);
  }
  return contractInstance;
};

export const blockchainService = {
  async submitComplaint(ipfsHash: string, severity: number): Promise<string> {
    try {
      const contract = getContract();
      const tx = await contract.submitComplaint(ipfsHash, severity);
      const receipt = await tx.wait();
      logger.info('Complaint submitted to blockchain', { txHash: receipt.hash });
      return receipt.hash;
    } catch (error: any) {
      logger.error('Error submitting complaint to blockchain', { error: error.message });
      throw error;
    }
  },

  async updateStatus(complaintId: number, newStatus: number): Promise<string> {
    try {
      const contract = getContract();
      const tx = await contract.updateStatus(complaintId, newStatus);
      const receipt = await tx.wait();
      logger.info('Status updated on blockchain', { complaintId, txHash: receipt.hash });
      return receipt.hash;
    } catch (error: any) {
      logger.error('Error updating status on blockchain', { error: error.message });
      throw error;
    }
  },

  async assignComplaint(complaintId: number, policeAddress: string): Promise<string> {
    try {
      const contract = getContract();
      const tx = await contract.assignComplaint(complaintId, policeAddress);
      const receipt = await tx.wait();
      logger.info('Complaint assigned on blockchain', { complaintId, txHash: receipt.hash });
      return receipt.hash;
    } catch (error: any) {
      logger.error('Error assigning complaint on blockchain', { error: error.message });
      throw error;
    }
  },

  async fileFIR(complaintId: number, firNumber: string): Promise<string> {
    try {
      const contract = getContract();
      const tx = await contract.fileFIR(complaintId, firNumber);
      const receipt = await tx.wait();
      logger.info('FIR filed on blockchain', { complaintId, txHash: receipt.hash });
      return receipt.hash;
    } catch (error: any) {
      logger.error('Error filing FIR on blockchain', { error: error.message });
      throw error;
    }
  },

  async getComplaint(complaintId: number): Promise<any> {
    try {
      const contract = getContract();
      const complaint = await contract.getComplaint(complaintId);
      return complaint;
    } catch (error: any) {
      logger.error('Error getting complaint from blockchain', { error: error.message });
      throw error;
    }
  },
};

