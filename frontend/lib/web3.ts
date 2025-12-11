import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, POLYGON_RPC } from './constants';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Contract ABI (will be updated after deployment)
const CONTRACT_ABI = [
  'function submitComplaint(string memory ipfsHash, uint8 severity) external returns (uint256)',
  'function getComplaint(uint256 complaintId) external view returns (tuple(uint256 id, string ipfsHash, address reporter, uint8 severity, uint8 status, uint256 timestamp, address assignedTo, string firNumber))',
  'event ComplaintSubmitted(uint256 indexed complaintId, address indexed reporter, string ipfsHash, uint8 severity)',
];

export const getProvider = (): ethers.BrowserProvider => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error('MetaMask not found');
};

export const connectWallet = async (): Promise<string> => {
  try {
    const provider = getProvider();
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    return address;
  } catch (error) {
    throw new Error('Failed to connect wallet');
  }
};

export const getContract = async (): Promise<ethers.Contract> => {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured');
  }
  const provider = getProvider();
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const switchToPolygonMumbai = async (): Promise<void> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not found');
  }
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x13881' }], // Polygon Mumbai
    });
  } catch (error: any) {
    if (error.code === 4902) {
      // Chain not added, add it
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x13881',
            chainName: 'Polygon Mumbai',
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18,
            },
            rpcUrls: [POLYGON_RPC],
            blockExplorerUrls: ['https://mumbai.polygonscan.com'],
          },
        ],
      });
    }
  }
};

