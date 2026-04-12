import { motion } from 'framer-motion';
import { PenLine, Key, MessageSquare, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorks = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-32 px-4 max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          How ShieldReport Works
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
          Our system is designed from the ground up to protect your identity. Here is what happens when you decide to speak up.
        </p>
      </motion.div>

      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
        
        {/* Step 1 */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-navy-900 text-shield-blue shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            <PenLine className="w-5 h-5" />
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-shield-blue font-bold px-2 py-1 bg-shield-blue/10 rounded text-xs tracking-wider">STEP 1</span>
              <h3 className="font-bold text-xl text-white">Submit Securely</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Fill out the report form. We do not require any personal information. Before your data leaves your browser, it is encrypted. Your IP address and browser metadata are actively stripped away to ensure absolute zero traceability.
            </p>
          </div>
        </motion.div>

        {/* Step 2 */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-navy-900 text-shield-blue shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            <Key className="w-5 h-5" /> {/* Note: The icon is KeySquare but some versions have it spelled differently. Let's use a safe icon or standard Lucide one. Wait, I will use Key */}
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-shield-blue font-bold px-2 py-1 bg-shield-blue/10 rounded text-xs tracking-wider">STEP 2</span>
              <h3 className="font-bold text-xl text-white">Get Your Key</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Upon submission, you will receive a unique 12-character token (e.g., <code className="bg-black/50 px-1 py-0.5 rounded text-shield-blue">SHR-XXXX-XXXX</code>). <strong>This is your only key.</strong> Save it securely. Without it, even we cannot retrieve your report or link it back to you.
            </p>
          </div>
        </motion.div>

        {/* Step 3 */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-navy-900 text-shield-blue shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-shield-blue font-bold px-2 py-1 bg-shield-blue/10 rounded text-xs tracking-wider">STEP 3</span>
              <h3 className="font-bold text-xl text-white">AI Triage & Review</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your encrypted report lands in our secure database. An AI agent securely assesses urgency so critical matters are flagged immediately. Administrative reviewers are notified but see only the facts—never your identity.
            </p>
          </div>
        </motion.div>

        {/* Step 4 */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-navy-900 text-shield-blue shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-shield-blue font-bold px-2 py-1 bg-shield-blue/10 rounded text-xs tracking-wider">STEP 4</span>
              <h3 className="font-bold text-xl text-white">Track & Chat Securely</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Use your token to log back in anytime to see status updates. You can chat anonymously with the investigation team to provide more evidence without ever revealing who you are.
            </p>
          </div>
        </motion.div>

      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 text-center"
      >
        <Link 
          to="/report/submit" 
          className="inline-flex px-8 py-4 bg-shield-blue hover:bg-blue-600 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] items-center justify-center"
        >
          Start Your Report Now
        </Link>
      </motion.div>
    </div>
  );
};
