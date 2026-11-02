import React, { useEffect, useState } from 'react';
import { PageId, Personalization } from '../types';
import { PAGES } from '../data/initialData';
import { sound } from '../utils/sound';
import { ArrowRight, ArrowLeft, Heart, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BottomJourneyBarProps {
  currentPage: PageId;
  onSelectPage: (id: PageId) => void;
  onOpenChapterDrawer: () => void;
  personalization: Personalization;
}

export const BottomJourneyBar: React.FC<BottomJourneyBarProps> = ({
  currentPage,
  onSelectPage,
  onOpenChapterDrawer,
  personalization,
}) => {
  const currentIndex = PAGES.findIndex((p) => p.id === currentPage);
  const currentChapter = PAGES[currentIndex] || PAGES[0];
  const nextChapter = PAGES[currentIndex + 1];
  const prevChapter = PAGES[currentIndex - 1];

  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const updateTime = () => {
      const start = new Date(personalization.friendshipDate).getTime();
      const now = Date.now();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeTogether({ days, hours, minutes });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [personalization.friendshipDate]);

  const handleNext = () => {
    sound.playChime();
    if (nextChapter) {
      if (nextChapter.id === 'final-note') {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#b45309', '#f59e0b', '#fbbf24'],
        });
      }
      onSelectPage(nextChapter.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onSelectPage('final-note');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    sound.playPaperSound();
    if (prevChapter) {
      onSelectPage(prevChapter.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="sticky bottom-0 z-30 border-t border-stone-200/80 bg-white/95 backdrop-blur-md shadow-sm transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Left: Previous Chapter or Friendship Counter */}
        <div className="flex items-center gap-3">
          {prevChapter ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/70 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-stone-500" />
              <span className="hidden sm:inline">Back: {prevChapter.shortTitle}</span>
              <span className="sm:hidden">Back</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
              <Heart className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
              <span className="hidden md:inline">In each other’s lives:</span>
              <span className="font-mono tabular-nums text-stone-900 font-semibold">
                {timeTogether.days} days
              </span>
            </div>
          )}

          <button
            onClick={() => {
              sound.playChime();
              onOpenChapterDrawer();
            }}
            className="hidden md:flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <Compass className="h-3.5 w-3.5 text-stone-400" />
            <span>
              Chapter {currentChapter.chapterNumber} of {PAGES.length}: {currentChapter.shortTitle}
            </span>
          </button>
        </div>

        {/* Center: Progress dots */}
        <div className="hidden sm:flex items-center gap-1.5">
          {PAGES.map((page, idx) => {
            const isCurrent = page.id === currentPage;
            const isPast = idx < currentIndex;
            return (
              <button
                key={page.id}
                onClick={() => {
                  sound.playChime();
                  onSelectPage(page.id);
                }}
                title={page.title}
                className={`h-2 transition-all rounded-full cursor-pointer ${
                  isCurrent
                    ? 'w-5 bg-stone-900'
                    : isPast
                    ? 'w-2 bg-stone-400 hover:bg-stone-600'
                    : 'w-2 bg-stone-200 hover:bg-stone-300'
                }`}
              />
            );
          })}
        </div>

        {/* Right: Next button */}
        <div className="flex items-center gap-2">
          {nextChapter ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 active:scale-95 rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Next: {nextChapter.shortTitle}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playPaperSound();
                onSelectPage('envelope');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Back to Beginning</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
