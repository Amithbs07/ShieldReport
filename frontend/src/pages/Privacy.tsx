import { motion } from 'framer-motion';
import { Shield, EyeOff, Lock, MapPin } from 'lucide-react';

export const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center mb-8">
          <Shield className="w-10 h-10 text-shield-blue mr-4" />
          <h1 className="text-4xl font-bold">Our Anonymity Guarantee</h1>
        </div>

        <p className="text-xl text-gray-400 mb-12">
          ShieldReport was designed from the ground up to ensure that you cannot be identified. Not by your employer, not by your school, and not even by us.
        </p>

        <div className="space-y-8">
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-red-500/10 p-4 rounded-xl shrink-0">
              <MapPin className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-white">We delete your IP Address</h2>
              <p className="text-gray-400">
                At the deepest layer of our server (the load balancer and API gateway), your IP address is forcefully stripped. Our database schema physically does not contain a column to store IP addresses.
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-shield-blue/10 p-4 rounded-xl shrink-0">
              <Lock className="w-8 h-8 text-shield-blue" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-white">End-to-End Encryption</h2>
              <p className="text-gray-400">
                The description you provide is encrypted using military-grade AES-256-GCM encryption before it touches the database. If our database is compromised, the attackers only see random bytes.
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-alert-amber/10 p-4 rounded-xl shrink-0">
              <EyeOff className="w-8 h-8 text-alert-amber" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-white">Zero Tracking Cookies</h2>
              <p className="text-gray-400">
                We use an anonymous token system. You do not create an account. We do not place tracking cookies on your device. We do not use third-party analytics (like Google Analytics). You exist to us solely as a random token (e.g. SHR-9X8B).
              </p>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
