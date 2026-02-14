import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, Map, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

const LevelCompleteModal = ({ show, onNextLevel, onReplayLevel, onBackToMap, level, score, total }) => {
  useEffect(() => {
    if (show) {
      // Fire confetti when modal opens
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [show]);

  if (!show) return null;

  // Calculate stars based on score (mastery)
  const percentage = (score / total) * 100;
  const stars = percentage >= 100 ? 3 : percentage >= 60 ? 2 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-sm rounded-3xl p-8 text-center border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
      >
        {/* Background rays effect */}
        <div className="absolute inset-0 bg-yellow-100 opacity-50 z-0 animate-[spin_10s_linear_infinite]" 
             style={{ backgroundImage: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, white 30deg, transparent 60deg, white 90deg, transparent 120deg, white 150deg, transparent 180deg, white 210deg, transparent 240deg, white 270deg, transparent 300deg, white 330deg)' }}>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-black uppercase italic mb-2 text-slate-900">Level {level} Complete!</h2>
          <p className="text-slate-500 font-bold mb-6">You smashed it!</p>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.2, type: "spring" }}
              >
                <Star 
                  className={`w-12 h-12 ${i <= stars ? 'fill-yellow-400 text-yellow-500' : 'fill-slate-200 text-slate-300'}`} 
                  strokeWidth={3}
                />
              </motion.div>
            ))}
          </div>

          <div className="bg-indigo-50 rounded-xl p-4 mb-8 border-2 border-indigo-100">
            <p className="text-indigo-900 font-bold text-lg">{score} / {total} Mastered</p>
            <p className="text-xs text-indigo-400 uppercase font-black tracking-widest mt-1">Keep the streak alive!</p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={onNextLevel}
              className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 text-lg"
            >
              <span>Next Level</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={onReplayLevel}
                className="py-3 bg-white text-slate-700 font-bold rounded-2xl border-2 border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Replay</span>
              </button>
              
              <button 
                onClick={onBackToMap}
                className="py-3 bg-white text-slate-700 font-bold rounded-2xl border-2 border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-all flex items-center justify-center gap-2"
              >
                <Map className="w-5 h-5" />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LevelCompleteModal;
