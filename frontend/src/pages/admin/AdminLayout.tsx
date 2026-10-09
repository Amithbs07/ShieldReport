import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Shield, LogOut, ArrowLeft, Activity } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminId');
    navigate('/admin/login');
  };

  const navigation = [
    { name: 'Investigation Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="flex bg-[#070A0F] min-h-screen font-sans selection:bg-shield-blue/30 text-white">
      {/* Apple-grade Glass Sidebar */}
      <div className="w-64 bg-[#0B0F19]/80 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col shadow-apple-card shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-white/[0.06] space-x-3">
          <div className="w-8 h-8 rounded-xl bg-shield-blue/20 border border-shield-blue/30 flex items-center justify-center text-shield-blue">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-sm text-white tracking-tight block">ShieldAdmin</span>
            <span className="text-[10px] font-mono text-apple-gray-500 uppercase">Compliance Enclave</span>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1.5">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                  isActive 
                    ? 'bg-shield-blue text-white shadow-apple-glow font-semibold' 
                    : 'text-apple-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.name}
              </Link>  
            );
          })}
        </nav>

        {/* Live Session Telemetry Card */}
        <div className="p-3 mx-3 mb-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl space-y-1.5 text-[11px] font-mono">
          <div className="flex items-center text-shield-green space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-shield-green animate-pulse"></span>
            <span className="font-semibold">ENCLAVE SECURE</span>
          </div>
          <div className="text-apple-gray-500 text-[10px]">
            Investigator Role: <span className="text-white">AUDITOR</span>
          </div>
        </div>

        <div className="p-4 border-t border-white/[0.06] space-y-2">
          <Link
            to="/"
            className="flex items-center w-full px-3 py-2 text-apple-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all text-xs"
          >
            <ArrowLeft className="w-4 h-4 mr-2.5" />
            Public Reporting Portal
          </Link>

          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-alert-red hover:bg-alert-red/10 rounded-xl transition-all text-xs font-medium"
          >
            <LogOut className="w-4 h-4 mr-2.5" />
            Terminate Session
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto flex flex-col">
        <header className="h-16 bg-[#0B0F19]/60 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center space-x-3">
            <h2 className="text-sm font-semibold text-white tracking-tight">
              Investigator & Forensic Triage Center
            </h2>
            <span className="text-[10px] font-mono bg-shield-blue/15 text-shield-blue border border-shield-blue/30 px-2 py-0.5 rounded-full">
              AES-256 Decryption On-Demand
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-apple-gray-400">
            <Activity className="w-3.5 h-3.5 text-shield-green" />
            <span>Ingress Telemetry: 100% Scrubbed</span>
          </div>
        </header>

        <main className="p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
