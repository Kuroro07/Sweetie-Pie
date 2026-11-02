import React, { useState } from 'react';
import { MemoryStar, Personalization } from '../types';
import { sound } from '../utils/sound';
import { Star, Sparkles, MapPin, Calendar, Plus, ArrowRight, X, Heart, Camera, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConstellationPageProps {
  personalization: Personalization;
  stars: MemoryStar[];
  onAddStar: (star: MemoryStar) => void;
  onDeleteStar?: (starId: string) => void;
  onUpdateStarPhoto?: (starId: string, photoUrl: string) => void;
  onNextChapter: () => void;
  onMarkCompleted: () => void;
}

export const ConstellationPage: React.FC<ConstellationPageProps> = ({
  personalization,
  stars,
  onAddStar,
  onDeleteStar,
  onUpdateStarPhoto,
  onNextChapter,
  onMarkCompleted,
}) => {
  const [activeStarId, setActiveStarId] = useState<string | null>(stars[0]?.id || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newStory, setNewStory] = useState('');

  const activeStar = stars.find((s) => s.id === activeStarId) || stars[0];

  const handleSelectStar = (id: string) => {
    sound.playChime();
    setActiveStarId(id);
    onMarkCompleted();
  };

  const handleStarPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, starId: string) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateStarPhoto) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpdateStarPhoto(starId, reader.result as string);
      sound.playPaperSound();
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newStar: MemoryStar = {
      id: `star-${Date.now()}`,
      title: newTitle.trim(),
      dateStr: newDate.trim() || 'A quiet memory',
      location: newLocation.trim() || 'Together',
      story: newStory.trim() || 'A moment etched in my heart forever.',
      xPercent: Math.floor(Math.random() * 65) + 18,
      yPercent: Math.floor(Math.random() * 55) + 22,
    };

    onAddStar(newStar);
    setActiveStarId(newStar.id);
    sound.playCelebration();
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
    });
    setNewTitle('');
    setNewDate('');
    setNewLocation('');
    setNewStory('');
    setShowAddModal(false);
  };

  return (
    <div className="mx-auto max-w-6xl py-10 px-4 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Chapter 04 · Our Quiet Orbit
        </span>
        <h1 className="font-serif-romantic text-4xl sm:text-5xl font-bold text-stone-900 mt-2 text-balance">
          Map of Our Friendship
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          Click any star in our night sky to view the milestone it represents in our story.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Star Map (7 cols) */}
        <div className="lg:col-span-7">
          <div className="relative w-full aspect-[16/11] rounded-2xl bg-[#0c121e] p-6 shadow-xl border border-stone-800 overflow-hidden select-none">
            {/* Subtle soft dark nebula */}
            <div className="absolute top-1/3 left-1/3 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 h-56 w-56 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

            {/* Twinkles */}
            {Array.from({ length: 45 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white opacity-40"
                style={{
                  top: `${(i * 19) % 94}%`,
                  left: `${(i * 27) % 96}%`,
                  width: `${(i % 2) + 1.5}px`,
                  height: `${(i % 2) + 1.5}px`,
                }}
              />
            ))}

            {/* Connecting Starlight Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {stars.map((star, idx) => {
                const next = stars[idx + 1] || (stars.length > 2 ? stars[0] : null);
                if (!next) return null;
                return (
                  <line
                    key={`line-${star.id}-${next.id}`}
                    x1={`${star.xPercent}%`}
                    y1={`${star.yPercent}%`}
                    x2={`${next.xPercent}%`}
                    y2={`${next.yPercent}%`}
                    stroke="rgba(245, 158, 11, 0.3)"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                );
              })}
            </svg>

            {/* Interactive Stars */}
            {stars.map((star, idx) => {
              const isSelected = activeStar?.id === star.id;
              return (
                <div
                  key={star.id}
                  style={{ top: `${star.yPercent}%`, left: `${star.xPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    onClick={() => handleSelectStar(star.id)}
                    className="group relative flex items-center justify-center cursor-pointer"
                  >
                    <div
                      className={`flex items-center justify-center rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'h-9 w-9 bg-white/20 shadow-[0_0_15px_#f59e0b]'
                          : 'h-7 w-7 hover:bg-white/10'
                      }`}
                    >
                      <Star
                        className={`transition-transform duration-300 ${
                          isSelected
                            ? 'h-4 w-4 fill-amber-300 text-amber-200 scale-110'
                            : 'h-3.5 w-3.5 fill-amber-100/70 text-amber-50 group-hover:scale-105'
                        }`}
                      />
                    </div>

                    <span
                      className={`absolute top-full mt-1 whitespace-nowrap text-[9px] font-medium tracking-wide uppercase transition-colors px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-amber-950/80 text-amber-200 border border-amber-600/40'
                          : 'bg-black/50 text-stone-300 opacity-70 group-hover:opacity-100'
                      }`}
                    >
                      {idx + 1}. {star.title}
                    </span>
                  </button>
                </div>
              );
            })}

            <div className="absolute bottom-3 left-4 z-10 flex items-center gap-1.5 text-stone-400 text-[11px]">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Dedicated to Sweetie Pie</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
            <span>{stars.length} milestones charted</span>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 rounded-lg border border-stone-200 cursor-pointer"
            >
              <Plus className="h-3 w-3" />
              <span>Chart Another Memory</span>
            </button>
          </div>
        </div>

        {/* Right: Active Memory Polaroid Card (5 cols) */}
        <div className="lg:col-span-5">
          {activeStar && (
            <div className="rounded-2xl bg-white p-6 shadow-md border border-stone-200 transition-all">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                  Milestone #{stars.findIndex((s) => s.id === activeStar.id) + 1}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-stone-500">
                    <Calendar className="h-3.5 w-3.5 text-stone-400" />
                    <span>{activeStar.dateStr}</span>
                  </div>
                  {onDeleteStar && (
                    <button
                      onClick={() => {
                        onDeleteStar(activeStar.id);
                        const remaining = stars.filter((s) => s.id !== activeStar.id);
                        if (remaining.length > 0) {
                          setActiveStarId(remaining[0].id);
                        }
                        sound.playPaperSound();
                      }}
                      title="Remove this milestone"
                      className="text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Memory Picture (Only rendered when uploaded) */}
              {activeStar.photoUrl ? (
                <div className="mt-4 relative w-full aspect-[16/9] rounded-xl bg-stone-100 overflow-hidden border border-stone-200">
                  <img
                    src={activeStar.photoUrl}
                    alt={activeStar.title}
                    className="w-full h-full object-cover"
                  />
                  {onUpdateStarPhoto && (
                    <label className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/95 px-2 py-1 rounded-md text-[10px] font-medium text-stone-700 hover:text-stone-900 border border-stone-200 shadow-2xs cursor-pointer">
                      <Camera className="h-3 w-3 text-amber-700" />
                      <span>Change</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleStarPhotoUpload(e, activeStar.id)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              ) : onUpdateStarPhoto ? (
                <div className="mt-3 flex justify-end">
                  <label className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 hover:text-amber-800 cursor-pointer">
                    <Camera className="h-3 w-3" />
                    <span>Attach photo to this milestone</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleStarPhotoUpload(e, activeStar.id)}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : null}

              {/* Title & Location */}
              <div className="mt-4">
                <h3 className="font-serif-romantic text-2xl font-bold text-stone-900 leading-tight">
                  {activeStar.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-stone-500">
                  <MapPin className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                  <span>{activeStar.location}</span>
                </div>
              </div>

              {/* Story */}
              <div className="mt-4 rounded-xl bg-[#faf8f5] p-4 border border-stone-200/60">
                <p className="font-serif-romantic text-base sm:text-lg text-stone-800 leading-relaxed italic">
                  “{activeStar.story}”
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                <span className="flex items-center gap-1 text-rose-700 font-medium">
                  <Heart className="h-3 w-3 fill-rose-600 text-rose-600" /> Best friend memory
                </span>
                <span className="font-handwriting text-sm text-stone-600">
                  I will always remember this.
                </span>
              </div>
            </div>
          )}

          {/* Next Chapter Banner */}
          <div className="mt-6 rounded-2xl bg-stone-50 p-5 border border-stone-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Next Chapter
            </span>
            <h4 className="font-serif-romantic text-xl font-bold text-stone-900 mt-0.5">
              Open When... Letters
            </h4>
            <p className="text-xs text-stone-600 mt-1">
              Letters for when you had an exhausting day, doubt yourself, or wonder what I think of you.
            </p>
            <button
              onClick={onNextChapter}
              className="mt-3.5 w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <span>Go to Chapter 5: Care Letters</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Star Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-2xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif-romantic text-2xl font-bold text-stone-900">
                Chart a Memory
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-1.5 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Memory Title:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. The rainy ride home"
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    When:
                  </label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. October"
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Where:
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. In the car"
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  What Happened:
                </label>
                <textarea
                  rows={3}
                  required
                  value={newStory}
                  onChange={(e) => setNewStory(e.target.value)}
                  placeholder="Describe why this memory is so special to you..."
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
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
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
