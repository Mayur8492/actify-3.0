import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../store/useAuthStore';
import { Zap, Target, Flame, TrendingUp, Activity, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        await api.post('/analytics/analyze');
        const res = await api.get('/analytics');
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-textSecondary font-medium">Crunching your behavioral data...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.pattern) {
    return (
      <div className="pt-10 max-w-2xl mx-auto">
        <EmptyState 
          icon={Activity}
          title="No Analytics Data Yet"
          description="Complete tasks, use the focus timer, and log your habits to generate personalized behavioral insights."
        />
      </div>
    );
  }

  const { pattern, insights, chartData, completedTasks, activeHabits, recentSessions } = data;
  
  const pScore = pattern?.productivityScore || 0;
  const fScore = pattern?.focusScore || 0;
  const cScore = pattern?.consistencyScore || 0;
  const compEff = pattern?.completionEfficiency || 0;

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const statCards = [
    { title: 'Productivity', value: `${pScore}%`, icon: Zap, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Focus', value: `${fScore}%`, icon: Target, color: 'text-success', bg: 'bg-success/10' },
    { title: 'Consistency', value: `${cScore}%`, icon: Flame, color: 'text-warning', bg: 'bg-warning/10' },
    { title: 'Completion Eff.', value: `${compEff}%`, icon: TrendingUp, color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-textPrimary">Behavioral Analytics</h1>
        <p className="text-textSecondary mt-1">Deep dive into your productivity patterns and insights.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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
              <p className="text-3xl font-bold text-textPrimary">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="p-6 h-full min-h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold text-textPrimary mb-6">Weekly Performance Trend</h3>
            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#94A3B8" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                  <YAxis stroke="#94A3B8" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgb(var(--bg-card))', border: '1px solid rgba(var(--border-color), 0.1)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'rgb(var(--text-primary))', fontWeight: 500 }}
                    labelStyle={{ color: 'rgb(var(--text-secondary))', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="productivity" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" />
                  <Area type="monotone" dataKey="focus" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-0 h-full flex flex-col">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-textPrimary">AI Insights</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[400px] custom-scrollbar">
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-0 flex flex-col">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-textPrimary">Recently Completed Tasks</h3>
          </div>
          <div className="p-6 overflow-y-auto max-h-[350px] custom-scrollbar">
            {completedTasks && completedTasks.length > 0 ? (
              <div className="space-y-3">
                {completedTasks.map(task => (
                  <div key={task._id} className="flex justify-between items-center p-3 rounded-lg border border-border/50 hover:bg-surface/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <CheckSquare className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium text-textPrimary truncate">{task.title}</span>
                    </div>
                    <span className="text-xs text-textSecondary flex-shrink-0 ml-2">{new Date(task.updatedAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 opacity-50">
                <CheckSquare className="w-6 h-6 text-textSecondary mb-2" />
                <p className="text-sm text-textSecondary">No completed tasks yet.</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-0 flex flex-col">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-textPrimary">Active Habits & Streaks</h3>
          </div>
          <div className="p-6 overflow-y-auto max-h-[350px] custom-scrollbar">
            {activeHabits && activeHabits.length > 0 ? (
              <div className="space-y-3">
                {activeHabits.map(habit => (
                  <div key={habit._id} className="flex justify-between items-center p-3 rounded-lg border border-border/50 hover:bg-surface/50 transition-colors">
                    <span className="text-sm font-medium text-textPrimary truncate">{habit.title}</span>
                    <div className="flex items-center text-orange-500 font-bold text-sm bg-orange-500/10 px-2 py-1 rounded-md flex-shrink-0 ml-2">
                      <Flame className="w-3.5 h-3.5 mr-1.5" />
                      {habit.streak} Day
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 opacity-50">
                <Flame className="w-6 h-6 text-textSecondary mb-2" />
                <p className="text-sm text-textSecondary">No active habit streaks.</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-0 flex flex-col">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-textPrimary">Recent Focus Sessions</h3>
          </div>
          <div className="p-6 overflow-y-auto max-h-[350px] custom-scrollbar">
            {recentSessions && recentSessions.length > 0 ? (
              <div className="space-y-3">
                {recentSessions.map(session => (
                  <div key={session._id} className="flex justify-between items-center p-3 rounded-lg border border-border/50 hover:bg-surface/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium text-textPrimary">{formatDuration(session.duration)}</span>
                    </div>
                    <span className="text-xs text-textSecondary flex-shrink-0 ml-2">{new Date(session.endTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 opacity-50">
                <Target className="w-6 h-6 text-textSecondary mb-2" />
                <p className="text-sm text-textSecondary">No focus sessions yet.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
