import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Activity, CheckSquare, Target, Clock, Calendar, Zap } from 'lucide-react';
import Card from '../components/ui/Card';
import { api } from '../store/useAuthStore';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/admin/users/${id}`);
        setData(res.data);
      } catch (error) {
        console.error('Failed to load user details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  if (!data) return <div className="p-6 text-textSecondary">User not found.</div>;

  const { user, analytics, taskAnalytics, totalSessions, focusData } = data;

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/admin/users')}
        className="flex items-center gap-2 text-sm text-textSecondary hover:text-textPrimary transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </button>

      {/* User Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-textPrimary">{user.name}</h1>
            <p className="text-textSecondary mb-2">{user.email}</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface border border-border capitalize text-textSecondary">{user.role}</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                user.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
              }`}>{user.status}</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface border border-border text-textSecondary">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-t-4 border-yellow-500">
          <p className="text-sm font-medium text-textSecondary flex items-center gap-2"><Zap className="w-4 h-4" /> Productivity</p>
          <p className="text-3xl font-bold text-textPrimary mt-2">{analytics.productivityScore}%</p>
        </Card>
        <Card className="p-6 border-t-4 border-red-500">
          <p className="text-sm font-medium text-textSecondary flex items-center gap-2"><Target className="w-4 h-4" /> Focus</p>
          <p className="text-3xl font-bold text-textPrimary mt-2">{analytics.focusScore}%</p>
        </Card>
        <Card className="p-6 border-t-4 border-indigo-500">
          <p className="text-sm font-medium text-textSecondary flex items-center gap-2"><Calendar className="w-4 h-4" /> Consistency</p>
          <p className="text-3xl font-bold text-textPrimary mt-2">{analytics.consistencyScore}%</p>
        </Card>
        <Card className="p-6 border-t-4 border-emerald-500">
          <p className="text-sm font-medium text-textSecondary flex items-center gap-2"><CheckSquare className="w-4 h-4" /> Completion Rate</p>
          <p className="text-3xl font-bold text-textPrimary mt-2">{taskAnalytics.completionRate.toFixed(1)}%</p>
        </Card>
      </div>

      {/* Task & Focus Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-textPrimary mb-4 flex items-center gap-2"><CheckSquare className="w-5 h-5 text-primary" /> Task Analytics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-surface/50 rounded-lg">
              <span className="text-textSecondary">Total Tasks Created</span>
              <span className="font-bold text-textPrimary">{taskAnalytics.totalTasks}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
              <span className="font-medium">Completed Tasks</span>
              <span className="font-bold">{taskAnalytics.completedTasks}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-500/10 rounded-lg text-yellow-500">
              <span className="font-medium">Pending Tasks</span>
              <span className="font-bold">{taskAnalytics.pendingTasks}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-textPrimary mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Focus Patterns</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={focusData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{fontSize: 12}} />
                <YAxis stroke="#9ca3af" tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} />
                <Bar dataKey="focus" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Hours Focused" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

    </div>
  );
};

export default AdminUserDetails;
