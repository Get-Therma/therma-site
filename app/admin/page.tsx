// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import BulkSyncAdmin from '../../components/BulkSyncAdmin';

interface DashboardData {
  waitlistCount: number;
  contactsCount: number;
  recentWaitlist: any[];
  recentContacts: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    waitlistCount: 0,
    contactsCount: 0,
    recentWaitlist: [],
    recentContacts: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sync'>('dashboard');

  useEffect(() => {
    // Fetch initial data
    fetchDashboardData();

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/dashboard');
      const dashboardData = await response.json();
      setData(dashboardData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Therma Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <p className="text-sm text-gray-400">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'sync'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Bulk Sync
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' ? (
          <>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Waitlist Signups</h3>
            <p className="text-3xl font-bold text-green-400">{data.waitlistCount}</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Contact Submissions</h3>
            <p className="text-3xl font-bold text-blue-400">{data.contactsCount}</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Conversion Rate</h3>
            <p className="text-3xl font-bold text-purple-400">
              {data.waitlistCount > 0 ? ((data.contactsCount / data.waitlistCount) * 100).toFixed(1) : 0}%
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-orange-400">{data.waitlistCount + data.contactsCount}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Waitlist */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Waitlist Signups</h3>
            <div className="space-y-3">
              {data.recentWaitlist.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-white/10">
                  <div>
                    <p className="font-medium">{item.email}</p>
                    <p className="text-sm text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    {item.source || 'website'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Contacts */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Contact Submissions</h3>
            <div className="space-y-3">
              {data.recentContacts.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-white/10">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.subject}</p>
                    <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
          </>
        ) : (
          <BulkSyncAdmin />
        )}
      </div>
    </div>
  );
}