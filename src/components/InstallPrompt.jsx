import React, { useState, useEffect } from 'react';
import { X, Share } from 'lucide-react';

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    // Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    // Show prompt only on iOS and if not already installed
    if (isIOS && !isStandalone) {
      // Delay showing to not overwhelm user immediately
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-bounce-slight">
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-white/20 relative">
        <button 
          onClick={() => setShowPrompt(false)}
          className="absolute top-2 right-2 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start gap-4 pr-6">
          <div className="bg-indigo-600 p-2 rounded-xl shrink-0">
            <Share className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Install App</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Tap the <span className="inline-block px-1 bg-slate-700 rounded mx-1"><Share className="w-3 h-3 inline mb-1" /> Share</span> button below, then select <span className="font-bold text-white">"Add to Home Screen"</span> for the best experience!
            </p>
          </div>
        </div>
        
        {/* Arrow pointing down */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-r-2 border-b-2 border-white/20 rotate-45"></div>
      </div>
    </div>
  );
};

export default InstallPrompt;
