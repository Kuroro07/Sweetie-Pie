import React, { useState } from 'react';
import { PhotoMemory, Personalization } from '../types';
import { sound } from '../utils/sound';
import { Camera, Heart, Plus, X, ArrowRight, Upload, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PhotosPageProps {
  personalization: Personalization;
  photos: PhotoMemory[];
  onUpdatePhotos: (updated: PhotoMemory[]) => void;
  onNextChapter: () => void;
  onMarkCompleted: () => void;
}

export const PhotosPage: React.FC<PhotosPageProps> = ({
  personalization,
  photos,
  onUpdatePhotos,
  onNextChapter,
  onMarkCompleted,
}) => {
  // Only display photos where a real image has been uploaded
  const uploadedPhotos = photos.filter((p) => Boolean(p.imageUrl));

  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMemory | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);

  // Handle direct file upload onto an existing card
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, photoId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const updated = photos.map((p) => (p.id === photoId ? { ...p, imageUrl: result } : p));
      onUpdatePhotos(updated);
      sound.playCelebration();
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#fbbf24', '#fbcfe8'],
      });
      onMarkCompleted();
    };
    reader.readAsDataURL(file);
  };

  // Handle multi-file bulk or single upload
  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    let completedCount = 0;
    const newItems: PhotoMemory[] = [];

    fileList.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const cleanTitle = rawName.charAt(0).toUpperCase() + rawName.slice(1);

        newItems.push({
          id: `photo-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
          title: cleanTitle || 'Sweet Memory',
          caption: 'One of my favorite pictures of you.',
          imageUrl: reader.result as string,
          date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
          rotation: (Math.random() - 0.5) * 4,
        });

        completedCount++;
        if (completedCount === fileList.length) {
          onUpdatePhotos([...newItems, ...photos]);
          sound.playCelebration();
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#fda4af', '#f43f5e', '#fef08a'],
          });
          onMarkCompleted();
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so same files can be re-selected if needed
    e.target.value = '';
  };

  const handleDeletePhoto = (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = photos.filter((p) => p.id !== photoId);
    onUpdatePhotos(updated);
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null);
    }
    sound.playPaperSound();
  };

  const handleModalImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage) return;

    const newPhoto: PhotoMemory = {
      id: `photo-${Date.now()}`,
      title: newTitle.trim() || 'Sweetie Pie',
      caption: newCaption.trim() || 'One of my favorite pictures of you.',
      imageUrl: newImage,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      rotation: (Math.random() - 0.5) * 4,
    };

    onUpdatePhotos([newPhoto, ...photos]);
    sound.playCelebration();
    confetti({ particleCount: 40, spread: 60 });
    setNewTitle('');
    setNewCaption('');
    setNewImage(null);
    setShowAddModal(false);
    onMarkCompleted();
  };

  return (
    <div className="mx-auto max-w-6xl py-10 px-4 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-rose-700 font-semibold">
          Chapter 02 · Memories in Film
        </span>
        <h1 className="font-serif-romantic text-4xl sm:text-5xl font-bold text-stone-900 mt-2 text-balance">
          Pictures of My Sweetie Pie
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          A quiet polaroid album dedicated to your smile, your laugh, and all our favorite candid moments together.
        </p>
      </div>

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white/70 p-4 rounded-2xl border border-stone-200/70 backdrop-blur-xs">
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <Camera className="h-4 w-4 text-rose-600 shrink-0" />
          <span>
            {uploadedPhotos.length > 0
              ? `${uploadedPhotos.length} memory polaroid${uploadedPhotos.length === 1 ? '' : 's'} in her album. Click any to enlarge.`
              : 'Upload her pictures below to build her personalized polaroid album.'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95">
            <Upload className="h-3.5 w-3.5 text-rose-600" />
            <span>Upload Her Pictures</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleBulkUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add With Note</span>
          </button>
        </div>
      </div>

      {/* Scrapbook Container */}
      {uploadedPhotos.length === 0 ? (
        /* Empty State: Warm, elegant invitation with no dummy samples */
        <div className="relative rounded-3xl border-2 border-dashed border-stone-300 bg-white/50 p-12 text-center max-w-xl mx-auto shadow-xs backdrop-blur-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4 border border-rose-100">
            <Camera className="h-8 w-8 stroke-[1.5]" />
          </div>
          <h3 className="font-serif-romantic text-2xl font-bold text-stone-800">
            No Pictures Uploaded Yet
          </h3>
          <p className="mt-2 text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
            This space is reserved exclusively for real photos of Sweetie Pie. Upload your favorite candid shots, adventures, or laughing moments to make this album truly hers.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <label className="flex items-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95">
              <Upload className="h-4 w-4" />
              <span>Choose Photos of Her</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleBulkUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-3 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl transition-all cursor-pointer active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add Single Photo with Caption</span>
            </button>
          </div>
          <span className="block mt-4 text-[11px] text-stone-400">
            Tip: You can select multiple photos at once. They stay saved on your device.
          </span>
        </div>
      ) : (
        /* Polaroid Scrapbook Grid: Displays ONLY real uploaded pictures */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {uploadedPhotos.map((photo) => (
            <div
              key={photo.id}
              style={{ transform: `rotate(${photo.rotation || 0}deg)` }}
              className="group relative bg-[#ffffff] p-4 pb-6 rounded-xs shadow-md border border-stone-200/90 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:z-20"
            >
              {/* Vintage Washi Tape Top Center */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-amber-100/70 rotate-[-1deg] border border-amber-200/40 shadow-2xs backdrop-blur-2xs pointer-events-none" />

              {/* Photo Frame Container */}
              <div
                onClick={() => {
                  sound.playPaperSound();
                  setSelectedPhoto(photo);
                  onMarkCompleted();
                }}
                className="relative w-full aspect-square bg-[#f5f2eb] rounded-2xs overflow-hidden border border-stone-200/60 cursor-pointer flex flex-col items-center justify-center"
              >
                {photo.imageUrl && (
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/* Hover Action Controls on Card */}
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <label
                    onClick={(e) => e.stopPropagation()}
                    title="Change picture"
                    className="flex items-center gap-1 bg-white/95 text-stone-800 hover:text-rose-700 px-2 py-1 rounded-md shadow-sm border border-stone-200/80 text-[10px] font-medium cursor-pointer transition-colors backdrop-blur-xs"
                  >
                    <Camera className="h-3 w-3 text-rose-600" />
                    <span>Change</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, photo.id)}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={(e) => handleDeletePhoto(photo.id, e)}
                    title="Remove picture"
                    className="flex items-center justify-center bg-white/95 text-stone-600 hover:text-rose-600 p-1 rounded-md shadow-sm border border-stone-200/80 cursor-pointer transition-colors backdrop-blur-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Handwritten Polaroid Caption Area */}
              <div className="mt-4 px-1">
                <h4 className="font-serif-romantic text-lg font-bold text-stone-900 leading-snug">
                  {photo.title}
                </h4>
                <p className="font-handwriting text-base text-stone-600 mt-1 leading-snug line-clamp-2">
                  “{photo.caption}”
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-100 pt-2 font-mono">
                  <span>{photo.date || 'Our Memory'}</span>
                  <Heart className="h-3.5 w-3.5 fill-rose-100 text-rose-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-stone-200"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 rounded-full p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Picture view */}
            <div className="w-full aspect-square rounded-xl bg-stone-100 overflow-hidden border border-stone-200 flex items-center justify-center">
              {selectedPhoto.imageUrl && (
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Caption & Controls */}
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif-romantic text-2xl font-bold text-stone-900">
                  {selectedPhoto.title}
                </h3>
                <p className="font-handwriting text-xl text-stone-700 mt-2 leading-relaxed">
                  “{selectedPhoto.caption}”
                </p>
                <span className="text-xs text-rose-600 font-medium block mt-3">
                  Dedicated to Sweetie Pie
                </span>
              </div>

              <button
                onClick={() => handleDeletePhoto(selectedPhoto.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-stone-500 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 rounded-lg transition-colors cursor-pointer shrink-0 mt-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Photo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif-romantic text-2xl font-bold text-stone-900">
                Add a Picture of Sweetie Pie
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-1.5 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Upload Photo (Required):
                </label>
                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={handleModalImageSelect}
                  className="w-full text-xs text-stone-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
                />
                {newImage && (
                  <div className="mt-2 h-24 w-24 rounded-lg overflow-hidden border border-stone-200">
                    <img src={newImage} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Photo Title:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Laughing at the café"
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Handwritten Caption:
                </label>
                <textarea
                  rows={2}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="What made this moment with her special..."
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-rose-500"
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
                  disabled={!newImage}
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm cursor-pointer"
                >
                  Save to Scrapbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chapter 3 Next Banner */}
      <div className="mt-14 rounded-2xl bg-amber-50/60 p-6 sm:p-8 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-800 font-semibold">
            Next Chapter
          </span>
          <h4 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Little Things I Notice About You
          </h4>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            The folded paper stars and little daily habits that you probably didn't know I notice.
          </p>
        </div>
        <button
          onClick={onNextChapter}
          className="flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-md transition-all cursor-pointer shrink-0 active:scale-95"
        >
          <span>Go to Chapter 3: Observations Jar</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
