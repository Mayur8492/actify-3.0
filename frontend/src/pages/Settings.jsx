import React, { useState, useEffect } from 'react';
import { useAuthStore, api } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { Settings as SettingsIcon, User, Moon, Sun, Shield, Lock } from 'lucide-react';
import Card from '../components/ui/Card';

const Settings = () => {
  const { user, updateProfile, isLoading, error } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    const success = await updateProfile(name, email);
    if (success) {
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-primary" /> Settings
        </h1>
        <p className="text-textSecondary mt-1">Manage your account preferences and application settings.</p>
      </div>

      {user?.isDemo && (
        <div className="mb-8 p-4 bg-warning/10 border border-warning/20 rounded-xl flex items-start gap-3">
          <Lock className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-warning">Demo Mode Active</h3>
            <p className="text-sm text-warning/80 mt-1">Account and security settings are locked while exploring the live demo.</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-textPrimary mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-textSecondary" /> Profile Settings
          </h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
            {error && <div className="text-sm text-danger bg-danger/10 p-3 rounded-lg">{error}</div>}
            {successMessage && <div className="text-sm text-primary bg-primary/10 p-3 rounded-lg">{successMessage}</div>}
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={user?.isDemo}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-textPrimary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={user?.isDemo}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-textPrimary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading || user?.isDemo}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-textPrimary mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5 text-textSecondary" /> Appearance
          </h2>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-surface/50">
            <div>
              <h3 className="font-medium text-textPrimary">Theme Preference</h3>
              <p className="text-sm text-textSecondary">Switch between light and dark mode</p>
            </div>
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:border-primary transition-colors text-textPrimary"
            >
              {theme === 'dark' ? <><Sun className="w-4 h-4" /> Light Mode</> : <><Moon className="w-4 h-4" /> Dark Mode</>}
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-textPrimary mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-textSecondary" /> Security & Credentials
          </h2>
          
          <form onSubmit={async (e) => {
            e.preventDefault();
            setPasswordMsg({ type: '', text: '' });
            if (passwordData.newPassword !== passwordData.confirmPassword) {
              return setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
            }
            try {
              await api.put('/auth/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
              });
              setPasswordMsg({ type: 'success', text: 'Password changed successfully' });
              setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } catch (err) {
              setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
            }
          }} className="space-y-4 max-w-md">
            {passwordMsg.text && (
              <div className={`p-3 rounded-lg text-sm ${passwordMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {passwordMsg.text}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Current Password</label>
              <input 
                type="password" required
                value={passwordData.currentPassword}
                onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                disabled={user?.isDemo}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-textPrimary focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">New Password</label>
              <input 
                type="password" required
                value={passwordData.newPassword}
                onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                disabled={user?.isDemo}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-textPrimary focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Confirm New Password</label>
              <input 
                type="password" required
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                disabled={user?.isDemo}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-textPrimary focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed" 
              />
            </div>
            <button type="submit" disabled={user?.isDemo} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg mt-2 disabled:opacity-50">
              Update Password
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
