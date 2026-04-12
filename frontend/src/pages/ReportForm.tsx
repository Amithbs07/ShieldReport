import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, FileText, CheckCircle, Copy, ArrowRight, ArrowLeft } from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

export const ReportForm = () => {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    category: '',
    severity: '',
    description: '',
    location: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [caseToken, setCaseToken] = useState<string | null>(null);

  const categories = [
    'Workplace Harassment', 'Campus/School Incident', 
    'Civic/Government Fraud', 'Whistleblowing', 'Community Safety'
  ];

  const nextStep = () => setStep((s) => Math.min(4, s + 1) as Step);
  const prevStep = () => setStep((s) => Math.max(1, s - 1) as Step);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call to our backend
    setTimeout(() => {
      setCaseToken('SHR-9X8A-2Z1P');
      setIsSubmitting(false);
      setStep(4);
    }, 1500);
  };

  const copyToken = () => {
    if (caseToken) navigator.clipboard.writeText(caseToken);
    alert('Token copied to clipboard!');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-2xl">
        {step < 4 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Submit an Anonymous Report</h2>
            <p className="text-gray-400">Step {step} of 3</p>
            <div className="w-full bg-white/10 h-2 mt-4 rounded-full overflow-hidden">
              <motion.div 
                className="bg-shield-blue h-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: CATEGORY & SEVERITY */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <label className="block text-sm font-medium mb-3">Incident Category</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFormData(p => ({ ...p, category: cat }))}
                      className={`p-3 text-left border rounded-lg transition-colors ${formData.category === cat ? 'bg-shield-blue/20 border-shield-blue text-white' : 'border-white/10 text-gray-300 hover:bg-white/5'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <label className="block text-sm font-medium mb-3">Severity Level</label>
                <div className="flex gap-4">
                  {['Low', 'Medium', 'High', 'Critical'].map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setFormData(p => ({ ...p, severity: sev }))}
                      className={`flex-1 py-3 text-center border rounded-lg transition-colors ${formData.severity === sev ? (sev === 'Critical' ? 'bg-alert-amber/20 border-alert-amber text-alert-amber' : 'bg-shield-blue/20 border-shield-blue text-shield-blue') : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={nextStep}
                  disabled={!formData.category || !formData.severity}
                  className="px-6 py-3 bg-shield-blue text-white font-medium rounded-lg disabled:opacity-50 flex items-center"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: DESCRIPTION */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <label className="block text-sm font-medium mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-shield-blue" />
                  Incident Description
                </label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Provide as much detail as possible. Do not include your name or identifying information."
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-4 h-40 text-white placeholder-gray-500 focus:outline-none focus:border-shield-blue resize-none"
                />
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <label className="block text-sm font-medium mb-3">Location (Optional)</label>
                <input 
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Building A, 3rd Floor"
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-shield-blue"
                />
              </div>

              <div className="flex justify-between">
                <button onClick={prevStep} className="px-6 py-3 text-gray-400 hover:text-white flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
                <button 
                  onClick={nextStep}
                  disabled={formData.description.length < 10}
                  className="px-6 py-3 bg-shield-blue text-white font-medium rounded-lg disabled:opacity-50 flex items-center"
                >
                  Review <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: REVIEW */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/5 border border-alert-amber/30 p-6 rounded-2xl mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-alert-amber/10 blur-[50px] rounded-full"></div>
                <h3 className="text-lg font-bold text-alert-amber flex items-center mb-2">
                  <ShieldAlert className="w-5 h-5 mr-2" /> Final Security Check
                </h3>
                <ul className="text-gray-300 text-sm space-y-2 list-disc list-inside">
                  <li>Your IP address will be stripped.</li>
                  <li>Your description will be AES-256 encrypted.</li>
                  <li>Have you removed any names/emails that might identify you manually?</li>
                </ul>
              </div>

              <div className="bg-black/30 border border-white/10 p-6 rounded-xl space-y-4 text-sm text-gray-300">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-white">{formData.category}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-500">Severity</span>
                  <span className="font-medium text-white">{formData.severity}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-2">Description</span>
                  <p className="bg-white/5 p-3 rounded">{formData.description}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={prevStep} className="px-6 py-3 text-gray-400 hover:text-white flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Edit
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors flex items-center"
                >
                  {isSubmitting ? 'Encrypting & Sending...' : 'Submit Securely'}
                  {!isSubmitting && <CheckCircle className="w-5 h-5 ml-2" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS / TOKEN DISPLAY */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Report Submitted</h2>
              
              <div className="bg-alert-amber/10 border border-alert-amber/30 p-6 rounded-2xl mb-8 max-w-lg mx-auto">
                <h3 className="text-alert-amber font-bold flex items-center justify-center mb-3">
                  <AlertTriangle className="w-5 h-5 mr-2" /> CRITICAL: SAVE YOUR TOKEN
                </h3>
                <p className="text-sm text-gray-300 mb-6">
                  Because we do not know who you are, this token is the <strong className="text-white">only possible way</strong> you can ever check the status of this report or reply to investigators. If you lose this, it cannot be recovered.
                </p>

                <div className="bg-black/40 border border-white/20 rounded-xl p-4 flex items-center justify-between group">
                  <span className="font-mono text-2xl tracking-widest text-shield-blue select-all">
                    {caseToken}
                  </span>
                  <button 
                    onClick={copyToken}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 group-hover:text-white"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <Link to="/" className="text-shield-blue hover:underline">Return to Home Page</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
