import { motion } from 'framer-motion';
import { PenLine, Key, MessageSquare, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorks = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-16 pb-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      {/* Apple-grade Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 space-y-4"
      >
        <div className="inline-flex items-center space-x-2 bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-full px-4 py-1.5 shadow-apple-glass">
          <span className="text-[11px] font-mono text-shield-blue font-semibold uppercase tracking-wider">
            ANONYMITY LIFECYCLE
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white">
          How ShieldReport Works
        </h1>
        <p className="text-base sm:text-lg text-apple-gray-400 leading-relaxed max-w-2xl mx-auto font-normal">
          Our system is designed from the ground up to protect your identity. Here is what happens when you decide to speak up.
        </p>
      </motion.div>

      {/* 4-Step Interactive Timeline */}
      <div className="space-y-10 relative w-full before:absolute before:inset-0 before:left-8 md:before:left-1/2 md:before:-translate-x-1/2 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
        
        {/* Step 1: Submit Securely */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 pl-16 md:pl-0"
        >
          <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-2xl border border-white/10 bg-[#0B0F19] text-shield-blue flex items-center justify-center shadow-apple-glass z-10">
            <PenLine className="w-4 h-4" />
          </div>

          <div className="w-full md:w-[calc(50%-2.5rem)] md:text-right space-y-2 order-2 md:order-1">
            <div className="flex md:justify-end items-center space-x-2">
              <span className="text-shield-blue font-mono font-semibold px-2 py-0.5 bg-shield-blue/10 rounded-full text-[11px] tracking-wider">STEP 1</span>
              <h3 className="font-semibold text-xl text-white">Submit Securely</h3>
            </div>
            <p className="text-apple-gray-400 text-sm leading-relaxed">
              Fill out the report form. We do not require any personal information. Before your data leaves your browser, it is encrypted. Your IP address and browser metadata are actively stripped away to ensure absolute zero traceability.
            </p>
            <div className="inline-flex items-center text-[11px] font-mono text-apple-gray-500 bg-white/[0.02] border border-white/[0.04] px-2.5 py-1 rounded-lg">
              Detailed Incident Schedule & Real-Time AI Triage Assist Included
            </div>
          </div>

          <div className="hidden md:block w-[calc(50%-2.5rem)] order-1 md:order-2" />
        </motion.div>

        {/* Step 2: Get Your Key */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 pl-16 md:pl-0"
        >
          <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-2xl border border-white/10 bg-[#0B0F19] text-shield-green flex items-center justify-center shadow-apple-glass z-10">
            <Key className="w-4 h-4" />
          </div>

          <div className="hidden md:block w-[calc(50%-2.5rem)] order-1" />

          <div className="w-full md:w-[calc(50%-2.5rem)] space-y-2 order-2">
            <div className="flex items-center space-x-2">
              <span className="text-shield-green font-mono font-semibold px-2 py-0.5 bg-shield-green/10 rounded-full text-[11px] tracking-wider">STEP 2</span>
              <h3 className="font-semibold text-xl text-white">Get Your Key</h3>
            </div>
            <p className="text-apple-gray-400 text-sm leading-relaxed">
              Upon submission, you will receive a unique 12-character token (e.g., <code className="bg-black/40 border border-white/10 px-1.5 py-0.5 rounded text-xs font-mono text-shield-blue">SHR-XXXX-XXXX</code>). <strong className="text-white">This is your only key.</strong> Save it securely. Without it, even we cannot retrieve your report or link it back to you.
            </p>
            <div className="inline-flex items-center text-[11px] font-mono text-apple-gray-500 bg-white/[0.02] border border-white/[0.04] px-2.5 py-1 rounded-lg">
              One-Click Offline Text Backup Available
            </div>
          </div>
        </motion.div>

        {/* Step 3: AI Triage & Review */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 pl-16 md:pl-0"
        >
          <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-2xl border border-white/10 bg-[#0B0F19] text-alert-amber flex items-center justify-center shadow-apple-glass z-10">
            <ShieldAlert className="w-4 h-4" />
          </div>

          <div className="w-full md:w-[calc(50%-2.5rem)] md:text-right space-y-2 order-2 md:order-1">
            <div className="flex md:justify-end items-center space-x-2">
              <span className="text-alert-amber font-mono font-semibold px-2 py-0.5 bg-alert-amber/10 rounded-full text-[11px] tracking-wider">STEP 3</span>
              <h3 className="font-semibold text-xl text-white">AI Triage & Review</h3>
            </div>
            <p className="text-apple-gray-400 text-sm leading-relaxed">
              Your encrypted report lands in our secure database. An AI agent securely assesses urgency so critical matters are flagged immediately. Administrative reviewers are notified but see only the facts—never your identity.
            </p>
            <div className="inline-flex items-center text-[11px] font-mono text-apple-gray-500 bg-white/[0.02] border border-white/[0.04] px-2.5 py-1 rounded-lg">
              NLP Anti-Fraud Verification + Computer Vision Forensic Screening
            </div>
          </div>

          <div className="hidden md:block w-[calc(50%-2.5rem)] order-1 md:order-2" />
        </motion.div>

        {/* Step 4: Track & Chat Securely */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 pl-16 md:pl-0"
        >
          <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-2xl border border-white/10 bg-[#0B0F19] text-purple-400 flex items-center justify-center shadow-apple-glass z-10">
            <MessageSquare className="w-4 h-4" />
          </div>

          <div className="hidden md:block w-[calc(50%-2.5rem)] order-1" />

          <div className="w-full md:w-[calc(50%-2.5rem)] space-y-2 order-2">
            <div className="flex items-center space-x-2">
              <span className="text-purple-400 font-mono font-semibold px-2 py-0.5 bg-purple-400/10 rounded-full text-[11px] tracking-wider">STEP 4</span>
              <h3 className="font-semibold text-xl text-white">Track & Chat Securely</h3>
            </div>
            <p className="text-apple-gray-400 text-sm leading-relaxed">
              Use your token to log back in anytime to see status updates. You can chat anonymously with the investigation team to provide more evidence without ever revealing who you are.
            </p>
            <div className="inline-flex items-center text-[11px] font-mono text-apple-gray-500 bg-white/[0.02] border border-white/[0.04] px-2.5 py-1 rounded-lg">
              Evidence Manual Approval Status & Timeline Auditing Live
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Box */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-20 text-center"
      >
        <Link 
          to="/report/submit" 
          className="inline-flex px-8 py-4 bg-shield-blue hover:bg-blue-500 text-white font-medium text-sm rounded-2xl transition-all shadow-apple-glow active:scale-95 items-center justify-center"
        >
          <span>Start Your Anonymous Report</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </motion.div>
    </div>
  );
};
