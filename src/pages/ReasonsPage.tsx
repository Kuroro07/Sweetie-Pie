import React, { useState, useRef, useEffect } from 'react';
import { LoveReason, Personalization } from '../types';
import { sound } from '../utils/sound';
import { Heart, Sparkles, Shuffle, Star, Plus, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReasonsPageProps {
  personalization: Personalization;
  reasons: LoveReason[];
  onToggleFavorite: (id: string) => void;
  onAddReason: (reason: LoveReason) => void;
  onNextChapter: () => void;
  onMarkCompleted: () => void;
}

export const ReasonsPage: React.FC<ReasonsPageProps> = ({
  personalization,
  reasons,
  onToggleFavorite,
  onAddReason,
  onNextChapter,
  onMarkCompleted,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentReasonIndex, setCurrentReasonIndex] = useState(0);
  const [isJarAnimating, setIsJarAnimating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReasonText, setNewReasonText] = useState('');
  const [newReasonCategory, setNewReasonCategory] = useState<LoveReason['category']>('best-friend');

  // Scratch card state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  const filteredReasons = reasons.filter((r) =>
    selectedCategory === 'all'
      ? true
      : selectedCategory === 'favorites'
      ? r.isFavorite
      : r.category === selectedCategory
  );

  const currentReason = filteredReasons[currentReasonIndex % (filteredReasons.length || 1)] || reasons[0];

  const handleDrawNext = () => {
    setIsJarAnimating(true);
    sound.playPaperSound();
    setTimeout(() => {
      sound.playPluck(1.05);
      setCurrentReasonIndex((prev) => (prev + 1) % (filteredReasons.length || 1));
      setIsJarAnimating(false);
      onMarkCompleted();
    }, 250);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Warm subdued gold foil
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#d97706');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(1, '#b45309');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch here to reveal a secret thought', rect.width / 2, rect.height / 2 + 5);

    let isDrawing = false;
    let scratchedPixels = 0;
    const totalPixels = rect.width * rect.height;

    const scratch = (clientX: number, clientY: number) => {
      const cRect = canvas.getBoundingClientRect();
      const x = clientX - cRect.left;
      const y = clientY - cRect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      scratchedPixels += 22 * 22 * 0.8;
      const percent = Math.min(100, Math.round((scratchedPixels / totalPixels) * 100));
      setScratchPercent(percent);

      if (percent > 45 && !isScratched) {
        setIsScratched(true);
        sound.playCelebration();
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#b45309', '#f59e0b', '#fbbf24'],
        });
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDrawing = true;
      scratch(e.clientX, e.clientY);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;
      scratch(e.clientX, e.clientY);
    };
    const onMouseUp = () => {
      isDrawing = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) {
        isDrawing = true;
        scratch(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDrawing && e.touches[0]) {
        scratch(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => {
      isDrawing = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReasonText.trim()) return;

    const newReason: LoveReason = {
      id: `custom-${Date.now()}`,
      category: newReasonCategory,
      text: newReasonText.trim(),
      isFavorite: true,
    };

    onAddReason(newReason);
    sound.playCelebration();
    setNewReasonText('');
    setShowAddModal(false);
  };

  const categories = [
    { id: 'all', label: 'All Observations' },
    { id: 'best-friend', label: 'Best Friend Moments' },
    { id: 'little-things', label: 'Little Habits' },
    { id: 'moments', label: 'Memories Together' },
    { id: 'favorite-habits', label: 'Little Details' },
    { id: 'favorites', label: 'Saved Favorites' },
  ];

  return (
    <div className="mx-auto max-w-6xl py-10 px-4 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Chapter 03 · Quiet Observations
        </span>
        <h1 className="font-serif-romantic text-4xl sm:text-5xl font-bold text-stone-900 mt-2 text-balance">
          Little Things I Notice About You
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          Every folded paper star in this jar holds a little detail about you, Sweetie Pie, that always brings a smile to my face.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              sound.playPluck(1);
              setSelectedCategory(cat.id);
              setCurrentReasonIndex(0);
            }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid: Jar & Reason Note (Left 7 cols), Scratch card (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Glass Jar Graphic */}
          <div
            onClick={handleDrawNext}
            className={`relative w-44 h-52 rounded-3xl border-2 border-stone-300 bg-gradient-to-b from-white/80 via-amber-50/20 to-stone-100/50 shadow-md flex flex-col items-center justify-end p-4 cursor-pointer transition-transform duration-300 hover:scale-102 ${
              isJarAnimating ? 'scale-98' : ''
            }`}
            title="Click jar to pull out a paper star"
          >
            {/* Cork lid */}
            <div className="absolute -top-3 w-24 h-5 rounded-t-md bg-[#8d6945] border border-[#6b4e31] shadow-2xs flex items-center justify-center">
              <span className="text-[9px] uppercase font-bold text-amber-100 tracking-wider">
                Our Jar
              </span>
            </div>

            {/* Paper stars inside */}
            <div className="absolute inset-x-3 bottom-3 top-6 flex flex-wrap gap-2 items-end justify-center overflow-hidden p-2 opacity-75">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-4 rounded-2xs bg-amber-200 border border-amber-300 shadow-2xs"
                  style={{
                    transform: `rotate(${((i * 45) % 90) - 45}deg)`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 w-full rounded-md bg-white/90 px-2 py-1 text-center shadow-2xs border border-stone-200">
              <span className="text-[11px] font-medium text-stone-700">
                Tap Jar to Unfold a Star
              </span>
            </div>
          </div>

          {/* Reason Note Card */}
          {currentReason ? (
            <div className="mt-6 w-full rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-stone-200">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                  Star #{reasons.findIndex((r) => r.id === currentReason.id) + 1}
                </span>

                <button
                  onClick={() => {
                    sound.playChime();
                    onToggleFavorite(currentReason.id);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
                    currentReason.isFavorite
                      ? 'border-amber-300 bg-amber-50 text-amber-800 font-medium'
                      : 'border-stone-200 text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Heart
                    className={`h-3.5 w-3.5 ${
                      currentReason.isFavorite ? 'fill-amber-600 text-amber-600' : ''
                    }`}
                  />
                  <span>{currentReason.isFavorite ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              {/* Reason Prose */}
              <div className="py-6">
                <p className="font-serif-romantic text-2xl sm:text-3xl font-medium text-stone-900 leading-snug">
                  “{currentReason.text}”
                </p>
              </div>

              {/* Bottom controls */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add another reason</span>
                </button>

                <button
                  onClick={handleDrawNext}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-2xs transition-all cursor-pointer active:scale-95"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                  <span>Unfold Another Note</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 w-full rounded-2xl bg-white p-8 text-center border border-stone-200 text-xs text-stone-500">
              No reasons in this category.
            </div>
          )}
        </div>

        {/* Right Column: Quiet Gold Scratch Card */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-stone-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <h3 className="font-serif-romantic text-xl font-bold text-stone-900">
                A Secret Note For You
              </h3>
            </div>
            <p className="text-xs text-stone-600 mb-4">
              I’ve hidden an honest thought beneath this golden foil. Scratch gently with your cursor or finger to read it.
            </p>

            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-amber-200/80 bg-[#fffdfa] shadow-inner">
              {/* Secret Message Underneath */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none bg-radial from-amber-50 to-white">
                <Heart className="h-6 w-6 text-rose-600 fill-rose-600 mb-2" />
                <span className="font-serif-romantic text-lg sm:text-xl font-bold text-stone-900 leading-relaxed">
                  “{personalization.secretScratchMessage}”
                </span>
                <span className="font-handwriting text-base text-stone-600 mt-2">
                  — From {personalization.hisName}
                </span>
              </div>

              {/* Canvas Scratch Foil */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-coin touch-none z-10"
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
              <span>Foil Cleared: {scratchPercent}%</span>
              {isScratched ? (
                <span className="font-semibold text-amber-800 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-600 text-amber-600" /> Revealed
                </span>
              ) : (
                <span>Scratch to clear</span>
              )}
            </div>
          </div>

          {/* Next Chapter Link */}
          <div className="mt-6 rounded-2xl bg-stone-50 p-5 border border-stone-200 flex flex-col justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Next Chapter
              </span>
              <h4 className="font-serif-romantic text-lg font-bold text-stone-900 mt-0.5">
                Map of Our Story
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                A starlit map charting the milestones that made us inseparable best friends.
              </p>
            </div>
            <button
              onClick={onNextChapter}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <span>Go to Chapter 4: Memory Map</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Reason Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-2xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-stone-200">
            <h3 className="font-serif-romantic text-2xl font-bold text-stone-900">
              Add a Note to the Jar
            </h3>
            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Category:
                </label>
                <select
                  value={newReasonCategory}
                  onChange={(e) => setNewReasonCategory(e.target.value as LoveReason['category'])}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-500"
                >
                  <option value="best-friend">Best Friend Moments</option>
                  <option value="little-things">Little Habits</option>
                  <option value="moments">Memories Together</option>
                  <option value="favorite-habits">Little Details</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Reason Description:
                </label>
                <textarea
                  required
                  rows={3}
                  value={newReasonText}
                  onChange={(e) => setNewReasonText(e.target.value)}
                  placeholder="e.g. How you always know when I need someone to talk to..."
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-2xs cursor-pointer"
                >
                  Save to Jar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
