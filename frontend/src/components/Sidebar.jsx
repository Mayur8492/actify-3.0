import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FileText, Settings, LogOut, ChevronDown, Plus, PieChart, Shield, Flame, Moon, Sun, Menu, X, Target, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { useThemeStore } from '../store/useThemeStore';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuthStore();
  const { workspaces, activeWorkspace, setActiveWorkspace, createWorkspace } = useWorkspaceStore();
  const { theme, toggleTheme } = useThemeStore();
  const [wsDropdownOpen, setWsDropdownOpen] = useState(false);

  const handleCreateWorkspace = async () => {
    const name = prompt('Enter workspace name:');
    if (name) {
      await createWorkspace(name);
      setWsDropdownOpen(false);
    }
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/dashboard/tasks', icon: CheckSquare },
    { name: 'Habits', path: '/dashboard/habits', icon: Flame },
    { name: 'Focus', path: '/dashboard/focus', icon: Target },
    { name: 'Pages', path: '/dashboard/pages', icon: FileText },
    { name: 'Analytics', path: '/dashboard/analytics', icon: PieChart },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="w-64 bg-surface/80 backdrop-blur-md border-r border-border flex flex-col justify-between h-full shadow-sm z-40">
      <div className="p-5 overflow-y-auto custom-scrollbar">
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold text-xl border border-primary/20 shadow-sm">
              A
            </div>
            <span className="text-xl font-bold text-textPrimary tracking-tight">Actify</span>
          </Link>
          {setIsMobileOpen && (
            <button onClick={() => setIsMobileOpen(false)} className="md:hidden p-1 text-textSecondary hover:bg-surface rounded">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Workspace Selector */}
        <div className="mb-8 relative">
          <p className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2 ml-1">Workspace</p>
          <div 
            onClick={() => setWsDropdownOpen(!wsDropdownOpen)}
            className="flex items-center justify-between px-3 py-2 bg-background border border-border rounded-xl cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium text-textPrimary truncate">
                {activeWorkspace ? activeWorkspace.name : 'No Workspace'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-textSecondary" />
          </div>
          
          <AnimatePresence>
            {wsDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 w-full mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <div className="max-h-48 overflow-y-auto custom-scrollbar">
                  {workspaces.map((ws) => (
                    <div 
                      key={ws._id}
                      className={`group flex items-center justify-between px-3 py-2.5 text-sm cursor-pointer hover:bg-surface/80 transition-colors ${activeWorkspace?._id === ws._id ? 'text-primary font-medium bg-primary/5' : 'text-textPrimary'}`}
                    >
                      <div className="flex-1 truncate" onClick={() => { setActiveWorkspace(ws); setWsDropdownOpen(false); }}>
                        {ws.name}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete the workspace "${ws.name}"?`)) {
                            useWorkspaceStore.getState().deleteWorkspace(ws._id);
                          }
                        }}
                        title="Delete Workspace"
                        className="opacity-0 group-hover:opacity-100 p-1 ml-2 text-textSecondary hover:text-danger hover:bg-danger/10 rounded transition-all flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div 
                  onClick={handleCreateWorkspace}
                  className="px-3 py-2.5 text-sm text-textSecondary cursor-pointer hover:bg-surface/80 hover:text-textPrimary flex items-center border-t border-border transition-colors bg-background/50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Workspace
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 mb-8">
          <p className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2 ml-1">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-textSecondary hover:bg-card hover:text-textPrimary hover:shadow-sm'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" strokeWidth={2} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Exit Demo Button */}
        {user?.isDemo && (
          <div className="px-1 mt-4">
            <button 
              onClick={() => {
                logout();
                window.location.href = '/';
              }} 
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-danger/10 text-danger hover:bg-danger/20 rounded-xl text-sm font-semibold transition-all border border-danger/20 shadow-sm hover:shadow"
            >
              <LogOut className="w-4 h-4" />
              Exit Live Demo
            </button>
          </div>
        )}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-border bg-surface/50">
        <div className="flex items-center px-2 py-1">
          <div className="flex items-center min-w-0">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center mr-3 font-semibold flex-shrink-0 shadow-sm border border-border">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-textPrimary truncate">{user?.name}</p>
              <p className="text-xs text-textSecondary truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 z-50 md:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
