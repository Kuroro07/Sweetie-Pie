import React, { useState } from 'react';
import { Personalization } from '../types';
import { sound } from '../utils/sound';
import { Heart, Camera, Copy, Check, MessageCircle, Share2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FinalNotePageProps {
  personalization: Personalization;
  onUpdateHeroPhoto?: (dataUrl: string) => void;
  onRestartJourney: () => void;
  onMarkCompleted: () => void;
}

export const FinalNotePage: React.FC<FinalNotePageProps> = ({
  personalization,
  onUpdateHeroPhoto,
  onRestartJourney,
  onMarkCompleted,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const responsePrompts = [
    `I just read everything... this made me smile so much 🥺 Thank you for being such an amazing friend!`,
    `You're the sweetest best friend ever 🥰 Come give me the biggest hug right now!`,
    `This is the most thoughtful thing anyone has ever made for me. Let’s grab coffee this week, my treat ☕`,
    `You mean so much to me too. Forever grateful to have you in my corner 💕`,
  ];

  const handleCopyMessage = (msg: string, idx: number) => {
    sound.playPaperSound();
    navigator.clipboard.writeText(msg);
    setCopiedIndex(idx);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#b45309', '#f59e0b', '#fbbf24'],
    });
    onMarkCompleted();
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Chapter 08 · The Final Note
        </span>
        <h1 className="font-serif-romantic text-4xl sm:text-5xl font-bold text-stone-900 mt-2 text-balance">
          To My Favorite Person, {personalization.herName}
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          Why having you in my life means more than words can usually say.
        </p>
      </div>

      {/* Parchment Card */}
      <div className="relative rounded-3xl bg-[#fffdfa] p-8 sm:p-14 shadow-md border border-stone-300/80 paper-texture">
        {/* Subtle ribbon top */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 fill-amber-700 text-amber-700" />
            <span className="font-serif-romantic text-sm italic text-stone-600">
              A quiet note from my heart
            </span>
          </div>
          <span className="text-xs font-mono text-stone-400">
            {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </span>
        </div>

        {/* Header section with optional Polaroid if uploaded */}
        <div className={`mt-8 flex flex-col ${personalization.heroPhoto ? 'sm:flex-row items-center gap-8' : 'items-start'} border-b border-stone-200/60 pb-8`}>
          {personalization.heroPhoto && (
            <div className="relative bg-white p-3 pb-6 rounded-xs shadow-sm border border-stone-200 rotate-[-1.5deg] w-48 sm:w-56 shrink-0">
              <div className="relative w-full aspect-square rounded-2xs bg-stone-100 overflow-hidden border border-stone-200 flex items-center justify-center">
                <img
                  src={personalization.heroPhoto}
                  alt={personalization.herName}
                  className="w-full h-full object-cover"
                />
                {onUpdateHeroPhoto && (
                  <label className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/95 px-2 py-1 rounded-md text-[10px] font-medium text-stone-800 border border-stone-200 shadow-2xs cursor-pointer hover:text-amber-800">
                    <Camera className="h-3 w-3 text-amber-700" />
                    <span>Change</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="mt-3 text-center">
                <span className="font-handwriting text-lg text-stone-700">
                  My Sweetie Pie
                </span>
              </div>
            </div>
          )}

          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-serif-romantic text-3xl sm:text-4xl font-bold text-stone-900">
              You Mean the World to Me.
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 leading-relaxed">
              My favorite conversation, my closest confidante, and the person who makes every week brighter.
            </p>
          </div>
        </div>

        {/* The Narrative Letter */}
        <div className="mt-8 space-y-4 text-stone-800 leading-relaxed text-sm sm:text-base font-light">
          {personalization.finalLetter.split('\n\n').map((para, i) => (
            <p key={i}>
              {para}
            </p>
          ))}
        </div>

        {/* Sign-off */}
        <div className="mt-10 pt-6 border-t border-stone-200/80 flex flex-col items-end">
          <span className="font-handwriting text-2xl text-stone-600">
            Always in your corner,
          </span>
          <span className="font-serif-romantic text-2xl font-bold text-stone-900 mt-1">
            {personalization.hisName}
          </span>
        </div>
      </div>

      {/* Gentle Response Section */}
      <div className="mt-12 rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-stone-200">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="h-5 w-5 text-amber-800" />
          <h3 className="font-serif-romantic text-2xl font-bold text-stone-900">
            Send a Quick Reaction
          </h3>
        </div>
        <p className="text-xs text-stone-600 mb-6">
          Finished reading? Click any note below to copy it or send it back to him right now:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {responsePrompts.map((msg, idx) => (
            <div
              key={idx}
              className="group flex flex-col justify-between p-4 rounded-xl bg-stone-50 border border-stone-200 hover:border-amber-300 hover:bg-amber-50/30 transition-all text-xs"
            >
              <p className="text-stone-800 leading-relaxed font-medium">“{msg}”</p>
              <div className="mt-4 flex items-center justify-between pt-2 border-t border-stone-200/60">
                <button
                  onClick={() => handleCopyMessage(msg, idx)}
                  className="flex items-center gap-1.5 text-stone-700 hover:text-stone-950 font-semibold cursor-pointer"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Note</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-emerald-600 transition-colors"
                  title="Send via WhatsApp"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Walk through again */}
      <div className="mt-10 text-center">
        <button
          onClick={() => {
            sound.playChime();
            onRestartJourney();
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/70 transition-all cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Walk through our chapters again</span>
        </button>
      </div>
    </div>
  );
};
