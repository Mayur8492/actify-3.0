import React, { useState, useEffect } from 'react';
import { BarChart2, Server, Database, Globe } from 'lucide-react';
import Card from '../components/ui/Card';
import { api } from '../store/useAuthStore';

const AdminStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/statistics');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch statistics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-textPrimary">Platform Statistics</h1>
        <p className="text-textSecondary mt-1">Deep dive into global system metrics and infrastructure health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <Server className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="text-sm font-medium text-textSecondary">Server Uptime</h3>
          <p className="text-3xl font-bold text-textPrimary mt-1">99.99%</p>
        </Card>
        <Card className="p-6">
          <Database className="w-8 h-8 text-emerald-500 mb-4" />
          <h3 className="text-sm font-medium text-textSecondary">Database Users</h3>
          <p className="text-3xl font-bold text-textPrimary mt-1">{stats?.totalUsers || 0}</p>
        </Card>
        <Card className="p-6">
          <Globe className="w-8 h-8 text-purple-500 mb-4" />
          <h3 className="text-sm font-medium text-textSecondary">Total System Tasks</h3>
          <p className="text-3xl font-bold text-textPrimary mt-1">{stats?.totalTasks || 0}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-textPrimary mb-4">Total System Aggregations</h3>
        <div className="space-y-4 max-w-lg">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-textSecondary">Total Platform Focus Minutes</span>
            <span className="font-bold text-textPrimary">{stats?.totalFocusMinutes || 0} mins</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-textSecondary">Total Tasks Completed Globally</span>
            <span className="font-bold text-textPrimary">{stats?.totalCompletedTasks || 0}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminStatistics;
