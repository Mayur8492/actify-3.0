import React, { useEffect, useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Plus, Calendar, Clock, CheckCircle2, Circle, Pencil, Trash2, X, Check, ListTodo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

const Tasks = () => {
  const { tasks, fetchTasks, createTask, updateTask, deleteTask } = useTaskStore();
  const { activeWorkspace } = useWorkspaceStore();
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [editDueDate, setEditDueDate] = useState('');

  useEffect(() => {
    if (activeWorkspace) {
      fetchTasks(activeWorkspace._id);
    }
  }, [activeWorkspace, fetchTasks]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeWorkspace) return;
    await createTask({
      title: newTaskTitle,
      workspaceId: activeWorkspace._id,
      status: 'Pending',
      priority: newPriority,
    });
    setNewTaskTitle('');
    setNewPriority('Medium');
  };

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    await updateTask(task._id, { status: newStatus });
  };

  const handleEditClick = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditPriority(task.priority || 'Medium');
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '');
  };

  const handleSaveEdit = async (id) => {
    if (!editTitle.trim()) return;
    await updateTask(id, {
      title: editTitle,
      priority: editPriority,
      dueDate: editDueDate ? new Date(editDueDate).toISOString() : null
    });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  if (!activeWorkspace) {
    return (
      <div className="pt-10 max-w-2xl mx-auto">
        <EmptyState 
          icon={ListTodo}
          title="No Workspace Selected"
          description="Please select a workspace from the sidebar to start managing your tasks."
        />
      </div>
    );
  }

  // Sort tasks: pending first, then completed. Inside groups, sort by date descending.
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === 'Completed' && b.status !== 'Completed') return 1;
    if (a.status !== 'Completed' && b.status === 'Completed') return -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto pb-8">
      <div className="mb-8 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-textPrimary">Tasks</h1>
        <p className="text-textSecondary mt-1">Manage your actionable items in {activeWorkspace.name}</p>
      </div>

      <Card className="p-4 mb-8 shrink-0">
        <form onSubmit={handleCreateTask} className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 flex items-center bg-background border border-border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all rounded-lg px-3 py-2 w-full">
            <Plus className="h-5 w-5 text-textSecondary mr-2" />
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="bg-transparent border-none outline-none text-sm text-textPrimary w-full placeholder:text-textSecondary/50"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-textPrimary"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            
            <button
              type="submit"
              className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all whitespace-nowrap shadow-sm hover:shadow active:scale-95"
            >
              Add Task
            </button>
          </div>
        </form>
      </Card>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
        {sortedTasks.length === 0 ? (
          <EmptyState 
            icon={ListTodo}
            title="All Caught Up!"
            description="You have no tasks in this workspace. Add one above to get started."
          />
        ) : (
          <motion.div layout className="space-y-3">
            <AnimatePresence>
              {sortedTasks.map((task) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={task._id} 
                  className={`flex items-center p-4 bg-card rounded-xl border border-border shadow-sm transition-all hover:shadow-md hover:border-primary/20 group ${task.status === 'Completed' ? 'opacity-60 bg-surface/30' : ''}`}
                >
                  <button 
                    onClick={() => handleToggleComplete(task)}
                    className={`mr-4 transition-colors ${task.status === 'Completed' ? 'text-success' : 'text-textSecondary hover:text-primary'}`}
                  >
                    {task.status === 'Completed' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    {editingId === task._id ? (
                      <div className="flex flex-col sm:flex-row gap-2 mt-1 mb-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="bg-background border border-border focus:border-primary rounded-lg px-3 py-1.5 text-sm text-textPrimary flex-1 focus:outline-none transition-colors"
                        />
                        <select
                          value={editPriority}
                          onChange={(e) => setEditPriority(e.target.value)}
                          className="bg-background border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none text-textPrimary"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                        <input
                          type="datetime-local"
                          value={editDueDate}
                          onChange={(e) => setEditDueDate(e.target.value)}
                          className="bg-background border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none text-textPrimary"
                        />
                        <div className="flex gap-1">
                          <button onClick={() => handleSaveEdit(task._id)} className="p-1.5 bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 bg-surface text-textSecondary border border-border rounded-lg hover:bg-surface/80 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className={`font-medium truncate transition-colors ${task.status === 'Completed' ? 'line-through text-textSecondary' : 'text-textPrimary'}`}>
                          {task.title}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-textSecondary">
                          {task.priority && (
                            <span className={`font-medium px-2 py-0.5 rounded-full border ${
                              task.priority === 'High' || task.priority === 'Critical' ? 'bg-danger/10 text-danger border-danger/20' : 
                              task.priority === 'Medium' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-surface text-textSecondary border-border'
                            }`}>
                              {task.priority}
                            </span>
                          )}
                          
                          {task.dueDate && (
                            <span className="flex items-center gap-1.5 bg-surface px-2 py-0.5 rounded-md border border-border">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(task.dueDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                          )}
                          
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 opacity-70" />
                            {new Date(task.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {editingId !== task._id && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                      <button onClick={() => handleEditClick(task)} className="p-2 bg-surface text-textSecondary hover:text-primary rounded-lg border border-transparent hover:border-border transition-all">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(task._id)} className="p-2 bg-surface text-textSecondary hover:text-danger rounded-lg border border-transparent hover:border-danger/20 hover:bg-danger/5 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
