import React, { useEffect, useState } from 'react';
import { api } from '../store/useAuthStore';
import { Play, Square, Pause, Target, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';

const Focus = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [interruptions, setInterruptions] = useState(0);
  
  const [recentSessions, setRecentSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecentSessions = async () => {
    try {
      const res = await api.get('/analytics');
      if (res.data && res.data.recentSessions) {
        setRecentSessions(res.data.recentSessions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentSessions();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, seconds]);

  const startSession = async () => {
    try {
      const res = await api.post('/focus/start');
      setSessionId(res.data.session._id);
      setIsActive(true);
      setIsPaused(false);
    } catch (err) {
      console.error('Failed to start focus session');
    }
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
    if (!isPaused) setInterruptions(i => i + 1);
  };

  const stopSession = async () => {
    try {
      if (sessionId) {
        await api.post(`/focus/${sessionId}/end`, {
          duration: seconds,
          interruptions,
        });
      }
    } catch (err) {
      console.error('Failed to stop focus session');
    } finally {
      setIsActive(false);
      setSeconds(0);
      setSessionId(null);
      setInterruptions(0);
      fetchRecentSessions();
    }
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const formatDuration = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-textPrimary">Focus Mode</h1>
        <p className="text-textSecondary mt-1">Eliminate distractions and get deep work done.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col items-center justify-center p-12 h-80">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative z-10 w-48 h-48 rounded-full border-[6px] border-primary/20 flex flex-col items-center justify-center bg-card shadow-lg">
              <span className="text-5xl font-mono font-bold text-primary tracking-wider">{formatTime(seconds)}</span>
              <span className="text-xs text-textSecondary uppercase tracking-widest mt-2 font-medium">
                {isActive ? (isPaused ? 'Paused' : 'Focusing') : 'Ready'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-4">
            {!isActive ? (
              <button 
                onClick={startSession}
                className="bg-primary text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" /> Start Focus
              </button>
            ) : (
              <>
                <button 
                  onClick={pauseSession}
                  className="bg-warning/10 text-warning border border-warning/20 px-6 py-3 rounded-xl font-semibold hover:bg-warning/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5 fill-current" />} 
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button 
                  onClick={stopSession}
                  className="bg-danger/10 text-danger border border-danger/20 px-6 py-3 rounded-xl font-semibold hover:bg-danger/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Square className="w-5 h-5 fill-current" /> Stop
                </button>
              </>
            )}
          </div>
        </Card>

        <Card className="p-0 flex flex-col h-80">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-textPrimary flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Recent Sessions
            </h3>
          </div>
          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : recentSessions.length > 0 ? (
              <div className="space-y-3">
                {recentSessions.map(session => (
                  <div key={session._id} className="flex justify-between items-center p-3 rounded-lg border border-border/50 hover:bg-surface/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-success" />
                      <div>
                        <div className="text-sm font-medium text-textPrimary">{formatDuration(session.duration)} Focus</div>
                        <div className="text-xs text-textSecondary">{session.interruptions} {session.interruptions === 1 ? 'interruption' : 'interruptions'}</div>
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
                <p className="text-sm text-textSecondary text-center">No focus sessions recorded yet.<br/>Start a timer to get productive!</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Focus;
