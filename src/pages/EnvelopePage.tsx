import React, { useState } from 'react';
import { Personalization } from '../types';
import { sound } from '../utils/sound';
import { Heart, ArrowRight, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EnvelopePageProps {
  personalization: Personalization;
  onUpdateHeroPhoto?: (dataUrl: string) => void;
  onNextChapter: () => void;
  onMarkCompleted: () => void;
}

export const EnvelopePage: React.FC<EnvelopePageProps> = ({
  personalization,
  onUpdateHeroPhoto,
  onNextChapter,
  onMarkCompleted,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsBreaking(true);
    sound.playPaperSound();

    setTimeout(() => {
      sound.playChime();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#b45309', '#f59e0b', '#e11d48', '#fbcfe8'],
      });
      setIsOpen(true);
      setIsBreaking(false);
      onMarkCompleted();
    }, 350);
  };

  const handleHeroPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateHeroPhoto) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpdateHeroPhoto(reader.result as string);
      sound.playPaperSound();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      {/* Intro Header */}
      <div className="text-center max-w-xl mb-8">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Chapter 01 · A Letter For You
        </span>
        <h1 className="font-serif-romantic text-4xl sm:text-5xl font-bold text-stone-900 mt-2 text-balance">
          To My Best Friend, {personalization.herName}
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          Click the wax seal on the envelope to unfold the quiet letter inside.
        </p>
      </div>

      {/* The Envelope / Unfolded Letter */}
      <div className="relative w-full max-w-2xl">
        {!isOpen ? (
          /* Closed Linen Envelope */
          <div
            onClick={handleOpenEnvelope}
            className={`group relative mx-auto w-full max-w-lg aspect-[16/10] rounded-2xl bg-[#fdfbf7] p-8 shadow-md border border-stone-300/80 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${
              isBreaking ? 'scale-98 opacity-90' : ''
            }`}
          >
            {/* Flap creases */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-1/2 border-b border-stone-200/80 bg-gradient-to-b from-[#f7f3ec] to-[#f2ede4]" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 border-t border-stone-200/50 bg-[#faf6ef]" />
            </div>

            {/* Vintage Stamp */}
            <div className="absolute top-4 right-5 rotate-1 rounded-xs border border-stone-300 bg-amber-50/80 p-2 shadow-2xs">
              <div className="flex flex-col items-center justify-center text-center">
                <Heart className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
                <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-stone-700 mt-0.5">
                  Best Friend
                </span>
                <span className="text-[7px] text-stone-500">Special Delivery</span>
              </div>
            </div>

            {/* Address handwriting */}
            <div className="relative z-10 mt-16 text-center">
              <span className="font-handwriting text-2xl text-stone-500 block">For:</span>
              <span className="font-serif-romantic text-3xl sm:text-4xl font-bold text-stone-900 block mt-1">
                {personalization.herName}
              </span>
              <span className="text-xs text-amber-800 font-medium tracking-wider uppercase block mt-2">
                My Favorite Person in the World
              </span>
            </div>

            {/* Wax Seal Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#9f3a38] via-[#852e2c] to-[#691e1d] shadow-md border-2 border-[#b84e4c] active:scale-95 transition-transform">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d66a68] bg-[#691e1d] shadow-inner">
                    <Heart className="h-5 w-5 fill-rose-200 text-rose-100 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold text-stone-700 bg-white/95 px-3 py-0.5 rounded-full shadow-2xs border border-stone-200">
                Tap Seal to Open
              </span>
            </div>
          </div>
        ) : (
          /* Unfolded Parchment Letter */
          <div className="relative mx-auto w-full max-w-xl rounded-2xl bg-[#fffdfa] p-8 sm:p-10 shadow-xl border border-stone-200 transition-all animate-in fade-in duration-400">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-stone-200/70 pb-4">
              <span className="font-serif-romantic text-sm italic text-stone-600">
                A quiet conversation from my heart
              </span>
              <span className="text-xs font-mono text-stone-400">
                Private & Personal
              </span>
            </div>

            {/* Salutation & Polaroid slot */}
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h2 className="font-serif-romantic text-3xl sm:text-4xl font-bold text-stone-900">
                  Dearest {personalization.herName},
                </h2>
                <span className="text-xs text-amber-800 font-medium block mt-1">
                  (My partner-in-crime, my confidante)
                </span>
              </div>

              {/* Mini Polaroid of her - only rendered if picture uploaded */}
              {personalization.heroPhoto && (
                <div className="relative bg-white p-2 pb-4 shadow-sm border border-stone-200 rotate-2 w-28 shrink-0">
                  <div className="w-full aspect-square bg-stone-100 rounded-2xs overflow-hidden flex items-center justify-center border border-stone-200">
                    <img
                      src={personalization.heroPhoto}
                      alt="Sweetie Pie"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {onUpdateHeroPhoto && (
                    <label className="block text-[8px] text-center text-rose-700 mt-1 cursor-pointer font-medium hover:underline">
                      Change photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroPhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}
            </div>

            {/* Letter Content */}
            <div className="mt-6 space-y-4 text-stone-700 leading-relaxed text-sm sm:text-base font-light">
              {personalization.envelopeMessage.split('\n\n').map((paragraph, i) => (
                <p key={i}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Sign-off */}
            <div className="mt-8 pt-6 border-t border-stone-200/60 flex flex-col items-end">
              <span className="font-handwriting text-2xl text-stone-600">
                Always in your corner,
              </span>
              <span className="font-serif-romantic text-2xl font-bold text-stone-900 mt-1">
                {personalization.hisName}
              </span>
            </div>

            {/* Progression to Chapter 2 (Her Photos) */}
            <div className="mt-10 pt-6 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-stone-500 text-center sm:text-left">
                <span>Next: A scrapbook of your pictures and candid moments.</span>
              </div>

              <button
                onClick={onNextChapter}
                className="group flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <span>Chapter 2: Pictures of You</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
