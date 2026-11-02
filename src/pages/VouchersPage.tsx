import React, { useState } from 'react';
import { LoveVoucher, Personalization } from '../types';
import { sound } from '../utils/sound';
import { Heart, ArrowRight, Ticket, Plus, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VouchersPageProps {
  personalization: Personalization;
  vouchers: LoveVoucher[];
  onRedeemVoucher: (id: string) => void;
  onAddVoucher: (voucher: LoveVoucher) => void;
  onNextChapter: () => void;
  onMarkCompleted: () => void;
}

export const VouchersPage: React.FC<VouchersPageProps> = ({
  personalization,
  vouchers,
  onRedeemVoucher,
  onAddVoucher,
  onNextChapter,
  onMarkCompleted,
}) => {
  const [filter, setFilter] = useState<'all' | 'available' | 'redeemed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleRedeem = (id: string) => {
    sound.playCelebration();
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#b45309', '#f59e0b', '#f43f5e'],
    });
    onRedeemVoucher(id);
    onMarkCompleted();
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newV: LoveVoucher = {
      id: `v-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'A special favor waiting for you anytime.',
      category: 'sweet',
      isRedeemed: false,
    };

    onAddVoucher(newV);
    sound.playCelebration();
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const filteredVouchers = vouchers.filter((v) => {
    if (filter === 'available') return !v.isRedeemed;
    if (filter === 'redeemed') return v.isRedeemed;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl py-10 px-4 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Chapter 06 · Good For One Favor
        </span>
        <h1 className="font-serif-romantic text-4xl sm:text-5xl font-bold text-stone-900 mt-2 text-balance">
          Friendship & Beyond Vouchers
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          Coupons for real life. Cash any of these in whenever you want, Sweetie Pie—no expiration date, ever.
        </p>
      </div>

      {/* Top Filter and Add */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All ({vouchers.length})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'available' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Available ({vouchers.filter((v) => !v.isRedeemed).length})
          </button>
          <button
            onClick={() => setFilter('redeemed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'redeemed' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Redeemed ({vouchers.filter((v) => v.isRedeemed).length})
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 rounded-lg border border-stone-200 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Custom Coupon</span>
        </button>
      </div>

      {/* Grid of vouchers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVouchers.map((voucher) => (
          <div
            key={voucher.id}
            className={`relative rounded-2xl bg-white p-6 shadow-sm border transition-all duration-200 flex flex-col justify-between ${
              voucher.isRedeemed
                ? 'border-stone-200 bg-stone-50/70 text-stone-400'
                : 'border-stone-200 hover:border-amber-300 hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-dashed border-stone-200">
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-amber-900 uppercase">
                  <Ticket className="h-3.5 w-3.5" />
                  <span>Sweetie Pie's Pass</span>
                </div>
                <span>Valid Anytime</span>
              </div>

              <h4 className="font-serif-romantic text-2xl font-bold text-stone-900 mt-3 leading-snug">
                {voucher.title}
              </h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {voucher.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              {voucher.isRedeemed ? (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200">
                    ✓ Redeemed
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {voucher.redeemedAt || 'Used'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] text-stone-500 font-medium">
                    Redeemable by Sweetie Pie
                  </span>
                  <button
                    onClick={() => handleRedeem(voucher.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-2xs transition-all cursor-pointer active:scale-95"
                  >
                    <span>Cash In Coupon</span>
                    <Heart className="h-3 w-3 fill-rose-300 text-rose-300" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-2xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif-romantic text-2xl font-bold text-stone-900">
                Create a Voucher
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
                  Voucher Title:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 1x Late Night Boba Run"
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Terms:
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What she gets to enjoy..."
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
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Next Chapter Banner */}
      <div className="mt-12 rounded-2xl bg-amber-50/60 p-6 sm:p-8 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-800 font-semibold">
            Next Chapter
          </span>
          <h4 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Things I Want to Do With You
          </h4>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            A quiet bucket list of simple adventures and memories I hope we get to share together.
          </p>
        </div>
        <button
          onClick={onNextChapter}
          className="flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-md transition-all cursor-pointer shrink-0 active:scale-95"
        >
          <span>Go to Chapter 7: Bucket List</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
