import React from 'react';
import { Briefcase, Heart, Hash, Coffee, Layers } from 'lucide-react';

const CategoryCard = ({ category, onClick, count, masteredCount }) => {
  const getIcon = (cat) => {
    switch(cat) {
      case 'Workplace': return <Briefcase className="w-8 h-8" />;
      case 'Dating': return <Heart className="w-8 h-8" />;
      case 'Social Media': return <Hash className="w-8 h-8" />;
      case 'Daily Life': return <Coffee className="w-8 h-8" />;
      default: return <Layers className="w-8 h-8" />;
    }
  };

  const getColor = (cat) => {
    switch(cat) {
      case 'Workplace': return 'bg-blue-200 text-blue-900';
      case 'Dating': return 'bg-pink-200 text-pink-900';
      case 'Social Media': return 'bg-purple-200 text-purple-900';
      case 'Daily Life': return 'bg-orange-200 text-orange-900';
      default: return 'bg-gray-200 text-gray-900';
    }
  };

  const getCategoryName = (cat) => {
    switch(cat) {
      case 'Social Media': return 'Social';
      default: return cat;
    }
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full aspect-square ${getColor(category)} rounded-3xl border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all active:shadow-none active:translate-x-[6px] active:translate-y-[6px] flex flex-col items-center justify-center gap-4 p-4`}
    >
      <div className="bg-white/50 p-4 rounded-full border-2 border-slate-900">
        {getIcon(category)}
      </div>
      <div className="text-center">
        <h3 className="text-xl font-black uppercase tracking-wider">{getCategoryName(category)}</h3>
        <p className="text-sm font-bold opacity-70">{masteredCount}/{count} Mastered</p>
      </div>
    </button>
  );
};

export default CategoryCard;
