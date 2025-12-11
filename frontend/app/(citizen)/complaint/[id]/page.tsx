'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import apiClient from '@/lib/api-client';
import ChatbotWindow from '@/components/chatbot/ChatbotWindow';

interface Complaint {
  id: string;
  complaint_number: string;
  crime_type: string;
  description: string;
  amount: number | null;
  status: string;
  severity_score: number;
  ipfs_hash: string;
  blockchain_tx_hash: string | null;
  fir_number: string | null;
  created_at: string;
  location: any;
}

export default function ComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaint();
  }, []);

  const fetchComplaint = async () => {
    try {
      const response = await apiClient.get(`/complaints/${params.id}`);
      setComplaint(response.data.data.complaint);
    } catch (error) {
      console.error('Error fetching complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      submitted: 'bg-blue-100 text-blue-800',
      verified: 'bg-green-100 text-green-800',
      under_investigation: 'bg-yellow-100 text-yellow-800',
      fir_filed: 'bg-purple-100 text-purple-800',
      closed: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Complaint not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Complaint Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold">{complaint.complaint_number}</h1>
                <p className="text-gray-600 mt-1">
                  {new Date(complaint.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                {complaint.status.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Crime Type</label>
                <p className="text-lg">{complaint.crime_type}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-800">{complaint.description}</p>
              </div>

              {complaint.amount && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <p className="text-lg font-semibold">₹{complaint.amount.toLocaleString()}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">Severity Score</label>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${complaint.severity_score}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{complaint.severity_score}/100</p>
                </div>
              </div>

              {complaint.location && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-800">
                    {complaint.location.city}, {complaint.location.state}
                  </p>
                </div>
              )}

              {complaint.blockchain_tx_hash && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Blockchain Transaction</label>
                  <a
                    href={`https://mumbai.polygonscan.com/tx/${complaint.blockchain_tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {complaint.blockchain_tx_hash.slice(0, 20)}...
                  </a>
                </div>
              )}

              {complaint.fir_number && (
                <div>
                  <label className="text-sm font-medium text-gray-500">FIR Number</label>
                  <p className="text-lg font-semibold text-green-600">{complaint.fir_number}</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Chatbot */}
          <div>
            <h2 className="text-xl font-bold mb-4">AI Assistant</h2>
            <ChatbotWindow complaintId={complaint.id} />
          </div>
        </div>
      </main>
    </div>
  );
}

