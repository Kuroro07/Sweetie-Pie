import React, { useState } from 'react';
import { OpenWhenLetter, Personalization } from '../types';
import { sound } from '../utils/sound';
import { Heart, X, Mail, Wind, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OpenWhenPageProps {
  personalization: Personalization;
  letters: OpenWhenLetter[];
  onNextChapter: () => void;
  onMarkCompleted: () => void;
}

export const OpenWhenPage: React.FC<OpenWhenPageProps> = ({
  personalization,
  letters,
  onNextChapter,
  onMarkCompleted,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<OpenWhenLetter | null>(null);
  const [isHoldingHug, setIsHoldingHug] = useState(false);
  const [hugSeconds, setHugSeconds] = useState(0);
  const [hugCompleted, setHugCompleted] = useState(false);

  const handleOpenLetter = (letter: OpenWhenLetter) => {
    sound.playPaperSound();
    setTimeout(() => {
      sound.playChime();
      setSelectedLetter(letter);
      setHugCompleted(false);
      setHugSeconds(0);
      onMarkCompleted();
    }, 120);
  };

  const handleStartHug = () => {
    setIsHoldingHug(true);
    sound.playHeartbeat();

    let sec = 0;
    const interval = setInterval(() => {
      sec++;
      setHugSeconds(sec);
      sound.playHeartbeat();

      if (sec >= 5) {
        clearInterval(interval);
        setIsHoldingHug(false);
        setHugCompleted(true);
        sound.playCelebration();
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#b45309', '#f59e0b', '#fbbf24'],
        });
      }
    }, 900);
  };

  return (
    <div className="mx-auto max-w-6xl py-10 px-4 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Chapter 05 · The Care Letters
        </span>
        <h1 className="font-serif-romantic text-4xl sm:text-5xl font-bold text-stone-900 mt-2 text-balance">
          "Open When..." Letters
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          For whenever life gets loud, you have a rough day, or you need to remember how special you are to me.
        </p>
      </div>

      {/* Grid of Envelopes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {letters.map((letter) => (
          <div
            key={letter.id}
            onClick={() => handleOpenLetter(letter)}
            className="group relative rounded-2xl bg-white p-6 shadow-sm border border-stone-200/90 hover:border-amber-300 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/70">
                  {letter.stamp}
                </span>
                <Mail className="h-4 w-4 text-stone-400 group-hover:text-stone-900 transition-colors" />
              </div>

              <h3 className="font-serif-romantic text-2xl font-bold text-stone-900 mt-4 leading-tight">
                {letter.title}
              </h3>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                {letter.subtitle}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-800">
              <span>Read Letter</span>
              <span className="text-stone-400 group-hover:translate-x-1 group-hover:text-stone-900 transition-all">
                →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Letter Modal */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-2xs">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#fffdfa] p-8 sm:p-10 shadow-xl border border-stone-200 transition-all">
            <div className="flex items-center justify-between border-b border-stone-200/70 pb-4">
              <span className="font-mono text-xs font-bold text-amber-900 uppercase tracking-wider">
                {selectedLetter.stamp}
              </span>
              <button
                onClick={() => {
                  sound.playPaperSound();
                  setSelectedLetter(null);
                }}
                className="rounded-full p-1.5 text-stone-400 hover:text-stone-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6">
              <h2 className="font-serif-romantic text-3xl sm:text-4xl font-bold text-stone-900">
                {selectedLetter.title}
              </h2>
              <p className="font-handwriting text-xl text-amber-800 mt-1">
                For {personalization.herName}
              </p>
            </div>

            <div className="mt-6 space-y-4 text-stone-700 leading-relaxed text-sm sm:text-base font-light">
              {selectedLetter.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {selectedLetter.actionType === 'hug' && (
              <div className="mt-8 rounded-xl bg-amber-50/70 p-5 border border-amber-200/80 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                  A Quiet Virtual Hug
                </span>
                <p className="text-xs text-stone-600 mt-1 mb-3">
                  Press and hold to feel a comforting 5-second heartbeat embrace.
                </p>

                {hugCompleted ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-900">
                    <Heart className="h-4 w-4 fill-rose-600 text-rose-600 animate-pulse" />
                    <span>Embrace sent. You are never alone, Sweetie Pie.</span>
                  </div>
                ) : (
                  <button
                    onClick={handleStartHug}
                    disabled={isHoldingHug}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg text-white transition-all cursor-pointer ${
                      isHoldingHug ? 'bg-amber-800 scale-102 animate-pulse' : 'bg-stone-900 hover:bg-stone-800'
                    }`}
                  >
                    <Heart className="h-4 w-4 fill-white" />
                    <span>{isHoldingHug ? `Holding you close... (${5 - hugSeconds}s)` : 'Hold for Virtual Hug (5s)'}</span>
                  </button>
                )}
              </div>
            )}

            {selectedLetter.actionType === 'deep-breath' && (
              <div className="mt-8 rounded-xl bg-stone-100 p-5 border border-stone-200 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                  Calm Inhale & Exhale
                </span>
                <p className="text-xs text-stone-600 mt-1 mb-2">
                  Take a slow, deep breath in... hold for 3 seconds... and gently exhale.
                </p>
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-stone-800 mt-2">
                  <Wind className="h-4 w-4 text-stone-600" />
                  <span>I'm right here with you.</span>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-stone-200/70 flex flex-col items-end">
              <span className="font-handwriting text-2xl text-stone-600">
                {selectedLetter.closing}
              </span>
              <span className="font-serif-romantic text-2xl font-bold text-stone-900 mt-1">
                {personalization.hisName}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Chapter 6 Next Banner */}
      <div className="mt-12 rounded-2xl bg-amber-50/60 p-6 sm:p-8 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-800 font-semibold">
            Next Chapter
          </span>
          <h4 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Friendship & Beyond Vouchers
          </h4>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Free venting sessions with iced coffee, car ride playlist takeovers, and cozy coupons you can cash in anytime.
          </p>
        </div>
        <button
          onClick={onNextChapter}
          className="flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-md transition-all cursor-pointer shrink-0 active:scale-95"
        >
          <span>Go to Chapter 6: Vouchers</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
