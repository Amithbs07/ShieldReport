import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Activity, ArrowLeft, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const BACKEND_URL = (import.meta as any).env.VITE_BACKEND_URL || 'http://localhost:5000/api/v1';
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminId', data.data.id);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('A network error occurred while connecting to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrefillDemo = () => {
    setEmail('investigator@acme.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-[#070A0F] flex items-center justify-center px-4 font-sans selection:bg-shield-blue/30 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-shield-blue/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex bg-white/[0.04] p-3 rounded-2xl mb-2 border border-white/[0.08] shadow-apple-glass">
            <Shield className="w-8 h-8 text-shield-blue" />
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">ShieldAdmin</h1>
          <p className="text-apple-gray-400 text-xs">Secure Investigator & Compliance Triage Console</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl rounded-3xl p-8 shadow-apple-card relative overflow-hidden">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-alert-red/10 border border-alert-red/30 text-alert-red px-4 py-3 rounded-2xl text-xs flex items-center">
                <Activity className="w-4 h-4 mr-2 shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-apple-gray-400">Investigator Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/[0.1] rounded-2xl px-4 py-3 text-white placeholder-apple-gray-600 focus:outline-none focus:border-shield-blue text-sm transition-all shadow-inner"
                placeholder="investigator@acme.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-apple-gray-400">Hardware Secret Password</label>
              <div className="relative">
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/[0.1] rounded-2xl pl-10 pr-4 py-3 text-white placeholder-apple-gray-600 focus:outline-none focus:border-shield-blue text-sm transition-all shadow-inner"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-apple-gray-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-shield-blue hover:bg-blue-500 text-white font-medium text-sm rounded-2xl py-3.5 transition-all shadow-apple-glow active:scale-95 flex justify-center items-center disabled:opacity-50"
            >
              {isLoading ? 'Authenticating Session...' : 'Authenticate Investigator Session'}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-apple-gray-500 font-mono text-[11px]">Demo: investigator@acme.com</span>
            <button
              onClick={handlePrefillDemo}
              type="button"
              className="text-shield-blue hover:text-blue-400 font-mono text-[11px] flex items-center space-x-1"
            >
              <KeyRound className="w-3 h-3 mr-1" />
              <span>Auto-Fill Demo Credentials</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-apple-gray-400 hover:text-white transition-colors inline-flex items-center">
            <ArrowLeft className="w-3 h-3 mr-1" /> Return to Public Portal
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
