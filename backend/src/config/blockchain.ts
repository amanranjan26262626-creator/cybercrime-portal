import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

let provider: ethers.Provider | null = null;
let signer: ethers.Signer | null = null;

export const getProvider = (): ethers.Provider => {
  if (!provider) {
    const rpcUrl = process.env.POLYGON_RPC;
    if (!rpcUrl) {
      throw new Error('POLYGON_RPC is not defined in environment variables');
    }
    provider = new ethers.JsonRpcProvider(rpcUrl);
  }
  return provider;
};

export const getSigner = (): ethers.Signer => {
  if (!signer) {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('PRIVATE_KEY is not defined in environment variables');
    }
    signer = new ethers.Wallet(privateKey, getProvider());
  }
  return signer;
};

export const getContractAddress = (): string => {
  const address = process.env.CONTRACT_ADDRESS;
  if (!address) {
    throw new Error('CONTRACT_ADDRESS is not defined in environment variables');
  }
  return address;
};

