import { motion } from 'framer-motion';
import { Shield, EyeOff, Lock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-12"
      >
        <div className="text-center sm:text-left space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-full px-4 py-1.5 shadow-apple-glass">
            <Shield className="w-3.5 h-3.5 text-shield-blue" />
            <span className="text-xs font-mono font-medium text-apple-gray-300">
              MATHEMATICAL & ARCHITECTURAL IMMUNITY
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">
            Our Anonymity Guarantee
          </h1>
          <p className="text-base sm:text-lg text-apple-gray-400 leading-relaxed font-normal">
            ShieldReport was designed from the ground up to ensure that you cannot be identified. Not by your employer, not by your school, and not even by us.
          </p>
        </div>

        {/* 3 Core Architecture Pillars */}
        <div className="space-y-6">
          <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl p-8 rounded-3xl shadow-apple-card flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-alert-red/10 border border-alert-red/20 flex items-center justify-center shrink-0 text-alert-red">
              <MapPin className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-white">We delete your IP Address</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-alert-red/10 text-alert-red">Ingress Interception</span>
              </div>
              <p className="text-apple-gray-400 text-sm leading-relaxed">
                At the deepest layer of our server (the load balancer and API gateway), your IP address is forcefully stripped. Our database schema physically does not contain a column to store IP addresses.
              </p>
              <div className="bg-black/40 border border-white/[0.06] rounded-xl p-3 font-mono text-xs text-apple-gray-400 mt-2">
                <code>req.ip = '0.0.0.0'; delete req.headers['x-forwarded-for']; delete req.headers['user-agent'];</code>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl p-8 rounded-3xl shadow-apple-card flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-shield-blue/10 border border-shield-blue/20 flex items-center justify-center shrink-0 text-shield-blue">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-white">End-to-End Encryption</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-shield-blue/10 text-shield-blue">AES-256-GCM</span>
              </div>
              <p className="text-apple-gray-400 text-sm leading-relaxed">
                The description you provide is encrypted using military-grade AES-256-GCM encryption before it touches the database. If our database is compromised, the attackers only see random bytes.
              </p>
              <div className="bg-black/40 border border-white/[0.06] rounded-xl p-3 font-mono text-xs text-apple-gray-400 mt-2">
                <code>Cipher: iv:salt:auth_tag:ciphertext (32-byte Cryptographic Master Secret)</code>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl p-8 rounded-3xl shadow-apple-card flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-alert-amber/10 border border-alert-amber/20 flex items-center justify-center shrink-0 text-alert-amber">
              <EyeOff className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-white">Zero Tracking Cookies</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-alert-amber/10 text-alert-amber">No Fingerprinting</span>
              </div>
              <p className="text-apple-gray-400 text-sm leading-relaxed">
                We use an anonymous token system. You do not create an account. We do not place tracking cookies on your device. We do not use third-party analytics (like Google Analytics). You exist to us solely as a random token (e.g. SHR-9X8B).
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-shield-blue/10 to-transparent border border-shield-blue/20 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">Ready to file your safe report?</h3>
            <p className="text-xs text-apple-gray-400">Initiate your encrypted report with complete peace of mind.</p>
          </div>
          <Link
            to="/report/submit"
            className="px-6 py-3 rounded-2xl bg-shield-blue hover:bg-blue-500 text-white text-xs font-medium transition-all shadow-apple-glow active:scale-95 shrink-0"
          >
            Open Report Terminal
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
