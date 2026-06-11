import React, { useEffect, useState } from 'react';
import { useHabitStore } from '../store/useHabitStore';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Plus, Check, Flame, Calendar, Trash2, LayoutList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

const Habits = () => {
  const { habits, fetchHabits, createHabit, toggleHabitDate, deleteHabit } = useHabitStore();
  const { activeWorkspace } = useWorkspaceStore();
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (activeWorkspace) {
      fetchHabits(activeWorkspace._id);
    }
  }, [activeWorkspace, fetchHabits]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !activeWorkspace) return;
    await createHabit({ title: newTitle, workspaceId: activeWorkspace._id });
    setNewTitle('');
  };

  // Generate last 7 days array
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0]; // "YYYY-MM-DD"
  });

  if (!activeWorkspace) {
    return (
      <div className="pt-10 max-w-2xl mx-auto">
        <EmptyState 
          icon={LayoutList}
          title="No Workspace Selected"
          description="Please select a workspace from the sidebar to start tracking habits."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary">Habits & Streaks</h1>
          <p className="text-textSecondary mt-1">Build consistency and track your daily routines.</p>
        </div>
        
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 flex items-center bg-background border border-border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all rounded-lg px-3 py-2 w-full sm:w-64">
            <Plus className="h-5 w-5 text-textSecondary mr-2" />
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="New habit..."
              className="bg-transparent border-none outline-none text-sm text-textPrimary w-full placeholder:text-textSecondary/50"
            />
          </div>
          <button type="submit" className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all whitespace-nowrap shadow-sm hover:shadow active:scale-95 w-full sm:w-auto">
            Add
          </button>
        </form>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col p-0">
        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
          <div className="min-w-[700px]">
            {/* Header Row */}
            <div className="flex items-center p-4 border-b border-border bg-surface/50 sticky top-0 z-10 backdrop-blur-md">
              <div className="flex-1 font-semibold text-xs uppercase tracking-wider text-textSecondary pl-2">Habit</div>
              <div className="w-24 text-center font-semibold text-xs uppercase tracking-wider text-textSecondary">Streak</div>
              <div className="flex gap-2 mr-10">
                {last7Days.map(date => {
                  const dateObj = new Date(date);
                  const isToday = date === new Date().toISOString().split('T')[0];
                  return (
                    <div key={date} className={`w-10 flex flex-col items-center justify-center text-xs ${isToday ? 'text-primary font-bold bg-primary/5 rounded-lg py-1' : 'text-textSecondary'}`}>
                      <span>{dateObj.toLocaleDateString('en-US', { weekday: 'narrow' })}</span>
                      <span>{dateObj.getDate()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Habit Rows */}
            {habits.length === 0 ? (
              <div className="p-16">
                <EmptyState 
                  icon={Calendar}
                  title="No Habits Tracked"
                  description="Start building your routine today by adding a new habit above."
                />
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                <AnimatePresence>
                  {habits.map(habit => (
                    <motion.div 
                      key={habit._id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center p-4 hover:bg-surface/30 transition-colors group"
                    >
                      <div className="flex-1 pl-2 min-w-0">
                        <div className="font-medium text-textPrimary truncate">{habit.title}</div>
                        <div className="text-xs text-textSecondary mt-1.5 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 opacity-70" />
                          Created {new Date(habit.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                      </div>
                      
                      <div className="w-24 flex items-center justify-center">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-500 font-bold text-sm">
                          <Flame className="w-3.5 h-3.5" />
                          {habit.streak}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {last7Days.map(date => {
                          const isCompleted = habit.completedDates.includes(date);
                          const isToday = date === new Date().toISOString().split('T')[0];
                          return (
                            <button
                              key={date}
                              onClick={() => toggleHabitDate(habit._id, date)}
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                                isCompleted 
                                  ? 'bg-success text-white border-transparent' 
                                  : isToday 
                                    ? 'bg-surface border-2 border-primary/30 text-transparent hover:border-primary/60 hover:text-primary/30'
                                    : 'bg-surface border border-border text-transparent hover:bg-surface/80 hover:text-textSecondary/30'
                              }`}
                            >
                              <Check className="w-5 h-5" strokeWidth={isCompleted ? 3 : 2} />
                            </button>
                          );
                        })}
                      </div>
                      
                      <div className="w-10 flex justify-end">
                        <button 
                          onClick={() => deleteHabit(habit._id)}
                          className="text-textSecondary hover:text-danger p-2 rounded-lg hover:bg-danger/10 opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-danger/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Habits;
