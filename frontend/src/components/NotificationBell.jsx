import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Bell } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      socket.emit('join_room', user.id);
    });

    socket.on('new_notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const unreadCount = notifications.filter(n => !n.readStatus).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-card text-textSecondary hover:text-textPrimary transition-colors relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-[10px] font-bold flex items-center justify-center rounded-full text-white border border-surface">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-surface rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-surface flex justify-between items-center bg-surface">
            <h3 className="font-semibold text-textPrimary text-sm">Notifications</h3>
            <button 
              className="text-xs text-primary hover:underline"
              onClick={() => {
                setNotifications(notifications.map(n => ({...n, readStatus: true})));
              }}
            >
              Mark all as read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-textSecondary">
                No new notifications
              </div>
            ) : (
              notifications.map((notif, idx) => (
                <div 
                  key={notif._id || idx} 
                  className={`p-3 border-b border-surface last:border-0 hover:bg-surface/50 cursor-pointer transition-colors ${!notif.readStatus ? 'bg-primary/5' : ''}`}
                >
                  <p className="text-sm text-textPrimary">{notif.message}</p>
                  <span className="text-[10px] text-textSecondary mt-1 block">Just now</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
