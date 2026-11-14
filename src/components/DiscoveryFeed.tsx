import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Utensils, ShieldCheck, Flame } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { RESTAURANTS_DATA, TASTE_VIBES } from '../data/mockData';
import { TasteVibesCarousel } from './TasteVibesCarousel';
import { FilterBar } from './FilterBar';
import { RestaurantCard } from './RestaurantCard';
import { EmptyState } from './EmptyState';
import { RestaurantSkeletonCard } from './SkeletonCard';

export const DiscoveryFeed: React.FC = () => {
  const { filters } = useAppStore();
  const [isLoadingMock, setIsLoadingMock] = useState(false);

  // Filter & Sort calculation
  const filteredRestaurants = useMemo(() => {
    return RESTAURANTS_DATA.filter((r) => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesCuisine = r.cuisines.some((c) => c.toLowerCase().includes(q));
        const matchesDishes = r.popularDishNames.some((d) => d.toLowerCase().includes(q));
        const matchesDesc = r.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCuisine && !matchesDishes && !matchesDesc) {
          return false;
        }
      }

      // 2. Taste Vibe
      if (filters.selectedVibe !== 'all') {
        if (!r.vibes.includes(filters.selectedVibe)) {
          return false;
        }
      }

      // 3. Cuisine
      if (filters.selectedCuisine !== 'All Cuisines') {
        if (!r.cuisines.includes(filters.selectedCuisine)) {
          return false;
        }
      }

      // 4. Distance
      if (r.distanceKm > filters.maxDistanceKm) {
        return false;
      }

      // 5. Dietary
      if (filters.selectedDietary.length > 0) {
        const matchesAllSelectedDietary = filters.selectedDietary.every((diet) =>
          r.dietaryBadges.includes(diet)
        );
        if (!matchesAllSelectedDietary) return false;
      }

      // 6. Budget Tier
      if (filters.budgetTier.length > 0) {
        if (!filters.budgetTier.includes(r.priceTier)) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sorting
      if (filters.sortBy === 'delivery-speed') {
        return a.distanceKm - b.distanceKm;
      } else if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (filters.sortBy === 'hygiene') {
        return b.hygieneRating.localeCompare(a.hygieneRating);
      } else if (filters.sortBy === 'price-asc') {
        const priceMap: Record<string, number> = { $: 1, $$: 2, $$$: 3, $$$$: 4 };
        return priceMap[a.priceTier] - priceMap[b.priceTier];
      } else {
        // dynamic match: rating + review weight - distance factor
        const scoreA = a.rating * 10 + Math.min(a.reviewCount, 500) * 0.01 - a.distanceKm;
        const scoreB = b.rating * 10 + Math.min(b.reviewCount, 500) * 0.01 - b.distanceKm;
        return scoreB - scoreA;
      }
    });
  }, [filters]);

  const activeVibe = TASTE_VIBES.find((v) => v.id === filters.selectedVibe);

  return (
    <div className="space-y-6">
      {/* 1. Curated Taste Vibes Carousel */}
      <TasteVibesCarousel />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 2. Interactive Smart Filtering Facets */}
        <FilterBar />

        {/* 3. Section Header & Active State summary */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-2">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {activeVibe && activeVibe.id !== 'all'
                  ? `Filtered by ${activeVibe.title}`
                  : 'Artisan Discovery Matrix'}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Curated Kitchens
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Showing {filteredRestaurants.length} exceptional dining partners
              {filters.selectedDietary.length > 0 && ` matching ${filters.selectedDietary.join(', ')}`}
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Radius: <strong className="text-emerald-400">{filters.maxDistanceKm} km</strong>
          </div>
        </div>

        {/* 4. Restaurants Grid or Skeleton Loader or Empty State */}
        {isLoadingMock ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <RestaurantSkeletonCard key={i} />
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <EmptyState
            title="No Artisan Kitchens Match Current Criteria"
            description="Try increasing the delivery radius slider above or clearing dietary toggles to reveal more fine dining options."
            type={filters.searchQuery ? 'search' : 'filter'}
          />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

