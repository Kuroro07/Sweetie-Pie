import React from 'react';
import { PageId } from '../types';
import { PAGES } from '../data/initialData';
import { sound } from '../utils/sound';
import { Volume2, VolumeX, Sparkles, Compass } from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onSelectPage: (id: PageId) => void;
  onOpenPersonalize: () => void;
  onOpenChapterDrawer: () => void;
  isAmbientPlaying: boolean;
  onToggleAmbient: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onSelectPage,
  onOpenPersonalize,
  onOpenChapterDrawer,
  isAmbientPlaying,
  onToggleAmbient,
}) => {
  const topLinks: { id: PageId; label: string }[] = [
    { id: 'envelope', label: 'The Letter' },
    { id: 'photos', label: 'Pictures of You' },
    { id: 'reasons', label: 'Reasons Jar' },
    { id: 'constellation', label: 'Memory Map' },
    { id: 'open-when', label: 'Care Letters' },
    { id: 'vouchers', label: 'Vouchers' },
  ];

  const currentInfo = PAGES.find((p) => p.id === currentPage);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#faf8f5]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Single text element in Cormorant Garamond) */}
        <button
          onClick={() => {
            sound.playChime();
            onSelectPage('envelope');
          }}
          className="group flex items-center gap-2 text-left shrink-0 cursor-pointer text-stone-900 transition-colors"
        >
          <span className="font-serif-romantic text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">
            For Sweetie Pie
          </span>
          <span className="text-xs text-stone-400 font-medium tracking-wide hidden sm:inline">
            · from your best friend
          </span>
        </button>

        {/* Zone 2: 4-5 single-line clean text nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
          {topLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  sound.playChime();
                  onSelectPage(link.id);
                }}
                className={`relative whitespace-nowrap shrink-0 py-1 transition-colors cursor-pointer ${
                  isActive
                    ? 'font-semibold text-stone-950'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-stone-900 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Utility Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Ambient Music Toggle */}
          <button
            onClick={onToggleAmbient}
            title={isAmbientPlaying ? 'Mute gentle piano' : 'Play soft gentle acoustic piano'}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all cursor-pointer ${
              isAmbientPlaying
                ? 'border-amber-400 bg-amber-50 text-amber-800'
                : 'border-stone-200 bg-white text-stone-600 hover:text-stone-950'
            }`}
          >
            {isAmbientPlaying ? (
              <Volume2 className="h-3.5 w-3.5 animate-pulse text-amber-700" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Chapter Guide */}
          <button
            onClick={() => {
              sound.playChime();
              onOpenChapterDrawer();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 rounded-lg transition-colors cursor-pointer border border-stone-200"
          >
            <Compass className="h-3.5 w-3.5 text-stone-600" />
            <span>Chapter {currentInfo?.chapterNumber || 1}/{PAGES.length}</span>
          </button>

          {/* Primary Action: Personalize / Upload Photos */}
          <button
            onClick={() => {
              sound.playChime();
              onOpenPersonalize();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Personalize & Photos</span>
          </button>
        </div>
      </div>
    </header>
  );
};
