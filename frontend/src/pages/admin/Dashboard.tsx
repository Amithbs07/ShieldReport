import { AlertTriangle, Activity, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const [statsData, setStatsData] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const BACKEND_URL = (import.meta as any).env.VITE_BACKEND_URL || 'http://localhost:5000/api/v1';

      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [statsRes, casesRes] = await Promise.all([
          fetch(`${BACKEND_URL}/admin/stats`, { headers }),
          fetch(`${BACKEND_URL}/admin/cases`, { headers })
        ]);

        if (statsRes.status === 401 || casesRes.status === 401) {
           localStorage.removeItem('adminToken');
           navigate('/admin/login');
           return;
        }

        const statsJson = await statsRes.json();
        const casesJson = await casesRes.json();

        if (statsJson.success) setStatsData(statsJson.data);
        if (casesJson.success) setCases(casesJson.data);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (isLoading) {
    return <div className="text-white flex justify-center items-center h-64">Loading Dashboard...</div>;
  }

  const stats = [
    { name: 'Active Cases', value: statsData?.activeCases || 0, icon: Activity, color: 'text-shield-blue', bg: 'bg-shield-blue/10' },
    { name: 'Critical AI Flags', value: statsData?.criticalFlags || 0, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { name: 'Pending Review', value: statsData?.pendingReview || 0, icon: Clock, color: 'text-alert-amber', bg: 'bg-alert-amber/10' },
    { name: 'Resolved', value: statsData?.resolvedCases || 0, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-navy-800 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 font-medium">{stat.name}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-navy-800 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">High-Priority Cases</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm">
                <th className="pb-3 px-4 font-medium">Tracking ID</th>
                <th className="pb-3 px-4 font-medium">AI Urgency</th>
                <th className="pb-3 px-4 font-medium">Category</th>
                <th className="pb-3 px-4 font-medium">AI Summary</th>
                <th className="pb-3 px-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {cases.length === 0 && (
                <tr><td colSpan={5} className="py-4 px-4 text-center text-gray-500">No cases found.</td></tr>
              )}
              {cases.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer text-sm">
                  <td className="py-4 px-4 font-mono text-shield-blue">{c.id}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${c.aiScore > 80 ? 'bg-red-500' : 'bg-alert-amber'}`}></div>
                      <span className={c.aiScore > 80 ? 'text-red-400 font-bold' : 'text-gray-300'}>{c.aiScore}/100</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{c.category}</td>
                  <td className="py-4 px-4 text-gray-400 truncate max-w-xs" title={c.summary}>{c.summary}</td>
                  <td className="py-4 px-4 text-right">
                    <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-medium tracking-wide">
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
