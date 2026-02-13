import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, RotateCw, Volume2, CheckCircle, ArrowRight, X } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Master Real Slang",
    description: "Learn the authentic English words they don't teach you in school.",
    icon: <BookOpen className="w-24 h-24 text-indigo-600" />,
    color: "bg-indigo-100"
  },
  {
    id: 2,
    title: "Flip to Reveal",
    description: "Tap any card to flip it and see the definition and real-world examples.",
    icon: <RotateCw className="w-24 h-24 text-pink-600" />,
    color: "bg-pink-100"
  },
  {
    id: 3,
    title: "Listen & Master",
    description: "Hear native pronunciation and mark words as 'Mastered' to track progress.",
    icon: <div className="flex gap-4">
            <Volume2 className="w-20 h-20 text-blue-600" />
            <CheckCircle className="w-20 h-20 text-green-600" />
          </div>,
    color: "bg-blue-100"
  }
];

const Onboarding = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-slate-900 flex flex-col relative h-[500px]">
        {/* Skip Button */}
        <button 
          onClick={onComplete}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm z-10"
        >
          Skip
        </button>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className={`mb-8 p-8 rounded-full ${slides[currentIndex].color} border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                {slides[currentIndex].icon}
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                {slides[currentIndex].title}
              </h2>
              <p className="text-slate-600 font-medium text-lg">
                {slides[currentIndex].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 flex items-center justify-between bg-slate-50 border-t-2 border-slate-100">
          {/* Dots Indicator */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <div 
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-slate-900 w-6' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Next/Start Button */}
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
          >
            {currentIndex === slides.length - 1 ? "Let's Go!" : "Next"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;