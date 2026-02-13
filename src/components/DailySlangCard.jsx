import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';

const DailySlangCard = ({ slang, onClick }) => {
  if (!slang) return null;

  return (
    <button
      onClick={onClick}
      className="w-full bg-indigo-600 rounded-3xl p-6 text-left relative overflow-hidden group shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-slate-900 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all active:shadow-none active:translate-x-[6px] active:translate-y-[6px] mb-8"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-all"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 bg-indigo-500/50 px-3 py-1 rounded-full border border-indigo-400/30">
            <Calendar className="w-4 h-4 text-indigo-200" />
            <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Today's Pick</span>
          </div>
          <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
        </div>

        <h3 className="text-3xl font-black text-white mb-2">{slang.term}</h3>
        <p className="text-indigo-200 font-medium line-clamp-2 text-sm leading-relaxed">
          {slang.definition}
        </p>
        
        <div className="mt-4 flex items-center gap-2 text-white font-bold text-sm">
          <span>Tap to learn more</span>
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            →
          </div>
        </div>
      </div>
    </button>
  );
};

export default DailySlangCard;