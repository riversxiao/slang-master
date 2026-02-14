import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import FlashCard from './FlashCard';

const CardStack = ({ currentDeck, currentIndex, onNext, onToggleMastery, masteredIds }) => {
  // We only need to render the current card and the next card
  const visibleCards = currentDeck.slice(currentIndex, currentIndex + 2);
  
  // Reverse to make sure the first card in the array is on top (z-index)
  // But in absolute positioning, usually the last element is on top. 
  // Let's keep it simple: Map and control z-index manually.

  return (
    <div className="relative w-full h-80 md:h-96 my-4 perspective-1000">
      <AnimatePresence>
        {visibleCards.map((slang, index) => {
          // index 0 is the current card (top), index 1 is the next card (bottom)
          const isTop = index === 0;
          const realIndex = currentIndex + index;
          const isMastered = masteredIds.includes(slang.id);

          return (
            <motion.div
              key={slang.id}
              className="absolute w-full h-full"
              style={{
                zIndex: isTop ? 10 : 5,
              }}
              initial={false}
              animate={{
                scale: isTop ? 1 : 0.95,
                y: isTop ? 0 : 10,
                opacity: 1,
              }}
              exit={{ 
                x: -300, 
                opacity: 0, 
                transition: { duration: 0.2 } 
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <FlashCard
                slang={slang}
                isMastered={isMastered}
                isTop={isTop} // Only allow dragging if it's the top card
                onToggleMastery={() => onToggleMastery(slang.id)}
                onSwipeLeft={() => onNext()}
                onSwipeRight={() => {
                  if (!isMastered) onToggleMastery(slang.id);
                  onNext();
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {/* Empty state when deck is finished */}
      {visibleCards.length === 0 && (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-white/50 rounded-3xl border-4 border-slate-200 border-dashed">
          <p className="text-xl font-black mb-2">🎉 All Done!</p>
          <p className="text-sm">You've gone through all cards in this set.</p>
        </div>
      )}
    </div>
  );
};

export default CardStack;
