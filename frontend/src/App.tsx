import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Home as HomeIcon, Lock, Search } from 'lucide-react';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import { HowItWorks } from './pages/HowItWorks';
import { ReportForm } from './pages/ReportForm';
import { Track } from './pages/Track';
import { Privacy } from './pages/Privacy';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard as AdminDashboard } from './pages/admin/Dashboard';
import { Login } from './pages/admin/Login';

const NotFound = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-alert-red/10 border border-alert-red/30 flex items-center justify-center text-alert-red mb-4 shadow-[0_0_20px_rgba(255,69,58,0.2)]">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-alert-red mb-2 font-semibold">404 Error</span>
      <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
      <p className="text-apple-gray-400 text-sm max-w-md mb-6 leading-relaxed">
        The requested path <code className="bg-white/10 px-2 py-0.5 rounded text-white font-mono text-xs">{location.pathname}</code> was not found on this portal.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-shield-blue text-white text-xs font-medium hover:bg-shield-blue/90 transition-all shadow-[0_0_20px_rgba(41,151,255,0.3)]"
        >
          <HomeIcon className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/report/submit"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-xs font-medium hover:bg-white/10 transition-all"
        >
          <Lock className="w-4 h-4 text-shield-blue" />
          <span>Submit Report</span>
        </Link>
        <Link
          to="/track"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-xs font-medium hover:bg-white/10 transition-all"
        >
          <Search className="w-4 h-4 text-shield-green" />
          <span>Track Case</span>
        </Link>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with public layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
        <Route path="/report" element={<Navigate to="/report/submit" replace />} />
        <Route path="/submit" element={<Navigate to="/report/submit" replace />} />
        <Route path="/report/submit" element={<Layout><ReportForm /></Layout>} />
        <Route path="/track" element={<Layout><Track /></Layout>} />
        <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
        
        {/* Admin Routes */}
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </AdminLayout>
        } />

        {/* 404 Fallback Route */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
