import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, Settings, LogOut, ChevronDown, BarChart2, FileText, Sun, Moon, Shield, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Reports & Insights', path: '/admin/reports', icon: FileText },
    { name: 'Activity Monitor', path: '/admin/activity', icon: Activity },
    { name: 'Platform Stats', path: '/admin/statistics', icon: BarChart2 },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
    { name: 'Admin Profile', path: '/admin/profile', icon: User },
  ];

  const sidebarContent = (
    <div className="h-full w-64 bg-surface/50 backdrop-blur-xl border-r border-border flex flex-col justify-between shadow-2xl relative z-40">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
            <Shield className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-textPrimary to-textSecondary">
            Admin Panel
          </span>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
                    : 'text-textSecondary hover:bg-surface hover:text-textPrimary hover:shadow-sm'
                }`
              }
            >
              <item.icon className={`mr-3 w-5 h-5 transition-colors duration-200`} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

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
      <div className="hidden md:block h-full">
        {sidebarContent}
      </div>
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

export default AdminSidebar;
