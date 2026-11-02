import React from 'react';
import { PageId } from '../types';
import { PAGES } from '../data/initialData';
import { sound } from '../utils/sound';
import { X, Heart, CheckCircle2 } from 'lucide-react';

interface ChapterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: PageId;
  onSelectPage: (id: PageId) => void;
  completedPages: Set<PageId>;
}

export const ChapterDrawer: React.FC<ChapterDrawerProps> = ({
  isOpen,
  onClose,
  currentPage,
  onSelectPage,
  completedPages,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/40 backdrop-blur-2xs transition-opacity">
      <div className="relative flex h-full w-full max-w-md flex-col bg-[#faf8f5] p-6 shadow-xl overflow-y-auto border-l border-stone-200">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-800 font-semibold">
              Chapters for Sweetie Pie
            </span>
            <h2 className="font-serif-romantic text-2xl font-bold text-stone-900">
              Chapter Index
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playPaperSound();
              onClose();
            }}
            className="rounded-full p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-xs text-stone-600">
          Explore in order from Chapter 1 to 8, or jump directly to any page.
        </p>

        <div className="mt-6 space-y-2.5">
          {PAGES.map((page) => {
            const isCurrent = page.id === currentPage;
            const isCompleted = completedPages.has(page.id);

            return (
              <button
                key={page.id}
                onClick={() => {
                  sound.playChime();
                  onSelectPage(page.id);
                  onClose();
                }}
                className={`group flex w-full items-start gap-3.5 p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-stone-400 bg-white shadow-2xs'
                    : 'border-stone-200/80 bg-white/60 hover:border-stone-300 hover:bg-white'
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                    isCurrent
                      ? 'bg-stone-900 text-white'
                      : isCompleted
                      ? 'bg-stone-200 text-stone-700'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-stone-800" />
                  ) : (
                    page.chapterNumber
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-sm font-semibold truncate ${
                        isCurrent ? 'text-stone-950 font-serif-romantic text-base' : 'text-stone-800'
                      }`}
                    >
                      {page.title}
                    </h3>
                    {isCurrent && (
                      <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                    {page.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-6 border-t border-stone-200 text-center">
          <div className="inline-flex items-center justify-center gap-1.5 text-xs text-stone-600 font-medium">
            <Heart className="h-3 w-3 fill-rose-600 text-rose-600" />
            <span>Dedicated with all my heart to Sweetie Pie</span>
          </div>
        </div>
      </div>
    </div>
  );
};
