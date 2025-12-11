'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import apiClient from '@/lib/api-client';
import Link from 'next/link';

interface Stats {
  total: number;
  pending: number;
  assigned: number;
  resolved: number;
}

export default function PoliceDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, assigned: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'police') {
      router.push('/login');
      return;
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [allRes, pendingRes, assignedRes] = await Promise.all([
        apiClient.get('/police/complaints'),
        apiClient.get('/police/complaints/pending'),
        apiClient.get('/police/complaints/assigned'),
      ]);

      setStats({
        total: allRes.data.data.complaints.length,
        pending: pendingRes.data.data.complaints.length,
        assigned: assignedRes.data.data.complaints.length,
        resolved: 0, // Calculate from status
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Police Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Complaints</h3>
            <p className="text-3xl font-bold text-primary">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Assigned to Me</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.assigned}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Resolved</h3>
            <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/police/complaints/pending"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">Pending Complaints</h3>
            <p className="text-gray-600">Review and assign new complaints</p>
          </Link>

          <Link
            href="/police/complaints/assigned"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">My Cases</h3>
            <p className="text-gray-600">View complaints assigned to you</p>
          </Link>

          <Link
            href="/police/analytics"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600">View detailed analytics and reports</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

