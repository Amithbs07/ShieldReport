import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Lock, EyeOff, Cpu, Clock, FileSearch, Fingerprint, Blocks, HeartHandshake } from 'lucide-react';

import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Apple-style Hero Section with luminous mesh spotlight */}
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-4xl pt-8 pb-12 relative"
      >
        {/* Ambient glow accent behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-shield-blue/20 via-shield-indigo/15 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Dynamic Island Status Pill */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center space-x-2.5 bg-white/[0.04] border border-white/[0.1] backdrop-blur-xl rounded-full px-4 py-2 mb-8 shadow-apple-glass"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-shield-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-shield-green"></span>
          </span>
          <span className="text-xs font-mono font-medium text-apple-gray-300">
            SECURE INGRESS • 100% AIR-GAPPED ANONYMITY
          </span>
        </motion.div>

        {/* Primary Title */}
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight text-white mb-6 leading-[1.08]">
          Speak Without Fear. <br />
          <span className="bg-gradient-to-r from-white via-apple-gray-300 to-apple-gray-500 bg-clip-text text-transparent">
            Protected By Design.
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-apple-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto font-normal">
          Report workplace misconduct, harassment, or safety violations with absolute zero digital footprint. IP addresses, headers, and hardware signatures are destroyed on ingress.
        </p>

        {/* Apple Tactile CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/report/submit" 
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-shield-blue hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-[0_0_30px_rgba(41,151,255,0.35)] hover:shadow-[0_0_40px_rgba(41,151,255,0.55)] flex items-center justify-center group active:scale-95"
          >
            <span>Initiate Anonymous Report</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/track" 
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] backdrop-blur-xl text-white font-medium text-sm transition-all flex items-center justify-center active:scale-95 shadow-apple-glass"
          >
            <span>Track Existing Case (SHR-...)</span>
          </Link>
        </div>

        {/* Live Security Ingress Telemetry Bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3.5">
            <span className="text-[10px] font-mono text-apple-gray-500 uppercase block">Ingress Network</span>
            <span className="text-xs font-mono font-medium text-shield-green flex items-center mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-shield-green mr-1.5"></span>
              IP Stripped (0.0.0.0)
            </span>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3.5">
            <span className="text-[10px] font-mono text-apple-gray-500 uppercase block">Payload Cryptography</span>
            <span className="text-xs font-mono font-medium text-white flex items-center mt-1">
              <Lock className="w-3 h-3 text-shield-blue mr-1.5" />
              AES-256-GCM
            </span>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3.5">
            <span className="text-[10px] font-mono text-apple-gray-500 uppercase block">Evidence Audit</span>
            <span className="text-xs font-mono font-medium text-alert-amber flex items-center mt-1">
              <Cpu className="w-3 h-3 text-alert-amber mr-1.5" />
              CV + Manual Approval
            </span>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3.5">
            <span className="text-[10px] font-mono text-apple-gray-500 uppercase block">Fraud Protection</span>
            <span className="text-xs font-mono font-medium text-shield-blue flex items-center mt-1">
              <Fingerprint className="w-3 h-3 text-shield-blue mr-1.5" />
              NLP Linguistic Filter
            </span>
          </div>
        </div>
      </motion.div>

      {/* Six Pillars of Security & Intelligence Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-16 w-full space-y-6"
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-white mb-3">
            Architected for Complete Sovereignty
          </h2>
          <p className="text-apple-gray-400 text-sm leading-relaxed">
            Every layer from client-side payload encryption to investigator triage is engineered to remove liability, prevent retaliation, and block bad-faith spam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Zero Tracking */}
          <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-7 rounded-3xl shadow-apple-card hover:bg-white/[0.05] transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-shield-blue/10 border border-shield-blue/20 flex items-center justify-center mb-6 text-shield-blue group-hover:scale-105 transition-transform">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Zero Tracking & IP Scrubbing</h3>
            <p className="text-apple-gray-400 text-sm leading-relaxed mb-4">
              We intercept every incoming packet and strip IP addresses, device identifiers, and browser headers before business logic runs.
            </p>
            <div className="inline-flex items-center text-[11px] font-mono text-shield-blue font-medium bg-shield-blue/10 px-2.5 py-1 rounded-full">
              Kernel-level Socket Sanitization
            </div>
          </div>

          {/* Card 2: AES-256 Encrypted */}
          <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-7 rounded-3xl shadow-apple-card hover:bg-white/[0.05] transition-all group relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-shield-blue/15 blur-[40px] rounded-full"></div>
            <div className="w-12 h-12 rounded-2xl bg-shield-indigo/10 border border-shield-indigo/20 flex items-center justify-center mb-6 text-shield-indigo group-hover:scale-105 transition-transform relative z-10">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 relative z-10">AES-256-GCM Encrypted at Rest</h3>
            <p className="text-apple-gray-400 text-sm leading-relaxed mb-4 relative z-10">
              Incident narratives are locked with authenticated cipher blocks. Even database administrators and host providers cannot inspect contents.
            </p>
            <div className="inline-flex items-center text-[11px] font-mono text-shield-indigo font-medium bg-shield-indigo/10 px-2.5 py-1 rounded-full relative z-10">
              Authenticated Cipher IV:Salt
            </div>
          </div>

          {/* Card 3: Anonymous Tokens */}
          <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-7 rounded-3xl shadow-apple-card hover:bg-white/[0.05] transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-shield-green/10 border border-shield-green/20 flex items-center justify-center mb-6 text-shield-green group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Cryptographic Tokens</h3>
            <p className="text-apple-gray-400 text-sm leading-relaxed mb-4">
              Zero registration. Zero credentials. Submitters receive a unique 12-character token (<code className="text-white bg-black/40 px-1 py-0.5 rounded text-xs">SHR-XXXX-XXXX</code>) as the sole retrieval key.
            </p>
            <div className="inline-flex items-center text-[11px] font-mono text-shield-green font-medium bg-shield-green/10 px-2.5 py-1 rounded-full">
              Zero-Knowledge Verification
            </div>
          </div>

          {/* Card 4: Incident Timeline & Schedule Builder */}
          <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-7 rounded-3xl shadow-apple-card hover:bg-white/[0.05] transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-alert-amber/10 border border-alert-amber/20 flex items-center justify-center mb-6 text-alert-amber group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Detailed Incident Schedule Generator</h3>
            <p className="text-apple-gray-400 text-sm leading-relaxed mb-4">
              Build chronological milestone event logs with shift windows and recurrence patterns to provide investigators with irrefutable temporal precision.
            </p>
            <div className="inline-flex items-center text-[11px] font-mono text-alert-amber font-medium bg-alert-amber/10 px-2.5 py-1 rounded-full">
              Temporal Timeline Chronology
            </div>
          </div>

          {/* Card 5: NLP Fraud & Integrity Detection */}
          <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-7 rounded-3xl shadow-apple-card hover:bg-white/[0.05] transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-105 transition-transform">
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">NLP Fraud & Credibility Screening</h3>
            <p className="text-apple-gray-400 text-sm leading-relaxed mb-4">
              Advanced natural language processing audits report submissions against coordinated smear patterns, synthetic hallucination, and factual inconsistency.
            </p>
            <div className="inline-flex items-center text-[11px] font-mono text-purple-400 font-medium bg-purple-500/10 px-2.5 py-1 rounded-full">
              Linguistic Forensic Scoring
            </div>
          </div>

          {/* Card 6: Computer Vision Evidence & Manual Approval */}
          <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-7 rounded-3xl shadow-apple-card hover:bg-white/[0.05] transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">CV Evidence & Manual Approval</h3>
            <p className="text-apple-gray-400 text-sm leading-relaxed mb-4">
              Computer vision screens uploaded photos for digital tampering while client-side EXIF strippers purge GPS tags. All evidence enters a mandatory investigator approval queue.
            </p>
            <div className="inline-flex items-center text-[11px] font-mono text-blue-400 font-medium bg-blue-500/10 px-2.5 py-1 rounded-full">
              Dual-Layer Custody Verification
            </div>
          </div>

          {/* Card 7: Blockchain Chain-of-Custody Ledger */}
          <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-7 rounded-3xl shadow-apple-card hover:bg-white/[0.05] transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-shield-green/10 border border-shield-green/20 flex items-center justify-center mb-6 text-shield-green group-hover:scale-105 transition-transform">
              <Blocks className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Blockchain Chain-of-Custody</h3>
            <p className="text-apple-gray-400 text-sm leading-relaxed mb-4">
              Every report hash and evidence Merkle root is anchored into an immutable, append-only cryptographic blockchain ledger. Prohibits insider tampering or deletion.
            </p>
            <div className="inline-flex items-center text-[11px] font-mono text-shield-green font-medium bg-shield-green/10 px-2.5 py-1 rounded-full">
              SHA-256 Chained Block Proof
            </div>
          </div>

          {/* Card 8: DistilBERT Emotion & Crisis Prioritization */}
          <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-7 rounded-3xl shadow-apple-card hover:bg-white/[0.05] transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">DistilBERT Emotion Recognition</h3>
            <p className="text-apple-gray-400 text-sm leading-relaxed mb-4">
              Synthesizing IEEE ICSADL 2026 research: Evaluates distress, fear, trauma, and urgency to prioritize vulnerable victims of abuse and harassment with trauma-informed routing.
            </p>
            <div className="inline-flex items-center text-[11px] font-mono text-purple-400 font-medium bg-purple-500/10 px-2.5 py-1 rounded-full">
              IEEE Paper 11452105 Research Architecture
            </div>
          </div>
        </div>
      </motion.div>


      {/* How it Works 4-Phase Snapshot with link */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-24 w-full bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] rounded-3xl p-8 sm:p-12 shadow-apple-card"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-8 border-b border-white/[0.08] gap-4">
          <div>
            <span className="text-xs font-mono text-shield-blue tracking-wider uppercase font-semibold">Verification Pipeline</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mt-1">The 4-Phase Reporting Architecture</h2>
          </div>
          <Link 
            to="/how-it-works"
            className="text-xs font-medium text-apple-gray-300 hover:text-white flex items-center bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] px-4 py-2 rounded-xl transition-all"
          >
            Read In-Depth Workflow <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono text-shield-blue font-semibold">PHASE 01</span>
            <h4 className="text-base font-semibold text-white">Client Anonymization</h4>
            <p className="text-xs text-apple-gray-400 leading-relaxed">
              IPs and tracking cookies are neutralized before form data reaches storage. Real-time AI assists with classification.
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono text-shield-blue font-semibold">PHASE 02</span>
            <h4 className="text-base font-semibold text-white">Cryptographic Key</h4>
            <p className="text-xs text-apple-gray-400 leading-relaxed">
              Submitter receives a 12-char SHR token. This serves as the private decryption handshake for case follow-ups.
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono text-shield-blue font-semibold">PHASE 03</span>
            <h4 className="text-base font-semibold text-white">AI & CV Triage</h4>
            <p className="text-xs text-apple-gray-400 leading-relaxed">
              NLP fraud analysis scores integrity while Computer Vision analyzes evidence integrity before notifying investigators.
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono text-shield-blue font-semibold">PHASE 04</span>
            <h4 className="text-base font-semibold text-white">Investigator Resolution</h4>
            <p className="text-xs text-apple-gray-400 leading-relaxed">
              Authorized investigators review sanitized facts, manually verify evidence chain-of-custody, and take action.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
