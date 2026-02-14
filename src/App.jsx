import React, { useState, useMemo, useEffect } from 'react';
import { RefreshCw, BookOpen, ArrowLeft, CheckCircle, Settings, Brain } from 'lucide-react';
import FlashCard from './components/FlashCard';
import SettingsPage from './components/SettingsPage';
import Onboarding from './components/Onboarding';
import DailySlangCard from './components/DailySlangCard';
import LevelMap from './components/LevelMap';
import CategoryCard from './components/CategoryCard';
import ErrorBoundary from './components/ErrorBoundary';
import InstallPrompt from './components/InstallPrompt';
import CardStack from './components/CardStack';
import LevelCompleteModal from './components/LevelCompleteModal';
import genzData from './data/genz_slang.json'; // New real data

const slangData = genzData;

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('hasSeenOnboarding');
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null); // New state for level
  const [reviewDeck, setReviewDeck] = useState([]); // Fixed deck for review mode
  const [showLevelComplete, setShowLevelComplete] = useState(false); // New state for modal
  const [currentIndex, setCurrentIndex] = useState(0);
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem('masteredSlangs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse masteredSlangs", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('masteredSlangs', JSON.stringify(masteredIds));
  }, [masteredIds]);

  const toggleMastery = (id) => {
    setMasteredIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleResetProgress = () => {
    setMasteredIds([]);
    localStorage.removeItem('masteredSlangs');
    // Optional: Reset onboarding too if desired
    // localStorage.removeItem('hasSeenOnboarding'); 
    // setShowOnboarding(true);
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const getDailySlang = useMemo(() => {
    // Simple hash function to pick a slang based on date
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % slangData.length;
    return slangData[index];
  }, []);

  const handleDailyClick = () => {
    if (getDailySlang) {
      setSelectedCategory(getDailySlang.category);
      const catSlangs = slangData.filter(s => s.category === getDailySlang.category);
      const idx = catSlangs.findIndex(s => s.id === getDailySlang.id);
      
      // Calculate level and index within level
      const SLANGS_PER_LEVEL = 10;
      const level = Math.floor(idx / SLANGS_PER_LEVEL) + 1;
      const levelIndex = idx % SLANGS_PER_LEVEL;
      
      setSelectedLevel(level);
      setCurrentIndex(levelIndex);
    }
  };

  // Derive categories from data
  const categories = useMemo(() => {
    const cats = [...new Set(slangData.map(s => s.category))];
    return cats.map(cat => {
      const categorySlangs = slangData.filter(s => s.category === cat);
      const masteredInCat = categorySlangs.filter(s => masteredIds.includes(s.id)).length;
      return {
        name: cat,
        count: categorySlangs.length,
        masteredCount: masteredInCat
      };
    });
  }, [masteredIds]);

  const currentDeck = useMemo(() => {
    if (!selectedCategory) return [];
    if (selectedCategory === 'review') {
      return reviewDeck;
    }
    
    // Filter by category first
    const categorySlangs = slangData.filter(s => s.category === selectedCategory);
    
    // If level is selected, slice the data
    if (selectedLevel) {
      const SLANGS_PER_LEVEL = 10;
      const start = (selectedLevel - 1) * SLANGS_PER_LEVEL;
      const end = start + SLANGS_PER_LEVEL;
      const sliced = categorySlangs.slice(start, end);
      console.log(`Level ${selectedLevel} selected. Start: ${start}, End: ${end}. Deck size: ${sliced.length}`);
      return sliced;
    }
    
    return categorySlangs;
  }, [selectedCategory, selectedLevel, masteredIds]);

  const currentSlang = currentDeck[currentIndex];
  console.log('Current Deck Length:', currentDeck.length, 'Current Index:', currentIndex, 'Current Slang:', currentSlang);
  
  const isMastered = currentSlang ? masteredIds.includes(currentSlang.id) : false;

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedLevel(null); // Reset level when entering category
  };

  const handleLevelSelect = (levelId) => {
    setSelectedLevel(levelId);
    setCurrentIndex(0);
  };

  const handleReview = () => {
    const unmastered = slangData.filter(s => !masteredIds.includes(s.id));
    if (unmastered.length === 0) {
      alert("🎉 Incredible! You've mastered every single slang in the app!");
      return;
    }
    // Shuffle the unmastered cards for better review experience
    const shuffled = [...unmastered].sort(() => Math.random() - 0.5);
    setReviewDeck(shuffled);
    setSelectedCategory('review');
    setCurrentIndex(0);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setReviewDeck([]); // Clear review deck
    setCurrentIndex(0);
  };

  const handleNext = () => {
    if (currentDeck.length > 0) {
      // Simply move to the next card in the array
      if (currentIndex < currentDeck.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // End of deck behavior -> Show completion modal
        setShowLevelComplete(true);
      }
    }
  };

  const handleNextLevel = () => {
    setShowLevelComplete(false);
    // Move to next level
    if (selectedLevel) {
      setSelectedLevel(prev => prev + 1);
      setCurrentIndex(0);
    } else {
      // If in review mode or generic, maybe just shuffle?
      // For now, go back to map if not in levels
      handleBack();
    }
  };

  const handleModalBackToMap = () => {
    setShowLevelComplete(false);
    handleBack();
  };

  const handleReplayLevel = () => {
    setShowLevelComplete(false);
    setCurrentIndex(0);
    // Optional: shuffle?
  };

  const getCategoryName = (cat) => {
    switch(cat) {
      case 'Social Media': return 'Social';
      default: return cat;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-yellow-50 flex flex-col items-center py-8 px-4 relative overflow-hidden supports-[min-height:100svh]:min-h-[100svh]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-48 h-48 md:w-64 md:h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Header */}
      <header className="mb-6 md:mb-8 text-center relative z-10 w-full max-w-md pt-12 md:pt-safe-top px-4">
        <div className="flex items-center justify-between mb-2">
          <div className="w-10"></div> {/* Spacer */}
          
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 md:p-3 rounded-2xl shadow-lg border-2 border-slate-900 rotate-3">
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm">Slang Master</h1>
          </div>

          <button 
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 bg-white rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center transition-all"
          >
            <Settings className="w-6 h-6 text-slate-900" />
          </button>
        </div>
        <p className="text-slate-600 font-medium text-sm md:text-base">
          {selectedCategory === 'review' 
            ? 'Reviewing Weak Spots' 
            : selectedCategory 
              ? `Learning: ${selectedCategory}` 
              : 'Choose your vibe'}
        </p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md flex flex-col items-center gap-8 relative z-10">
        
        {showOnboarding && <Onboarding onComplete={handleCompleteOnboarding} />}

        {showSettings ? (
          <SettingsPage 
            onBack={() => setShowSettings(false)} 
            onResetProgress={handleResetProgress}
          />
        ) : !selectedCategory ? (
          /* Category Grid View */
          <>
            <div className="w-full px-2 space-y-6">
              <DailySlangCard slang={getDailySlang} onClick={handleDailyClick} />
              
              <button
                onClick={handleReview}
                className="w-full py-4 bg-white border-4 border-slate-900 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all active:shadow-none active:translate-x-[6px] active:translate-y-[6px] flex items-center justify-center gap-3 group"
              >
                <div className="bg-indigo-100 p-2 rounded-full border-2 border-indigo-200 group-hover:rotate-12 transition-transform">
                  <Brain className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-black text-slate-900 leading-none">Review Weak Spots</h3>
                  <p className="text-xs font-bold text-slate-500 mt-1">
                    {slangData.length - masteredIds.length} slangs to master
                  </p>
                </div>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 w-full px-2">
              {categories.map((cat) => (
                <CategoryCard 
                  key={cat.name} 
                  category={cat.name} 
                  count={cat.count} 
                  masteredCount={cat.masteredCount}
                  onClick={() => handleCategorySelect(cat.name)}
                />
              ))}
            </div>
          </>
        ) : !selectedLevel && selectedCategory !== 'review' ? (
          /* Level Map View */
          <>
            <div className="w-full flex justify-between px-2 items-center mb-4">
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 font-bold text-slate-700 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <h2 className="text-xl font-black uppercase tracking-wider">{getCategoryName(selectedCategory)}</h2>
              <div className="w-10"></div> {/* Spacer */}
            </div>
            <LevelMap 
              category={selectedCategory}
              totalSlangs={categories.find(c => c.name === selectedCategory)?.count || 0}
              masteredCount={categories.find(c => c.name === selectedCategory)?.masteredCount || 0}
              onLevelSelect={handleLevelSelect}
            />
          </>
        ) : (
          /* FlashCard View */
          <>
            <div className="w-full flex justify-between px-2 items-center">
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 font-bold text-slate-700 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                {selectedCategory === 'review' ? 'Home' : 'Levels'}
              </button>
              <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border-2 border-slate-900 text-xs font-bold shadow-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>
                  {selectedCategory === 'review' 
                    ? `${currentIndex + 1} / ${currentDeck.length}`
                    : `${currentDeck.filter(s => masteredIds.includes(s.id)).length} / ${currentDeck.length} Mastered`
                  }
                </span>
              </div>
            </div>

            {currentSlang ? (
              <CardStack 
                currentDeck={currentDeck}
                currentIndex={currentIndex}
                masteredIds={masteredIds}
                onNext={handleNext}
                onToggleMastery={toggleMastery}
              />
            ) : (
              <div className="text-center p-8 text-slate-500">
                <p>No slangs found in this category.</p>
                <button onClick={handleBack} className="mt-4 text-indigo-600 font-bold underline">Go Back</button>
              </div>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px] border-2 border-slate-900 text-sm md:text-base w-full md:w-auto justify-center"
            >
              <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
              <span>Next Slang</span>
            </button>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-12 text-slate-500 text-sm font-semibold relative z-10">
        <p>MVP Version 1.2 • Built with React</p>
      </footer>

      {/* Install Prompt for iOS */}
      <InstallPrompt />

      {/* Level Complete Modal */}
      <LevelCompleteModal 
        show={showLevelComplete}
        level={selectedLevel}
        score={currentDeck.filter(s => masteredIds.includes(s.id)).length}
        total={currentDeck.length}
        onNextLevel={handleNextLevel}
        onReplayLevel={handleReplayLevel}
        onBackToMap={handleModalBackToMap}
      />
    </div>
  );
}

export default App;
