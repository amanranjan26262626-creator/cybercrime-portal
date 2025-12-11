'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import apiClient from '@/lib/api-client';

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

export default function PoliceComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, []);

  const fetchComplaint = async () => {
    try {
      const response = await apiClient.get(`/police/complaints/${params.id}`);
      setComplaint(response.data.data.complaint);
      setStatus(response.data.data.complaint.status);
    } catch (error) {
      console.error('Error fetching complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!status || status === complaint?.status) return;

    setUpdating(true);
    try {
      await apiClient.put(`/police/complaints/${params.id}/status`, { status });
      await fetchComplaint();
      alert('Status updated successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
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
        <div className="grid md:grid-cols-3 gap-8">
          {/* Complaint Details */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-6">{complaint.complaint_number}</h1>

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

              {complaint.blockchain_tx_hash && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Blockchain Transaction</label>
                  <a
                    href={`https://mumbai.polygonscan.com/tx/${complaint.blockchain_tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all block"
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

          {/* Actions Sidebar */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Actions</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="submitted">Submitted</option>
                  <option value="verified">Verified</option>
                  <option value="under_investigation">Under Investigation</option>
                  <option value="fir_filed">FIR Filed</option>
                  <option value="closed">Closed</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating || status === complaint.status}
                  className="mt-2 w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </div>

              <button
                onClick={() => router.push(`/police/fir/generate?complaintId=${complaint.id}`)}
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Generate FIR
              </button>

              <button
                onClick={() => router.push(`/police/complaints/${complaint.id}/assign`)}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Assign Case
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

