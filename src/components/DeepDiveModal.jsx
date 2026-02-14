import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Sparkles, ChevronDown } from 'lucide-react';

const DeepDiveModal = ({ slang, onClose }) => {
  const [showCn, setShowCn] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  
  if (!slang || !slang.deep_dive) return null;

  const { image_keyword, origin, explanation, explanation_cn } = slang.deep_dive;

  useEffect(() => {
    // Simple image loading strategy
    const TOS_BASE_URL = "https://slang-images.tos-cn-beijing.volces.com/";
    const targetUrl = `${TOS_BASE_URL}${slang.id}.webp`;
    
    setLoading(true);
    
    // Create a temp image to check if it loads successfully
    const img = new Image();
    img.src = targetUrl;
    
    img.onload = () => {
      setImgSrc(targetUrl);
      setLoading(false);
    };
    
    img.onerror = () => {
      console.warn(`Image load failed for ID: ${slang.id}`);
      // Fallback placeholder
      setImgSrc(`https://placehold.co/800x600/6366f1/ffffff?text=${encodeURIComponent(slang.term)}`);
      setLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [slang.id, slang.term]);

  return ReactDOM.createPortal(
    <motion.div 
      layoutId={`card-${slang.id}`}
      className="fixed inset-0 z-[9999] flex flex-col bg-white overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} // Apple-like easing
    >
      {/* Fixed Close Button - Always visible */}
      <button 
        onClick={onClose}
        className="absolute top-safe-top right-6 p-3 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/20 z-[10000] hover:bg-black/60 transition-colors shadow-lg mt-4"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto bg-slate-50 relative overscroll-y-contain">
        
        {/* Header Image Area - Clean & Unobstructed */}
        <div className="relative w-full bg-slate-900 shrink-0 flex items-center justify-center py-8">
          {loading ? (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="relative w-full max-w-md aspect-square md:aspect-video rounded-2xl overflow-hidden shadow-2xl mx-4 border-4 border-white/10">
              <img 
                src={imgSrc} 
                alt={slang.term} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Subtle background blur effect */}
          {imgSrc && (
            <div 
              className="absolute inset-0 opacity-30 blur-3xl z-0 pointer-events-none"
              style={{ backgroundImage: `url(${imgSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
          )}
        </div>

        {/* Content Area - Clean Reading Experience */}
        <div className="px-6 py-8 md:px-10 md:py-10 max-w-3xl mx-auto -mt-4 bg-white rounded-t-3xl relative z-10">
          
          {/* Title Section - Moved below image */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="px-3 py-1 bg-indigo-500 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/30">Deep Dive</span>
              <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 border border-slate-200">{slang.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">{slang.term}</h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">{slang.definition}</p>
          </div>

          <hr className="border-slate-100 mb-8" />
          
          {/* Origin Section */}
          <div className="mb-12">
            <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Origin Story
            </h3>
            <p className="text-slate-800 text-xl md:text-2xl leading-relaxed font-serif italic border-l-4 border-indigo-500 pl-6 py-1">
              {origin}
            </p>
          </div>

          <hr className="border-slate-200 mb-12" />

          {/* Explanation Section */}
          <div className="mb-24">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-50/95 backdrop-blur-sm py-4 z-10 border-b border-slate-200">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-4 h-4" /> In-Depth Analysis
              </h3>
              
              {/* Language Toggle */}
              {explanation_cn && (
                <button 
                  onClick={() => setShowCn(!showCn)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all shadow-sm border border-slate-200"
                >
                  <Globe className="w-4 h-4" />
                  {showCn ? 'Switch to English' : 'Switch to Chinese'}
                </button>
              )}
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={showCn ? 'cn' : 'en'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="prose prose-lg prose-slate text-slate-700 leading-loose">
                  <p className="text-lg md:text-xl font-light text-slate-800">
                    {showCn ? explanation_cn : explanation}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>,
    document.body
  );
};

export default DeepDiveModal;
