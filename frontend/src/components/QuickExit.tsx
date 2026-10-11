import { useState, useEffect } from 'react';
import { LogOut, ShieldAlert } from 'lucide-react';

interface QuickExitProps {
  redirectUrl?: string;
}

export const QuickExit = ({ redirectUrl = 'https://www.google.com' }: QuickExitProps) => {
  const [isEscaping, setIsEscaping] = useState(false);

  const triggerEscape = () => {
    setIsEscaping(true);

    try {
      // 1. Wipe temporary browser caches
      sessionStorage.clear();
      localStorage.removeItem('shieldreport_draft');
      localStorage.removeItem('shieldreport_token');

      // 2. Overwrite history state so browser 'Back' button cannot reopen case
      window.history.pushState(null, '', 'https://www.google.com');
      window.history.replaceState(null, '', 'https://www.google.com');
    } catch {
      // In case of sandbox storage restrictions
    }

    // 3. Immediately redirect to neutral website
    window.location.replace(redirectUrl);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Pressing Escape triggers instant panic evacuation
      if (e.key === 'Escape') {
        e.preventDefault();
        triggerEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [redirectUrl]);

  if (isEscaping) {
    return (
      <div className="fixed inset-0 bg-white z-[99999] flex items-center justify-center">
        <span className="text-gray-400 font-sans text-sm">Redirecting...</span>
      </div>
    );
  }

  return (
    <aside 
      aria-label="Emergency Panic Evacuation"
      className="fixed bottom-5 right-5 z-[9999] flex items-center shadow-2xl transition-transform hover:scale-105 active:scale-95"
    >
      <button
        onClick={triggerEscape}
        title="Emergency Panic Evacuation (Press ESC key anywhere)"
        className="group flex items-center space-x-2 bg-alert-red hover:bg-red-600 text-white px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide border border-red-400/40 shadow-[0_0_20px_rgba(255,69,58,0.4)] backdrop-blur-md transition-all cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        <span>Quick Exit</span>
        <kbd className="hidden sm:inline-block bg-black/30 border border-white/20 rounded px-1.5 py-0.5 text-[10px] font-mono uppercase font-bold text-white/90">
          ESC
        </kbd>
      </button>

      {/* Safety Hint Popover on Hover */}
      <div className="pointer-events-none absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 border border-white/10 text-apple-gray-300 text-[11px] p-2.5 rounded-xl w-56 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center space-x-1.5 text-alert-red font-semibold mb-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Anti-Surveillance Protocol</span>
        </div>
        Instantly closes this terminal, wipes session memory, and redirects to Google.
      </div>
    </aside>
  );
};
