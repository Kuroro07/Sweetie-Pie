import React, { useState } from 'react';
import { Personalization } from '../types';
import { sound } from '../utils/sound';
import { X, Check, RotateCcw, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  personalization: Personalization;
  onSave: (updated: Personalization) => void;
  onReset: () => void;
}

export const PersonalizationModal: React.FC<PersonalizationModalProps> = ({
  isOpen,
  onClose,
  personalization,
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = useState<Personalization>({ ...personalization });

  if (!isOpen) return null;

  const handleHeroPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, heroPhoto: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCelebration();
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#b45309', '#f59e0b', '#fbbf24'],
    });
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-2xs">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h2 className="font-serif-romantic text-2xl font-bold text-stone-900">
              Personalize for Sweetie Pie
            </h2>
            <p className="text-xs text-stone-500">
              Customize her nickname, add her picture, and tweak your words.
            </p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Featured Photo Slot */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-lg bg-stone-200 overflow-hidden shrink-0 flex items-center justify-center border border-stone-300">
              {formData.heroPhoto ? (
                <img src={formData.heroPhoto} alt="Her photo" className="h-full w-full object-cover" />
              ) : (
                <Camera className="h-6 w-6 text-stone-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-stone-800 block">
                Her Main Featured Picture
              </span>
              <span className="text-[11px] text-stone-500 block mb-1">
                Appears on the opening letter and in the final confession.
              </span>
              <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 cursor-pointer">
                <span>{formData.heroPhoto ? 'Replace Picture' : 'Upload Her Picture'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroPhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                What you call her:
              </label>
              <input
                type="text"
                required
                value={formData.herName}
                onChange={(e) => setFormData({ ...formData, herName: e.target.value })}
                placeholder="e.g. Sweetie Pie"
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Name / Sign-off:
              </label>
              <input
                type="text"
                required
                value={formData.hisName}
                onChange={(e) => setFormData({ ...formData, hisName: e.target.value })}
                placeholder="e.g. Your Best Friend"
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Date you became friends:
            </label>
            <input
              type="date"
              required
              value={formData.friendshipDate}
              onChange={(e) => setFormData({ ...formData, friendshipDate: e.target.value })}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Opening Letter Note:
            </label>
            <textarea
              rows={3}
              value={formData.envelopeMessage}
              onChange={(e) => setFormData({ ...formData, envelopeMessage: e.target.value })}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Final Note to Sweetie Pie:
            </label>
            <textarea
              rows={4}
              value={formData.finalLetter}
              onChange={(e) => setFormData({ ...formData, finalLetter: e.target.value })}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                sound.playPaperSound();
                onReset();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-500 hover:text-stone-800 rounded-lg cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-2xs transition-all cursor-pointer active:scale-95"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
