import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { useSocketStore } from '../store/useSocketStore';
import UserMenu from '../components/UserMenu';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { Menu, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const location = useLocation();
  const { fetchWorkspaces } = useWorkspaceStore();
  const { connect, disconnect } = useSocketStore();
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/30">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-border bg-surface/50 backdrop-blur-md flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 -ml-2 text-textSecondary hover:text-textPrimary hover:bg-card rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-textSecondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <NotificationBell />
            <div className="hidden sm:block h-5 w-px bg-border mx-2"></div>
            <UserMenu />
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
