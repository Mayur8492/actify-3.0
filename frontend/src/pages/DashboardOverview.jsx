import React, { useEffect, useState } from 'react';
import { useAuthStore, api } from '../store/useAuthStore';
import { Loader2, TrendingUp, Target, Zap, CheckCircle2, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';

const DashboardOverview = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    productivityScore: 0,
    focusScore: 0,
    consistencyScore: 0,
    completedTasks: 0
  });
  const [insights, setInsights] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics');
        if (res.data) {
          if (res.data.pattern) {
            setStats({
              productivityScore: res.data.pattern.productivityScore || 0,
              focusScore: res.data.pattern.focusScore || 0,
              consistencyScore: res.data.pattern.consistencyScore || 0,
              completedTasks: res.data.pattern.completedTasks || 0
            });
          }
          setInsights(res.data.insights || []);
          setRecentSessions(res.data.recentSessions || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const statCards = [
    { title: 'Productivity Score', value: `${stats.productivityScore}%`, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Focus Score', value: `${stats.focusScore}%`, icon: Target, color: 'text-success', bg: 'bg-success/10' },
    { title: 'Consistency Score', value: `${stats.consistencyScore}%`, icon: Zap, color: 'text-warning', bg: 'bg-warning/10' },
    { title: 'Completed Tasks', value: stats.completedTasks, icon: CheckCircle2, color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-textPrimary">Welcome back, {user?.name}!</h1>
        <p className="text-textSecondary mt-1">Here's what's happening with your productivity today.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {statCards.map((stat, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card hover className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-textSecondary">{stat.title}</h3>
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-textPrimary">{stat.value}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-0 flex flex-col h-[400px]">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-textPrimary">Recent Insights</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {insights && insights.length > 0 ? (
                  insights.map((insight) => (
                    <div key={insight._id} className="p-4 rounded-xl bg-surface/50 border border-border">
                      <div className="flex items-center mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 rounded-full bg-primary/10">
                          {insight.type}
                        </span>
                      </div>
                      <p className="text-sm text-textSecondary leading-relaxed">{insight.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-50">
                    <Activity className="w-8 h-8 text-textSecondary mb-2" />
                    <p className="text-sm text-textSecondary">No insights generated yet.</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-0 flex flex-col h-[400px]">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-textPrimary">Recent Focus Sessions</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {recentSessions && recentSessions.length > 0 ? (
                  <div className="space-y-3">
                    {recentSessions.map(session => (
                      <div key={session._id} className="flex justify-between items-center p-3 rounded-lg border border-border/50 hover:bg-surface/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Target className="w-4 h-4 text-success" />
                          <div>
                            <div className="text-sm font-medium text-textPrimary">{formatDuration(session.duration)} Focus</div>
                            <div className="text-xs text-textSecondary">{session.interruptions} interruptions</div>
                          </div>
                        </div>
                        <span className="text-xs text-textSecondary bg-surface px-2 py-1 rounded-md">
                          {new Date(session.endTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-50">
                    <Target className="w-8 h-8 text-textSecondary mb-2" />
                    <p className="text-sm text-textSecondary">No activity data available.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardOverview;
