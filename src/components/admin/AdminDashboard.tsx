import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Fetch basic stats - you'll need to adjust these based on your actual database structure
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { data: sellers, error: sellersError } = await supabase
        .from('sellers')
        .select('*', { count: 'exact', head: true });

      if (usersError || sellersError) {
        console.error('Error fetching stats:', usersError || sellersError);
        throw new Error('Failed to fetch statistics');
      }

      return {
        totalUsers: users?.count || 0,
        totalSellers: sellers?.count || 0,
        pendingApplications: 0, // You'll need to implement this based on your business logic
        totalRevenue: 0, // You'll need to implement this based on your business logic
      };
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      color: 'bg-blue-500',
      icon: '👥',
    },
    {
      title: 'Total Sellers',
      value: stats?.totalSellers || 0,
      color: 'bg-green-500',
      icon: '🏪',
    },
    {
      title: 'Pending Applications',
      value: stats?.pendingApplications || 0,
      color: 'bg-yellow-500',
      icon: '⏳',
    },
    {
      title: 'Total Revenue',
      value: `$${stats?.totalRevenue?.toLocaleString() || '0'}`,
      color: 'bg-purple-500',
      icon: '💰',
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
      <p className="text-gray-600 mb-8">Welcome to your admin dashboard</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                <span className="text-white text-xl">{card.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">Recent activity will appear here</p>
          <p className="text-sm text-gray-400 mt-2">This section is under development</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;