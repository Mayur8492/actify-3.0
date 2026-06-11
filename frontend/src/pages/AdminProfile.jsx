import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { User, Shield } from 'lucide-react';
import Card from '../components/ui/Card';

const AdminProfile = () => {
  const { user, updateProfile, isLoading, error } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [successMessage, setSuccessMessage] = useState('');

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
      setSuccessMessage('Admin profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" /> Admin Profile
        </h1>
        <p className="text-textSecondary mt-1">Manage your administrator credentials and security settings.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-textPrimary mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-textSecondary" /> Account Details
        </h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
          {error && <div className="text-sm text-danger bg-danger/10 p-3 rounded-lg">{error}</div>}
          {successMessage && <div className="text-sm text-primary bg-primary/10 p-3 rounded-lg">{successMessage}</div>}
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-textPrimary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1">Administrator Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-textPrimary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Saving...' : 'Update Security Credentials'}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default AdminProfile;
