'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { connectWallet, switchToPolygonMumbai } from '@/lib/web3';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [address, setAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAddress(accounts[0].address);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connect = async () => {
    setIsConnecting(true);
    setError('');
    try {
      await switchToPolygonMumbai();
      const addr = await connectWallet();
      setAddress(addr);
      setIsConnected(true);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress('');
    setIsConnected(false);
  };

  return {
    address,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
  };
};

