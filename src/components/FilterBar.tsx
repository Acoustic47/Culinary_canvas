import React from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Clock, 
  Navigation, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Star,
  Check
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { DietaryType, PriceTier, FilterState } from '../types';
import { CUISINES_LIST } from '../data/mockData';

const DIETARY_OPTIONS: DietaryType[] = [
  'Vegan',
  'Halal',
  'Jain',
  'Keto',
  'Gluten-Free',
  'Pure Veg',
];

const BUDGET_TIERS: PriceTier[] = ['$', '$$', '$$$', '$$$$'];

export const FilterBar: React.FC = () => {
  const {
    filters,
    setSelectedCuisine,
    setMaxDistanceKm,
    toggleDietary,
    toggleBudgetTier,
    setSortBy,
    resetFilters,
  } = useAppStore();

  // Dynamic ETA calculation based on selected distance slider
  // Base kitchen prep (15 min) + ~3.5 min per km delivery transit
  const estimatedMinETA = Math.round(15 + filters.maxDistanceKm * 3.2);
  const estimatedMaxETA = estimatedMinETA + 8;

  const activeFiltersCount =
    (filters.selectedVibe !== 'all' ? 1 : 0) +
    (filters.selectedCuisine !== 'All Cuisines' ? 1 : 0) +
    (filters.maxDistanceKm < 6.0 ? 1 : 0) +
    filters.selectedDietary.length +
    filters.budgetTier.length +
    (filters.sortBy !== 'dynamic-match' ? 1 : 0);

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-5 mb-8 border border-white/10 shadow-glass">
      {/* Top Filter Controls: Cuisine Chips + Active Count */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        {/* Cuisine horizontal scroll */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {CUISINES_LIST.map((cuisine) => {
            const isSelected = filters.selectedCuisine === cuisine;
            return (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-obsidian-950 font-bold shadow-sage-glow'
                    : 'glass-pill text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {cuisine}
              </button>
            );
          })}
        </div>

        {/* Clear & Active summary */}
        <div className="flex items-center justify-between sm:justify-end space-x-3 text-xs">
          {activeFiltersCount > 0 && (
            <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>{activeFiltersCount} filters active</span>
            </span>
          )}

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center space-x-1 text-slate-400 hover:text-rose-400 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Filter Grid: Distance Slider + Dietary Chips + Budget Meter + Sort */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
        {/* 1. Distance Slider & Live ETA */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              <span>Delivery Radius</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              Within {filters.maxDistanceKm} km
            </span>
          </div>

          <input
            type="range"
            min="1.0"
            max="10.0"
            step="0.5"
            value={filters.maxDistanceKm}
            onChange={(e) => setMaxDistanceKm(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Estimated ETA:</span>
            </span>
            <span className="font-semibold text-slate-200">
              {estimatedMinETA}–{estimatedMaxETA} mins
            </span>
          </div>
        </div>

        {/* 2. Dietary Toggles */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300">Dietary Preferences</div>
          <div className="flex flex-wrap gap-1.5">
            {DIETARY_OPTIONS.map((diet) => {
              const active = filters.selectedDietary.includes(diet);
              return (
                <button
                  key={diet}
                  onClick={() => toggleDietary(diet)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center space-x-1 ${
                    active
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {active && <Check className="w-2.5 h-2.5 text-emerald-400" />}
                  <span>{diet}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Interactive Budget Meter */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300">Budget Meter</div>
          <div className="grid grid-cols-4 gap-1.5">
            {BUDGET_TIERS.map((tier) => {
              const active = filters.budgetTier.includes(tier);
              return (
                <button
                  key={tier}
                  onClick={() => toggleBudgetTier(tier)}
                  className={`py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center ${
                    active
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-brass-glow'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {tier}
                </button>
              );
            })}
          </div>
          <div className="text-[10px] text-slate-400 text-center">
            {filters.budgetTier.length === 0
              ? 'All price brackets'
              : `Showing: ${filters.budgetTier.join(' & ')}`}
          </div>
        </div>

        {/* 4. Sort Selector */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300">Sort Matrix</div>
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => setSortBy(e.target.value as FilterState['sortBy'])}
              className="w-full px-3 py-2 rounded-xl bg-obsidian-950/80 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/60 transition cursor-pointer"
            >
              <option value="dynamic-match">✨ Dynamic Match Score</option>
              <option value="delivery-speed">⚡ Fastest Dispatch / ETA</option>
              <option value="hygiene">🛡️ Hygiene Audit (Triple Tested)</option>
              <option value="rating">★ Highest Community Rating</option>
              <option value="price-asc">💲 Price: Modest to Haute</option>
            </select>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>All kitchens verified for cold-chain integrity</span>
          </div>
        </div>
      </div>
    </div>
  );
};
