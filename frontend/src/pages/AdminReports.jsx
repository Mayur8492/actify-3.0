import React, { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import Card from '../components/ui/Card';
import { api } from '../store/useAuthStore';

const AdminReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/admin/reports');
        setReports(res.data);
      } catch (error) {
        console.error('Failed to fetch reports', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/admin/reports/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'actify_users_report.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Failed to export CSV', error);
    }
  };

  if (loading) {
    return <div className="p-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary">Reports & Insights</h1>
          <p className="text-textSecondary mt-1">Platform-level AI analytics and custom data exports.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-textPrimary mb-4">Most Productive Users</h3>
          <div className="space-y-4">
            {reports?.mostProductiveUsers?.map((u, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-surface/50 rounded-lg">
                <span className="font-medium text-textPrimary">{u.name}</span>
                <span className="text-emerald-500 font-bold">{u.score.toFixed(1)}% Score</span>
              </div>
            ))}
            {reports?.mostProductiveUsers?.length === 0 && (
              <p className="text-textSecondary">No data available.</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-textPrimary mb-4">All Users Overview</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {reports?.allUsers?.map((u, i) => (
              <div key={i} className="flex justify-between items-center p-3 border border-border/50 rounded-lg">
                <div>
                  <div className="font-medium text-textPrimary">{u.name}</div>
                  <div className="text-xs text-textSecondary">{u.email}</div>
                </div>
                <span className={`font-bold ${u.score >= 50 ? 'text-emerald-500' : 'text-yellow-500'}`}>
                  {u.score.toFixed(1)}%
                </span>
              </div>
            ))}
            {reports?.allUsers?.length === 0 && (
              <p className="text-textSecondary">No data available.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
