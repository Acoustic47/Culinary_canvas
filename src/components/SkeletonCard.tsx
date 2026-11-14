import React from 'react';

export const RestaurantSkeletonCard: React.FC = () => {
  return (
    <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-glass flex flex-col justify-between shimmer-card">
      {/* Media placeholder */}
      <div className="h-56 w-full bg-obsidian-850 relative">
        <div className="absolute top-3.5 left-3.5 w-32 h-6 rounded-full bg-white/5"></div>
        <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/5"></div>
        <div className="absolute bottom-3 left-3.5 right-3.5 flex justify-between">
          <div className="w-24 h-6 rounded-xl bg-white/5"></div>
          <div className="w-20 h-6 rounded-xl bg-white/5"></div>
        </div>
      </div>

      {/* Body placeholder */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="w-3/4 h-6 rounded-lg bg-white/10"></div>
          <div className="w-1/2 h-4 rounded-lg bg-white/5"></div>
          <div className="w-full h-10 rounded-lg bg-white/5 mt-2"></div>
          <div className="flex gap-1.5 mt-3">
            <div className="w-14 h-5 rounded-md bg-white/5"></div>
            <div className="w-16 h-5 rounded-md bg-white/5"></div>
            <div className="w-12 h-5 rounded-md bg-white/5"></div>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-between items-center">
          <div className="w-20 h-4 rounded bg-white/5"></div>
          <div className="w-24 h-7 rounded-xl bg-white/10"></div>
        </div>
      </div>
    </div>
  );
};

export const DishSkeletonCard: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-glass flex flex-col justify-between shimmer-card">
      <div className="h-48 w-full bg-obsidian-850 relative">
        <div className="absolute top-2.5 left-2.5 w-24 h-5 rounded-full bg-white/5"></div>
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between">
          <div className="w-16 h-5 rounded-lg bg-white/5"></div>
          <div className="w-16 h-5 rounded-lg bg-white/5"></div>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="w-3/5 h-5 rounded bg-white/10"></div>
            <div className="w-14 h-5 rounded bg-white/10"></div>
          </div>
          <div className="w-full h-8 rounded bg-white/5"></div>
        </div>
        <div className="pt-3 border-t border-white/10 flex justify-between items-center">
          <div className="w-12 h-6 rounded-xl bg-white/5"></div>
          <div className="w-24 h-6 rounded-full bg-white/10"></div>
        </div>
      </div>
    </div>
  );
};

