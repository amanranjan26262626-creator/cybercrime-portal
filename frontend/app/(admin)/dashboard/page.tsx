'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import apiClient from '@/lib/api-client';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalComplaints: 0,
    activePolice: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, complaintsRes] = await Promise.all([
        apiClient.get('/admin/users'),
        apiClient.get('/admin/complaints'),
      ]);

      setStats({
        totalUsers: usersRes.data.data.users?.length || 0,
        totalComplaints: complaintsRes.data.data.complaints?.length || 0,
        activePolice: 0,
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
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Complaints</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalComplaints}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Active Police</h3>
            <p className="text-3xl font-bold text-green-600">{stats.activePolice}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a href="/admin/users" className="block text-primary hover:underline">
                Manage Users
              </a>
              <a href="/admin/complaints" className="block text-primary hover:underline">
                View All Complaints
              </a>
              <a href="/admin/analytics" className="block text-primary hover:underline">
                System Analytics
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

