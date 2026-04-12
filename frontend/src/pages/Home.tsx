import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Lock, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-32 px-4">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl"
      >
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium text-gray-300">100% Secure & Anonymous Platform</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Speak Without Fear.
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
          Report workplace incidents, safety violations, or misconduct with absolute zero traceability. Your identity is stripped entirely by design.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/report/submit" 
            className="w-full sm:w-auto px-8 py-4 bg-shield-blue hover:bg-blue-600 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center group"
          >
            Make a Report
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/track" 
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all flex items-center justify-center"
          >
            Track Existing Case
          </Link>
        </div>
      </motion.div>

      {/* Trust Signals */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-6xl w-full"
      >
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="bg-shield-blue/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <EyeOff className="w-6 h-6 text-shield-blue" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Zero Tracking</h3>
          <p className="text-gray-400 text-sm">We strip your IP address and device signature before your load the page. No cookies, no analytics.</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-shield-blue/10 blur-[50px] rounded-full"></div>
          <div className="bg-shield-blue/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative z-10">
            <Lock className="w-6 h-6 text-shield-blue" />
          </div>
          <h3 className="text-xl font-semibold mb-2 relative z-10">AES-256 Encrypted</h3>
          <p className="text-gray-400 text-sm relative z-10">Your report details are encrypted end-to-end. Even our database administrators cannot read your submission.</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="bg-shield-blue/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-shield-blue" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Anonymous Tokens</h3>
          <p className="text-gray-400 text-sm">No accounts required. You are issued a one-time 12-character token to track your case and chat anonymously.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
