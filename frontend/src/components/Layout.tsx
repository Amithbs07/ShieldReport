import { ReactNode, useEffect, useState } from 'react';
import { Shield, Lock, ShieldAlert, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { QuickExit } from './QuickExit';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [sessionHash, setSessionHash] = useState('');

  useEffect(() => {
    // Generate an ephemeral anonymous session identifier
    setSessionHash(Math.random().toString(36).substring(2, 10).toUpperCase());

    // Emergency quick exit handler: ESC key instantly leaves to innocent page
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.location.replace('https://www.google.com');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const quickExit = () => {
    window.location.replace('https://www.google.com');
  };

  const navLinks = [
    { name: 'How it Works', path: '/how-it-works' },
    { name: 'Privacy Guarantee', path: '/privacy' },
    { name: 'Track Case', path: '/track' },
    { name: 'Investigator Portal', path: '/admin/login' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#070A0F] text-white font-sans selection:bg-shield-blue/30 selection:text-white relative overflow-x-hidden">
      {/* Apple-style Top Enclave HUD */}
      <div className="border-b border-white/[0.06] bg-black/40 backdrop-blur-md px-4 py-1.5 text-[11px] font-mono tracking-wider text-apple-gray-400 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center space-x-1.5 text-shield-green font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-shield-green animate-pulse"></span>
              <span>HARDWARE ENCLAVE ACTIVE</span>
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline text-apple-gray-400">INGRESS IP: <span className="text-white">STRIPPED (0.0.0.0)</span></span>
            <span className="hidden md:inline text-white/20">|</span>
            <span className="hidden md:inline text-apple-gray-400">SESSION: <span className="text-shield-blue">#{sessionHash}</span></span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={quickExit}
              title="Immediately leaves this site and opens Google (Press Escape anytime)"
              className="px-2.5 py-0.5 rounded-full bg-alert-red/10 border border-alert-red/30 text-alert-red hover:bg-alert-red/20 transition-all font-sans font-medium flex items-center text-[10px] space-x-1"
            >
              <ShieldAlert className="w-3 h-3 mr-1" />
              <span>Quick Exit <kbd className="hidden sm:inline bg-black/40 px-1 rounded text-[9px]">ESC</kbd></span>
            </button>
          </div>
        </div>
      </div>

      {/* Apple-style Floating Nav Header */}
      <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 pt-3 pb-3">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-2xl bg-white/[0.04] border border-white/[0.08] shadow-apple-glass rounded-2xl px-5 h-16 flex items-center justify-between transition-all">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-shield-blue/30 to-shield-indigo/20 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(41,151,255,0.2)]">
                <Shield className="w-5 h-5 text-shield-blue" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg tracking-tight text-white flex items-center">
                  ShieldReport
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-apple-gray-300 font-mono font-normal">PRO</span>
                </span>
                <span className="text-[10px] text-apple-gray-500 tracking-wider uppercase font-mono hidden sm:block">Zero-Knowledge Whistleblower Portal</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 bg-black/20 border border-white/[0.06] rounded-full p-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                      isActive 
                        ? 'bg-white/10 text-white shadow-sm font-semibold' 
                        : 'text-apple-gray-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center space-x-3">
              <Link
                to="/report/submit"
                className="px-4 py-2 rounded-xl bg-shield-blue hover:bg-shield-blue/90 text-white text-xs font-medium transition-all shadow-[0_0_20px_rgba(41,151,255,0.3)] hover:shadow-[0_0_25px_rgba(41,151,255,0.5)] flex items-center space-x-1.5 active:scale-95"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Submit Report</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative z-10">
        {children}
      </main>

      {/* Apple-grade Minimal Footer */}
      <footer className="border-t border-white/[0.06] py-12 mt-20 bg-black/40 backdrop-blur-xl relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-shield-blue" />
                <span className="font-semibold text-white tracking-tight">ShieldReport Security Architecture</span>
              </div>
              <p className="text-apple-gray-500 leading-relaxed">
                Engineered for maximum whistleblower sovereignty with cryptographic memory hygiene, client-side EXIF scrubbing, and zero persistent user identifiers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Verification & Trust</h4>
              <ul className="space-y-2 text-apple-gray-400">
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">4-Phase Investigation Workflow</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">IP Scrubbing Verification</Link></li>
                <li><span className="text-apple-gray-500">AES-256-GCM Cryptographic Proofs</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Auditing & Safety</h4>
              <ul className="space-y-2 text-apple-gray-400">
                <li><Link to="/track" className="hover:text-white transition-colors">Anonymous Case Tracking</Link></li>
                <li><Link to="/admin/login" className="hover:text-white transition-colors">Investigator Review Login</Link></li>
                <li><span className="text-apple-gray-500">Zero Analytics / Cookie-Free</span></li>
              </ul>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-2">
              <div className="flex items-center text-shield-green font-medium space-x-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Zero-Trace Architecture</span>
              </div>
              <p className="text-[11px] text-apple-gray-500">
                Your browser headers, IP, and session traces are neutralized upon socket handshake.
              </p>
            </div>
          </div>
          <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between text-[11px] text-apple-gray-500">
            <span>Built as an enterprise-grade academic major project for verifiable anonymous reporting.</span>
            <span className="mt-2 sm:mt-0 font-mono text-[10px]">E2E ENCRYPTED • NO TELEMETRY • AIR-GAPPED METADATA</span>
          </div>
        </div>
      </footer>

      {/* Persistent Floating Anti-Surveillance Panic Evacuation */}
      <QuickExit />
    </div>
  );
};
