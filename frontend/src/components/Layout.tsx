import { ReactNode } from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-navy-900 text-white font-sans selection:bg-shield-blue/30">
      <header className="border-b border-white/10 bg-navy-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-shield-blue/10 p-2 rounded-lg group-hover:bg-shield-blue/20 transition-colors">
                <Shield className="w-6 h-6 text-shield-blue" />
              </div>
              <span className="font-bold text-xl tracking-tight">ShieldReport</span>
            </Link>
            <nav className="flex space-x-6 text-sm font-medium">
              <Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</Link>
              <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Promise</Link>
              <Link to="/track" className="text-gray-300 hover:text-white transition-colors">Track Case</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        {children}
      </main>

      <footer className="border-t border-white/10 py-8 bg-navy-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Speak without fear. End-to-end encrypted.</span>
          </p>
        </div>
      </footer>
    </div>
  );
};
