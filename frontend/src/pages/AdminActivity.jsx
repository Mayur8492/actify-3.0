import React, { useState, useEffect } from 'react';
import { Activity, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import { api } from '../store/useAuthStore';

const AdminActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get('/admin/activity');
        setActivities(res.data.activities);
      } catch (error) {
        console.error('Failed to load activity feed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-textPrimary">Activity Monitor</h1>
        <p className="text-textSecondary mt-1">Real-time global event stream.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-textPrimary mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" /> Platform Events
        </h2>
        
        {loading ? (
          <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-border mx-auto mb-4" />
            <p className="text-textSecondary">No activity logged yet.</p>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {activities.map((activity, index) => (
              <div key={activity._id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-surface/80 text-textSecondary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-surface/50 hover:bg-surface/80 transition-colors shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-textPrimary">{activity.action}</h3>
                    <time className="text-xs font-medium text-textSecondary">
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                  <p className="text-sm text-textSecondary">
                    <span className="font-medium text-textPrimary">{activity.userId?.name}</span> performed an action on <span className="font-medium">{activity.entityType}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminActivity;
