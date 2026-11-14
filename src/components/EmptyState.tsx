import React from 'react';
import { Sparkles, RotateCcw, UtensilsCrossed, Search } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface EmptyStateProps {
  title?: string;
  description?: string;
  type?: 'search' | 'filter' | 'generic';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Culinary Experiences Found',
  description = 'Try widening your delivery distance slider, relaxing dietary filters, or searching for a different dish.',
  type = 'filter',
}) => {
  const { resetFilters } = useAppStore();

  return (
    <div className="w-full glass-panel rounded-3xl p-10 sm:p-14 text-center border border-white/10 shadow-glass my-8">
      <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-5 shadow-sage-glow">
        {type === 'search' ? (
          <Search className="w-7 h-7 stroke-[1.75]" />
        ) : (
          <UtensilsCrossed className="w-7 h-7 stroke-[1.75]" />
        )}
      </div>

      <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={resetFilters}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold text-xs shadow-sage-glow transition hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );
};

