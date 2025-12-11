'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import apiClient from '@/lib/api-client';

interface Complaint {
  id: string;
  complaint_number: string;
  crime_type: string;
  description: string;
}

export default function FIRGenerator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const complaintId = searchParams.get('complaintId');

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [formData, setFormData] = useState({
    station_code: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (complaintId) {
      fetchComplaint();
    }
  }, [complaintId]);

  const fetchComplaint = async () => {
    try {
      const response = await apiClient.get(`/police/complaints/${complaintId}`);
      setComplaint(response.data.data.complaint);
    } catch (error) {
      console.error('Error fetching complaint:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/fir/generate', {
        complaint_id: complaintId,
        station_code: formData.station_code,
      });

      alert(`FIR generated successfully: ${response.data.data.fir.fir_number}`);
      router.push(`/police/complaints/${complaintId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate FIR');
    } finally {
      setLoading(false);
    }
  };

  if (!complaint) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Generate FIR</h2>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Complaint Details</h3>
        <p><strong>Number:</strong> {complaint.complaint_number}</p>
        <p><strong>Type:</strong> {complaint.crime_type}</p>
        <p><strong>Description:</strong> {complaint.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Station Code *
          </label>
          <input
            type="text"
            required
            value={formData.station_code}
            onChange={(e) => setFormData({ ...formData, station_code: e.target.value })}
            placeholder="e.g., ST001"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate FIR'}
          </button>
        </div>
      </form>
    </div>
  );
}

