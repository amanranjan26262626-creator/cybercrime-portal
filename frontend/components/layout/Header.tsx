'use client';

import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';

export default function Header() {
  const { address, isConnected, connect, disconnect } = useWallet();

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          Cybercrime Portal
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link href="/complaint/new" className="text-gray-700 hover:text-primary">
            Report Crime
          </Link>
          <Link href="/my-complaints" className="text-gray-700 hover:text-primary">
            My Complaints
          </Link>
          
          {isConnected ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <button
                onClick={disconnect}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Connect Wallet
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

