import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame, Sparkles } from 'lucide-react';
import { TASTE_VIBES } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { TasteVibeId } from '../types';

export const TasteVibesCarousel: React.FC = () => {
  const { filters, setSelectedVibe } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full py-6">
      {/* Background radial ambient illumination */}
      <div className="absolute inset-0 bg-radial-ambient pointer-events-none -z-10 opacity-70"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              <span>Curated Atmospheres</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Taste Vibes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Select your dining mood to curate the feed instantly
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleScroll('left')}
              className="p-2 rounded-full glass-pill hover:bg-white/10 text-slate-300 hover:text-white transition"
              aria-label="Previous vibe"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2 rounded-full glass-pill hover:bg-white/10 text-slate-300 hover:text-white transition"
              aria-label="Next vibe"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Track */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TASTE_VIBES.map((vibe) => {
            const isSelected = filters.selectedVibe === vibe.id;

            return (
              <motion.button
                key={vibe.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedVibe(vibe.id as TasteVibeId)}
                className={`relative flex-shrink-0 w-72 sm:w-80 h-44 rounded-2xl overflow-hidden snap-start text-left group border transition-all duration-300 focus:outline-none ${
                  isSelected
                    ? 'border-emerald-400 ring-2 ring-emerald-500/40 shadow-sage-glow'
                    : 'border-white/10 hover:border-white/25 shadow-glass'
                }`}
              >
                {/* Full-bleed photography */}
                <img
                  src={vibe.image}
                  alt={vibe.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.65] group-hover:brightness-[0.75]"
                />

                {/* Dark gradient overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/60 to-transparent"></div>

                {/* Ambient glow matching accent */}
                <div
                  className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-40 transition-opacity group-hover:opacity-60"
                  style={{ backgroundColor: vibe.accentColor }}
                ></div>

                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase backdrop-blur-md border border-white/20 text-white"
                    style={{ backgroundColor: `${vibe.accentColor}33` }}
                  >
                    {vibe.tag}
                  </span>

                  {isSelected && (
                    <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500 text-obsidian-950 text-[10px] font-black shadow-sm">
                      <Sparkles className="w-3 h-3" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5">
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {vibe.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5 leading-snug">
                    {vibe.subtitle}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

