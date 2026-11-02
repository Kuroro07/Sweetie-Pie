import React, { useState, useEffect } from 'react';
import {
  PageId,
  Personalization,
  PhotoMemory,
  LoveReason,
  LoveVoucher,
  BucketListItem,
  MemoryStar,
} from './types';
import {
  PAGES,
  DEFAULT_PERSONALIZATION,
  DEFAULT_REASONS,
  DEFAULT_LETTERS,
  DEFAULT_VOUCHERS,
  DEFAULT_BUCKET_LIST,
  DEFAULT_STARS,
} from './data/initialData';
import { sound } from './utils/sound';
import { AnimatePresence, motion } from 'motion/react';
import { FloatingCanvas } from './components/FloatingCanvas';
import { FallingPetals } from './components/FallingPetals';
import { Navbar } from './components/Navbar';
import { BottomJourneyBar } from './components/BottomJourneyBar';
import { ChapterDrawer } from './components/ChapterDrawer';
import { PersonalizationModal } from './components/PersonalizationModal';

// Pages
import { EnvelopePage } from './pages/EnvelopePage';
import { PhotosPage } from './pages/PhotosPage';
import { ReasonsPage } from './pages/ReasonsPage';
import { ConstellationPage } from './pages/ConstellationPage';
import { OpenWhenPage } from './pages/OpenWhenPage';
import { VouchersPage } from './pages/VouchersPage';
import { BucketListPage } from './pages/BucketListPage';
import { FinalNotePage } from './pages/FinalNotePage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('envelope');
  const [completedPages, setCompletedPages] = useState<Set<PageId>>(new Set(['envelope']));
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  // Persistent user state
  const [personalization, setPersonalization] = useState<Personalization>(() => {
    try {
      const saved = localStorage.getItem('sweetiepie_personalization_v3');
      return saved ? JSON.parse(saved) : DEFAULT_PERSONALIZATION;
    } catch {
      return DEFAULT_PERSONALIZATION;
    }
  });

  const [photos, setPhotos] = useState<PhotoMemory[]>(() => {
    try {
      const saved = localStorage.getItem('sweetiepie_photos_v3');
      return saved ? JSON.parse(saved) : DEFAULT_PERSONALIZATION.photos;
    } catch {
      return DEFAULT_PERSONALIZATION.photos;
    }
  });

  const [reasons, setReasons] = useState<LoveReason[]>(() => {
    try {
      const saved = localStorage.getItem('sweetiepie_reasons_v3');
      return saved ? JSON.parse(saved) : DEFAULT_REASONS;
    } catch {
      return DEFAULT_REASONS;
    }
  });

  const [vouchers, setVouchers] = useState<LoveVoucher[]>(() => {
    try {
      const saved = localStorage.getItem('sweetiepie_vouchers_v3');
      return saved ? JSON.parse(saved) : DEFAULT_VOUCHERS;
    } catch {
      return DEFAULT_VOUCHERS;
    }
  });

  const [bucketList, setBucketList] = useState<BucketListItem[]>(() => {
    try {
      const saved = localStorage.getItem('sweetiepie_bucketlist_v3');
      return saved ? JSON.parse(saved) : DEFAULT_BUCKET_LIST;
    } catch {
      return DEFAULT_BUCKET_LIST;
    }
  });

  const [stars, setStars] = useState<MemoryStar[]>(() => {
    try {
      const saved = localStorage.getItem('sweetiepie_stars_v3');
      const loaded: MemoryStar[] = saved ? JSON.parse(saved) : DEFAULT_STARS;
      return loaded.filter((s) => s.id !== 's4' && !s.title.toLowerCase().includes('road trip'));
    } catch {
      return DEFAULT_STARS;
    }
  });

  // LocalStorage sync
  useEffect(() => {
    try {
      localStorage.setItem('sweetiepie_personalization_v3', JSON.stringify(personalization));
    } catch {}
  }, [personalization]);

  useEffect(() => {
    try {
      localStorage.setItem('sweetiepie_photos_v3', JSON.stringify(photos));
    } catch {}
  }, [photos]);

  useEffect(() => {
    try {
      localStorage.setItem('sweetiepie_reasons_v3', JSON.stringify(reasons));
    } catch {}
  }, [reasons]);

  useEffect(() => {
    try {
      localStorage.setItem('sweetiepie_vouchers_v3', JSON.stringify(vouchers));
    } catch {}
  }, [vouchers]);

  useEffect(() => {
    try {
      localStorage.setItem('sweetiepie_bucketlist_v3', JSON.stringify(bucketList));
    } catch {}
  }, [bucketList]);

  useEffect(() => {
    try {
      localStorage.setItem('sweetiepie_stars_v3', JSON.stringify(stars));
    } catch {}
  }, [stars]);

  const markPageCompleted = (pageId: PageId) => {
    setCompletedPages((prev) => {
      const next = new Set(prev);
      next.add(pageId);
      return next;
    });
  };

  const handleNextChapter = () => {
    const currentIndex = PAGES.findIndex((p) => p.id === currentPage);
    const nextChapter = PAGES[currentIndex + 1];
    if (nextChapter) {
      setCurrentPage(nextChapter.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleAmbientMusic = () => {
    const playing = sound.toggleAmbient();
    setIsAmbientPlaying(playing);
  };

  const handleUpdateHeroPhoto = (dataUrl: string) => {
    setPersonalization((prev) => ({ ...prev, heroPhoto: dataUrl }));
  };

  const handleUpdateStarPhoto = (starId: string, photoUrl: string) => {
    setStars((prev) =>
      prev.map((s) => (s.id === starId ? { ...s, photoUrl } : s))
    );
  };

  const handleToggleFavoriteReason = (id: string) => {
    setReasons((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  const handleAddReason = (newReason: LoveReason) => {
    setReasons((prev) => [newReason, ...prev]);
  };

  const handleRedeemVoucher = (id: string) => {
    setVouchers((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              isRedeemed: true,
              redeemedAt: new Date().toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
            }
          : v
      )
    );
  };

  const handleAddVoucher = (newV: LoveVoucher) => {
    setVouchers((prev) => [newV, ...prev]);
  };

  const handleToggleBucketItem = (id: string) => {
    setBucketList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddBucketItem = (newItem: BucketListItem) => {
    setBucketList((prev) => [newItem, ...prev]);
  };

  const handleAddStar = (newStar: MemoryStar) => {
    setStars((prev) => [...prev, newStar]);
  };

  const handleDeleteStar = (starId: string) => {
    setStars((prev) => prev.filter((s) => s.id !== starId));
  };

  const handleResetPersonalization = () => {
    setPersonalization(DEFAULT_PERSONALIZATION);
    setPhotos(DEFAULT_PERSONALIZATION.photos);
    setReasons(DEFAULT_REASONS);
    setVouchers(DEFAULT_VOUCHERS);
    setBucketList(DEFAULT_BUCKET_LIST);
    setStars(DEFAULT_STARS);
    try {
      localStorage.clear();
    } catch {}
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#faf8f5] text-stone-800 selection:bg-amber-100 selection:text-amber-950">
      {/* Calm, Non-Flashy Ambient Dust Motes & Subtle Romantic Falling Petals */}
      <FloatingCanvas intensity="calm" />
      <FallingPetals />

      {/* Top Bar Navigation */}
      <Navbar
        currentPage={currentPage}
        onSelectPage={(id) => {
          setCurrentPage(id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPersonalize={() => setIsPersonalizeOpen(true)}
        onOpenChapterDrawer={() => setIsChapterDrawerOpen(true)}
        isAmbientPlaying={isAmbientPlaying}
        onToggleAmbient={toggleAmbientMusic}
      />

      {/* Main Content View with Framer Motion Entrance Animation */}
      <main className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {currentPage === 'envelope' && (
              <EnvelopePage
                personalization={personalization}
                onUpdateHeroPhoto={handleUpdateHeroPhoto}
                onNextChapter={handleNextChapter}
                onMarkCompleted={() => markPageCompleted('envelope')}
              />
            )}

            {currentPage === 'photos' && (
              <PhotosPage
                personalization={personalization}
                photos={photos}
                onUpdatePhotos={setPhotos}
                onNextChapter={handleNextChapter}
                onMarkCompleted={() => markPageCompleted('photos')}
              />
            )}

            {currentPage === 'reasons' && (
              <ReasonsPage
                personalization={personalization}
                reasons={reasons}
                onToggleFavorite={handleToggleFavoriteReason}
                onAddReason={handleAddReason}
                onNextChapter={handleNextChapter}
                onMarkCompleted={() => markPageCompleted('reasons')}
              />
            )}

            {currentPage === 'constellation' && (
              <ConstellationPage
                personalization={personalization}
                stars={stars}
                onAddStar={handleAddStar}
                onDeleteStar={handleDeleteStar}
                onUpdateStarPhoto={handleUpdateStarPhoto}
                onNextChapter={handleNextChapter}
                onMarkCompleted={() => markPageCompleted('constellation')}
              />
            )}

            {currentPage === 'open-when' && (
              <OpenWhenPage
                personalization={personalization}
                letters={DEFAULT_LETTERS}
                onNextChapter={handleNextChapter}
                onMarkCompleted={() => markPageCompleted('open-when')}
              />
            )}

            {currentPage === 'vouchers' && (
              <VouchersPage
                personalization={personalization}
                vouchers={vouchers}
                onRedeemVoucher={handleRedeemVoucher}
                onAddVoucher={handleAddVoucher}
                onNextChapter={handleNextChapter}
                onMarkCompleted={() => markPageCompleted('vouchers')}
              />
            )}

            {currentPage === 'bucket-list' && (
              <BucketListPage
                personalization={personalization}
                items={bucketList}
                onToggleItem={handleToggleBucketItem}
                onAddItem={handleAddBucketItem}
                onNextChapter={handleNextChapter}
                onMarkCompleted={() => markPageCompleted('bucket-list')}
              />
            )}

            {currentPage === 'final-note' && (
              <FinalNotePage
                personalization={personalization}
                onUpdateHeroPhoto={handleUpdateHeroPhoto}
                onRestartJourney={() => {
                  setCurrentPage('envelope');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onMarkCompleted={() => markPageCompleted('final-note')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Sticky Journey Progress Bar */}
      <BottomJourneyBar
        currentPage={currentPage}
        onSelectPage={(id) => {
          setCurrentPage(id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenChapterDrawer={() => setIsChapterDrawerOpen(true)}
        personalization={personalization}
      />

      {/* Chapter Drawer */}
      <ChapterDrawer
        isOpen={isChapterDrawerOpen}
        onClose={() => setIsChapterDrawerOpen(false)}
        currentPage={currentPage}
        onSelectPage={(id) => {
          setCurrentPage(id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        completedPages={completedPages}
      />

      {/* Personalization Modal */}
      <PersonalizationModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
        personalization={personalization}
        onSave={(updated) => setPersonalization(updated)}
        onReset={handleResetPersonalization}
      />
    </div>
  );
}
