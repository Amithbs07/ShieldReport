import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldAlert, ArrowRight } from 'lucide-react';

export const Track = () => {
  const [token, setToken] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [caseData, setCaseData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = () => {
    if (token.length !== 13 || !token.startsWith('SHR-')) {
      setError('Invalid token format. It should look like SHR-XXXX-XXXX');
      return;
    }
    setError('');
    setIsSearching(true);
    
    // Simulate API fetch delay
    setTimeout(() => {
      // Mock Data 
      setCaseData({
        caseToken: token,
        status: 'UNDER_REVIEW',
        category: 'Workplace Harassment',
        updatedAt: new Date().toISOString()
      });
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Track Your Report</h1>
          <p className="text-gray-400">Enter your 12-character alphanumeric Case Token below.</p>
        </div>

        {!caseData ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-shield-blue/10 blur-[80px] rounded-full"></div>
            
            <label className="block text-sm font-medium mb-2 text-gray-300">Case Token</label>
            <div className="relative">
              <input 
                type="text" 
                value={token}
                onChange={(e) => setToken(e.target.value.toUpperCase())}
                placeholder="SHR-XXXX-XXXX"
                className="w-full bg-black/30 border border-white/20 rounded-xl px-5 py-4 pl-12 text-lg font-mono text-white placeholder-gray-600 focus:outline-none focus:border-shield-blue"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
            
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

            <button 
              onClick={handleSearch}
              disabled={isSearching || !token}
              className="w-full mt-6 py-4 bg-shield-blue hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isSearching ? 'Searching database...' : 'Access Safe Portal'}
              {!isSearching && <ArrowRight className="w-5 h-5 ml-2" />}
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/40 border border-white/10 rounded-2xl p-8"
          >
            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tracking ID</p>
                <p className="font-mono text-xl text-white tracking-wider">{caseData.caseToken}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Current Status</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-alert-amber/20 text-alert-amber font-medium text-sm">
                  {caseData.status.replace('_', ' ')}
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <p className="text-sm text-gray-500">Incident Category</p>
                <p className="text-gray-200">{caseData.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-gray-200">{new Date(caseData.updatedAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-shield-blue/10 border border-shield-blue/20 rounded-xl p-5 flex items-start">
              <ShieldAlert className="w-6 h-6 text-shield-blue mr-4 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white mb-1">Active Investigation</h4>
                <p className="text-sm text-gray-400">Administrators are currently reviewing this incident. Please check back later for follow-up questions via the anonymous chat.</p>
              </div>
            </div>

            <button 
              onClick={() => { setCaseData(null); setToken(''); }}
              className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm"
            >
              Track Another Case
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
