import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import { api } from '../store/useAuthStore';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    registrationEnabled: true,
    emailVerification: false,
    sessionTimeout: 60,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        const settingsMap = {};
        res.data.settings.forEach(s => settingsMap[s.key] = s.value);
        setSettings(prev => ({ ...prev, ...settingsMap }));
      } catch (error) {
        console.error('Failed to load system settings', error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (key, value) => {
    try {
      await api.put('/admin/settings', { key, value });
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Failed to save setting', error);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-textPrimary">System Settings</h1>
        <p className="text-textSecondary mt-1">Configure global platform behavior.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-textPrimary mb-6 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-primary" /> General Configuration
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-surface/50">
            <div>
              <h3 className="font-medium text-textPrimary">Allow New Registrations</h3>
              <p className="text-sm text-textSecondary">Enable or disable public signups.</p>
            </div>
            <button 
              onClick={() => handleSave('registrationEnabled', !settings.registrationEnabled)}
              className={`w-12 h-6 rounded-full relative transition-colors ${settings.registrationEnabled ? 'bg-primary' : 'bg-surface border border-border'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${settings.registrationEnabled ? 'right-1 bg-white' : 'left-1 bg-textSecondary'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-surface/50">
            <div>
              <h3 className="font-medium text-textPrimary">Require Email Verification</h3>
              <p className="text-sm text-textSecondary">New users must verify email to access platform.</p>
            </div>
            <button 
              onClick={() => handleSave('emailVerification', !settings.emailVerification)}
              className={`w-12 h-6 rounded-full relative transition-colors ${settings.emailVerification ? 'bg-primary' : 'bg-surface border border-border'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${settings.emailVerification ? 'right-1 bg-white' : 'left-1 bg-textSecondary'}`}></div>
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-textPrimary mb-6 flex items-center gap-2">
          <Save className="w-5 h-5 text-primary" /> Security & Credentials
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
              className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-textPrimary focus:ring-2 focus:ring-primary outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1">New Password</label>
            <input 
              type="password" required
              value={passwordData.newPassword}
              onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
              className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-textPrimary focus:ring-2 focus:ring-primary outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1">Confirm New Password</label>
            <input 
              type="password" required
              value={passwordData.confirmPassword}
              onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-textPrimary focus:ring-2 focus:ring-primary outline-none" 
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg mt-2">
            Update Password
          </button>
        </form>
      </Card>
    </div>
  );
};

export default AdminSettings;
