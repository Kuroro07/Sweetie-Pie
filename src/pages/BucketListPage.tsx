import React, { useState } from 'react';
import { BucketListItem, Personalization } from '../types';
import { sound } from '../utils/sound';
import { Check, Plus, ArrowRight, X, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BucketListPageProps {
  personalization: Personalization;
  items: BucketListItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (item: BucketListItem) => void;
  onNextChapter: () => void;
  onMarkCompleted: () => void;
}

export const BucketListPage: React.FC<BucketListPageProps> = ({
  personalization,
  items,
  onToggleItem,
  onAddItem,
  onNextChapter,
  onMarkCompleted,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<BucketListItem['category']>('cozy');

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / (items.length || 1)) * 100);

  const handleToggle = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item?.completed) {
      sound.playCelebration();
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#b45309', '#f59e0b', '#f43f5e'],
      });
    } else {
      sound.playPaperSound();
    }
    onToggleItem(id);
    onMarkCompleted();
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: BucketListItem = {
      id: `b-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      completed: false,
    };

    onAddItem(newItem);
    sound.playCelebration();
    setNewTitle('');
    setShowAddModal(false);
  };

  const categories = [
    { id: 'all', label: 'All Adventures' },
    { id: 'cozy', label: 'Cozy Things' },
    { id: 'travel', label: 'Road Trips' },
    { id: 'dream', label: 'Secret Wishes' },
  ];

  const filteredItems = items.filter((item) =>
    filter === 'all' ? true : item.category === filter
  );

  return (
    <div className="mx-auto max-w-6xl py-10 px-4 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Chapter 07 · Things Waiting for Us
        </span>
        <h1 className="font-serif-romantic text-4xl sm:text-5xl font-bold text-stone-900 mt-2 text-balance">
          Things I Want to Do With You
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          From quiet rainy Sundays to the adventures we always talk about over late night calls.
        </p>
      </div>

      {/* Progress Card */}
      <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-stone-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-amber-800" />
              <h3 className="font-serif-romantic text-xl font-bold text-stone-900">
                Memories Made: {completedCount} of {items.length}
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {progressPercent}% shared · So many more ahead of us.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add an Idea</span>
          </button>
        </div>

        <div className="mt-3.5 h-2 w-full rounded-full bg-stone-100 overflow-hidden">
          <div
            className="h-full bg-amber-700 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              sound.playPluck(1);
              setFilter(cat.id);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
              filter === cat.id
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* List items */}
      <div className="space-y-2.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleToggle(item.id)}
            className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
              item.completed
                ? 'bg-stone-50/70 border-stone-200 text-stone-400'
                : 'bg-white border-stone-200 hover:border-amber-300 text-stone-800 hover:shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                  item.completed
                    ? 'bg-stone-900 border-stone-900 text-white'
                    : 'border-stone-300 bg-white group-hover:border-stone-500'
                }`}
              >
                {item.completed && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
              </div>

              <div className="min-w-0">
                <span
                  className={`text-sm font-medium block truncate ${
                    item.completed ? 'line-through text-stone-400' : 'text-stone-900'
                  }`}
                >
                  {item.title}
                </span>
                {item.notes && (
                  <span className="text-[11px] text-amber-800 font-handwriting block">
                    {item.notes}
                  </span>
                )}
              </div>
            </div>

            <span className="text-[10px] uppercase font-semibold text-stone-400 shrink-0 ml-3">
              {item.completed ? 'Done' : 'Wish'}
            </span>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-2xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif-romantic text-2xl font-bold text-stone-900">
                Add Something We Should Do
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
                  Category:
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as BucketListItem['category'])}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-500"
                >
                  <option value="cozy">Cozy Things</option>
                  <option value="travel">Road Trips & Places</option>
                  <option value="dream">Secret Wishes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Our Idea:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Try that new ramen place downtown..."
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
                  Save Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chapter 8 (Final Note) Next Banner */}
      <div className="mt-12 rounded-2xl bg-amber-50/70 p-6 sm:p-8 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-900 font-semibold">
            Chapter 08 · The Final Note
          </span>
          <h4 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            A Promise to My Best Friend
          </h4>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            A quiet, honest letter about why having you in my life, Sweetie Pie, means the world to me.
          </p>
        </div>
        <button
          onClick={onNextChapter}
          className="flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-md transition-all cursor-pointer shrink-0 active:scale-95"
        >
          <span>The Final Note</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
