import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Inbox, Users, Settings, LogOut } from 'lucide-react';

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
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Cases', href: '/admin/cases', icon: Inbox },
    { name: 'Team', href: '/admin/team', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="flex bg-navy-900 min-h-screen font-sans selection:bg-shield-blue/30">
      {/* Sidebar */}
      <div className="w-64 bg-navy-800 border-r border-white/10 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="font-bold text-xl text-white tracking-tight">ShieldAdmin</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-shield-blue text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {item.name}
              </Link>  
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="h-16 bg-navy-900/50 backdrop-blur-md border-b border-white/10 flex items-center px-8 z-10 sticky top-0">
          <h2 className="text-xl font-semibold text-white">
            {navigation.find(n => location.pathname.startsWith(n.href))?.name || 'Admin'}
          </h2>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
