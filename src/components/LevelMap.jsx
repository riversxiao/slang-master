import React from 'react';
import { Lock, Star, CheckCircle, Flag } from 'lucide-react';

const LevelMap = ({ category, totalSlangs, masteredCount, onLevelSelect }) => {
  const SLANGS_PER_LEVEL = 10;
  console.log('LevelMap Render:', { category, totalSlangs, masteredCount });
  const totalLevels = Math.ceil(totalSlangs / SLANGS_PER_LEVEL);
  
  // Calculate current level based on mastered count (simplified logic)
  // In a real app, you'd track mastered IDs per level
  const currentLevel = Math.floor(masteredCount / SLANGS_PER_LEVEL) + 1;

  const levels = Array.from({ length: totalLevels }, (_, i) => {
    const levelNum = i + 1;
    const isLocked = levelNum > currentLevel;
    const isCompleted = levelNum < currentLevel;
    const isCurrent = levelNum === currentLevel;
    
    return {
      id: levelNum,
      isLocked,
      isCompleted,
      isCurrent,
      startIndex: i * SLANGS_PER_LEVEL
    };
  });

  return (
    <div className="w-full min-h-[60vh] px-4 pb-20 pt-4">
      <div className="flex flex-col items-center gap-8 relative">
        {/* Winding Path Line (Simplified as a central dashed line for now) */}
        <div className="absolute top-0 bottom-0 w-1 bg-slate-200 border-l-2 border-dashed border-slate-400 z-0" />

        {levels.map((level, index) => (
          <div 
            key={level.id}
            className={`relative z-10 w-full flex ${index % 2 === 0 ? 'justify-start pl-8' : 'justify-end pr-8'}`}
          >
            <button
              disabled={level.isLocked}
              onClick={() => onLevelSelect(level.id, level.startIndex)}
              className={`
                w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 shadow-lg transition-all
                ${level.isLocked 
                  ? 'bg-slate-200 border-slate-400 text-slate-400 cursor-not-allowed' 
                  : level.isCompleted
                    ? 'bg-green-100 border-green-500 text-green-600'
                    : 'bg-white border-indigo-600 text-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)] scale-110'
                }
              `}
            >
              {level.isLocked ? (
                <Lock className="w-8 h-8" />
              ) : level.isCompleted ? (
                <div className="relative">
                  <Star className="w-8 h-8 fill-current" />
                  <CheckCircle className="w-4 h-4 absolute -bottom-1 -right-1 bg-white rounded-full text-green-600" />
                </div>
              ) : (
                <span className="text-2xl font-black">{level.id}</span>
              )}
            </button>
            
            {/* Level Label */}
            <div className={`absolute top-1/2 -translate-y-1/2 ${index % 2 === 0 ? 'left-32 text-left' : 'right-32 text-right'} w-32`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${level.isLocked ? 'text-slate-400' : 'text-slate-600'}`}>
                Level {level.id}
              </span>
              {!level.isLocked && (
                <div className="text-xs font-medium text-slate-500">
                  {Math.min((index + 1) * SLANGS_PER_LEVEL, totalSlangs) - (index * SLANGS_PER_LEVEL)} words
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="relative z-10 bg-slate-900 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 mt-4">
          <Flag className="w-4 h-4" />
          <span>Finish Line</span>
        </div>
      </div>
    </div>
  );
};

export default LevelMap;