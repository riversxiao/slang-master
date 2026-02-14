import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { CheckCircle, Circle, Volume2, X, Languages, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import DeepDiveModal from './DeepDiveModal';

const FlashCard = ({ slang, isMastered, onToggleMastery, onSwipeLeft, onSwipeRight, isTop = true }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCn, setShowCn] = useState(false); // State for language toggle
  const [showDeepDive, setShowDeepDive] = useState(false); // State for deep dive modal
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Ensure slang object has deep_dive property with fallback
  const processedSlang = React.useMemo(() => {
    if (!slang) return null;
    if (slang.deep_dive) return slang;

    return {
      ...slang,
      deep_dive: {
        image_keyword: `${slang.term} 3d icon colorful`,
        origin: "Internet Culture / Gen Z Slang",
        explanation: `"${slang.term}" is a popular term in modern internet culture. It reflects the evolving language of Gen Z.`,
        explanation_cn: `"${slang.term}" 是当代网络文化中的流行词，反映了 Z 世代语言的不断演变。`
      }
    };
  }, [slang]);

  if (!processedSlang) return null;

  // Reset state when slang changes
  useEffect(() => {
    setIsFlipped(false);
    setShowCn(false);
    x.set(0);
  }, [slang, x]);

  const handleFlip = () => {
    // Only flip if not dragging and is top card
    if (Math.abs(x.get()) < 5 && isTop) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      // Swipe Right
      onSwipeRight && onSwipeRight();
    } else if (info.offset.x < -threshold) {
      // Swipe Left
      onSwipeLeft && onSwipeLeft();
    }
  };
  
  // If not top card, disable drag and transform
  const cardStyle = isTop 
    ? { x, rotate, opacity, transformStyle: 'preserve-3d' } 
    : { transformStyle: 'preserve-3d' };

  const [deepDiveHighlight, setDeepDiveHighlight] = useState(false);

  // Trigger highlight animation when mastered
  useEffect(() => {
    if (isMastered) {
      setDeepDiveHighlight(true);
      const timer = setTimeout(() => setDeepDiveHighlight(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isMastered]);

  const handleSpeak = (e) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(processedSlang.term);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isMastered) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#818cf8', '#f472b6', '#facc15', '#4ade80']
      });
    }
    onToggleMastery();
  };
  
  const toggleLanguage = (e) => {
    e.stopPropagation();
    setShowCn(!showCn);
  };

  const openDeepDive = (e) => {
    e.stopPropagation();
    setShowDeepDive(true);
  };

  return (
    <>
      <div className="flex items-center justify-center w-full h-80 md:h-96 perspective-1000 my-4 relative">
        {/* Swipe Indicators (Optional visual cues) */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 opacity-0 md:opacity-100 pointer-events-none z-0">
        <X className="w-12 h-12 text-red-200" />
      </div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 md:opacity-100 pointer-events-none z-0">
        <CheckCircle className="w-12 h-12 text-green-200" />
      </div>

      <motion.div
        className="relative w-full max-w-[20rem] h-full cursor-pointer preserve-3d touch-none"
        onClick={handleFlip}
        initial={isTop ? { scale: 0.8, opacity: 0 } : false}
        animate={{ rotateY: isFlipped ? 180 : 0, scale: 1, opacity: 1 }}
        exit={isTop ? { scale: 0.8, opacity: 0 } : undefined}
        style={cardStyle}
        drag={isTop ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        whileTap={isTop ? { cursor: 'grabbing' } : undefined}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-slate-900 flex flex-col items-center justify-center p-6 backface-hidden">
          <div className="absolute top-4 right-4 flex gap-1">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-400 border-2 border-slate-900"></div>
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-yellow-400 border-2 border-slate-900"></div>
          </div>
          
          {isMastered && (
            <div className="absolute top-4 left-4 flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-lg border-2 border-green-200">
              <CheckCircle className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase">Mastered</span>
            </div>
          )}
          
          <span className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs md:text-sm font-bold border-2 border-indigo-200 mb-4 md:mb-6 uppercase tracking-wider">{processedSlang.category}</span>
          
          <div className="flex items-center gap-2 mt-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center leading-tight">{processedSlang.term}</h2>
            <button 
              onClick={handleSpeak}
              className="p-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors"
              title="Listen to pronunciation"
            >
              <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
            </button>
          </div>

          <p className="mt-6 md:mt-8 text-slate-500 text-xs md:text-sm font-bold animate-pulse">👉 Tap to reveal</p>
          <p className="absolute bottom-4 text-slate-300 text-[10px] font-bold uppercase tracking-widest">Swipe Left/Right</p>
        </div>

        {/* Back of the card */}
        <div 
          className="absolute w-full h-full bg-indigo-600 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-slate-900 flex flex-col items-center justify-center p-6 backface-hidden text-white"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="absolute top-4 left-4 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white border-2 border-slate-900 opacity-50"></div>

          {/* Deep Dive Entry - Top Right Floating Capsule */}
          {/* Removed per user request - moved to Example header */}
          {!slang.deep_dive && (
            <div className="absolute top-4 right-4 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white border-2 border-slate-900 opacity-50"></div>
          )}

          <div className="flex w-full justify-between items-center mb-2 px-2 mt-8 md:mt-6">
            <h3 className="text-lg md:text-xl font-black text-center bg-black/20 px-4 py-1 rounded-lg">Definition</h3>
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              {processedSlang.definition_cn && (
                <button 
                  onClick={toggleLanguage}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  title="Toggle Language"
                >
                  <Languages className="w-5 h-5" />
                </button>
              )}
              
              {/* Deep Dive Button - Animated Icon Style */}
              {processedSlang.deep_dive && (
                <motion.button
                  onClick={openDeepDive}
                  className={`p-2 rounded-full text-white shadow-lg relative overflow-hidden group ${deepDiveHighlight ? 'bg-yellow-400 text-slate-900 shadow-yellow-500/50' : 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-purple-500/30'}`}
                  title="Deep Dive Analysis"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={deepDiveHighlight ? {
                    scale: [1, 1.3, 1, 1.3, 1],
                    rotate: [0, -15, 15, -15, 15, 0],
                    boxShadow: "0px 0px 20px rgba(250, 204, 21, 0.8)"
                  } : {
                    scale: [1, 1.1, 1],
                    boxShadow: ["0px 0px 0px rgba(168,85,247,0)", "0px 0px 15px rgba(168,85,247,0.5)", "0px 0px 0px rgba(168,85,247,0)"]
                  }}
                  transition={{ 
                    duration: deepDiveHighlight ? 0.5 : 2,
                    repeat: deepDiveHighlight ? 2 : Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                >
                  <motion.div
                    animate={!deepDiveHighlight ? { rotate: [0, -20, 20, -20, 20, 0] } : {}}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className={`w-5 h-5 ${deepDiveHighlight ? 'fill-slate-900' : ''}`} />
                  </motion.div>
                  
                  {/* Shine effect overlay */}
                  <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:animate-[shine_1s_ease-in-out]" />
                </motion.button>
              )}
            </div>
          </div>
          
          <p className="text-base md:text-lg font-bold text-center mb-4 md:mb-6 leading-relaxed min-h-[3rem] flex items-center justify-center">
            {showCn ? processedSlang.definition_cn : processedSlang.definition}
          </p>
          
          <div className="w-full h-1 bg-indigo-400/50 rounded-full mb-4"></div>
          
          <p className="text-center italic text-sm md:text-base font-medium opacity-90 bg-indigo-700/50 p-3 rounded-xl border-2 border-indigo-500/30 min-h-[4rem] flex items-center justify-center relative mb-4 md:mb-6">
            "{showCn ? processedSlang.example_cn : processedSlang.example}"
          </p>

          <div className="flex gap-2 w-full justify-center">
            <button
              onClick={handleToggle}
              className={`flex-1 flex items-center justify-center gap-2 px-2 py-2 md:px-6 md:py-3 rounded-xl font-black transition-all border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] text-xs md:text-base ${
                isMastered 
                  ? 'bg-green-400 text-slate-900' 
                  : 'bg-white text-slate-900 hover:bg-slate-50'
              }`}
            >
              {isMastered ? <CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> : <Circle className="w-4 h-4 md:w-5 md:h-5" />}
              {isMastered ? 'Mastered!' : 'Mark'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
    
    {/* Deep Dive Modal */}
    {showDeepDive && (
      <DeepDiveModal slang={processedSlang} onClose={() => setShowDeepDive(false)} />
    )}
    </>
  );
};

export default FlashCard;
