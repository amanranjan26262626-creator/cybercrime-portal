'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import apiClient from '@/lib/api-client';

interface Complaint {
  id: string;
  complaint_number: string;
  crime_type: string;
  status: string;
  severity_score: number;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await apiClient.get('/complaints');
      setComplaints(response.data.data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Complaints</h1>
          <Link
            href="/complaint/new"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            + New Complaint
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">No complaints yet</p>
            <Link
              href="/complaint/new"
              className="text-primary hover:underline"
            >
              Report your first complaint
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {complaints.map((complaint) => (
              <Link
                key={complaint.id}
                href={`/complaint/${complaint.id}`}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{complaint.complaint_number}</h3>
                    <p className="text-gray-600 mt-1">{complaint.crime_type}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                      {complaint.status.replace('_', ' ')}
                    </span>
                    <p className="text-sm text-gray-500 mt-2">
                      Severity: {complaint.severity_score}/100
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

