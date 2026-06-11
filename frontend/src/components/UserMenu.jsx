import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

const UserMenu = () => {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-semibold shadow-sm cursor-pointer border border-border hover:ring-2 hover:ring-primary/50 transition-all"
      >
        {user?.name?.charAt(0).toUpperCase()}
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-56 bg-surface/90 backdrop-blur-xl border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border bg-background/50">
              <p className="text-sm font-bold text-textPrimary truncate">{user?.name}</p>
              <p className="text-xs text-textSecondary truncate mt-0.5">{user?.email}</p>
            </div>

            {/* Menu Items */}
            <div className="p-2 space-y-1">
              <button 
                onClick={() => handleNavigation('/dashboard/settings')}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-textSecondary rounded-lg hover:bg-card hover:text-textPrimary transition-colors"
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </button>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-border bg-background/30">
              <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full flex items-center px-3 py-2 text-sm font-bold text-danger rounded-lg hover:bg-danger/10 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
