export type PageId =
  | 'envelope'
  | 'photos'
  | 'reasons'
  | 'constellation'
  | 'open-when'
  | 'vouchers'
  | 'bucket-list'
  | 'final-note';

export interface PageInfo {
  id: PageId;
  title: string;
  shortTitle: string;
  chapterNumber: number;
  subtitle: string;
}

export interface PhotoMemory {
  id: string;
  title: string;
  caption: string;
  imageUrl?: string; // base64 or URL
  date?: string;
  rotation?: number; // visual tilt for scrapbook feel
}

export interface Personalization {
  herName: string; // "Sweetie Pie"
  hisName: string;
  petName: string;
  friendshipDate: string; // YYYY-MM-DD
  envelopeMessage: string;
  secretScratchMessage: string;
  finalLetter: string;
  heroPhoto?: string;
  photos: PhotoMemory[];
}

export interface LoveReason {
  id: string;
  category: 'little-things' | 'best-friend' | 'memories' | 'favorite-habits' | 'moments';
  text: string;
  isFavorite?: boolean;
}

export interface OpenWhenLetter {
  id: string;
  title: string;
  subtitle: string;
  stamp: string;
  content: string[];
  actionPrompt?: string;
  actionType?: 'hug' | 'deep-breath';
  closing: string;
}

export interface LoveVoucher {
  id: string;
  title: string;
  description: string;
  category: 'cozy' | 'adventure' | 'friendship' | 'sweet';
  isRedeemed: boolean;
  redeemedAt?: string;
}

export interface BucketListItem {
  id: string;
  title: string;
  category: 'travel' | 'cozy' | 'adventure' | 'dream';
  completed: boolean;
  notes?: string;
}

export interface MemoryStar {
  id: string;
  title: string;
  dateStr: string;
  location: string;
  story: string;
  xPercent: number;
  yPercent: number;
  photoUrl?: string;
}
