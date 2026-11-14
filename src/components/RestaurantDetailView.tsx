import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Share2, 
  Sparkles,
  Flame,
  Check
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { RESTAURANTS_DATA, DISHES_DATA } from '../data/mockData';
import { DishCard } from './DishCard';
import { CommunityReviews } from './CommunityReviews';
import { DietaryType } from '../types';
import { formatCurrency } from '../lib/utils';

export const RestaurantDetailView: React.FC = () => {
  const {
    selectedRestaurantId,
    setActiveView,
    favoriteRestaurants,
    toggleFavoriteRestaurant,
  } = useAppStore();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedDiet, setSelectedDiet] = useState<DietaryType | 'All'>('All');

  const restaurant = RESTAURANTS_DATA.find((r) => r.id === selectedRestaurantId) || RESTAURANTS_DATA[0];
  const isFavorite = favoriteRestaurants.has(restaurant.id);

  // Dishes for this restaurant
  const allRestaurantDishes = DISHES_DATA.filter((d) => d.restaurantId === restaurant.id);
  
  // Filter by category and dietary
  const filteredDishes = allRestaurantDishes.filter((dish) => {
    const matchesCategory = activeCategory === 'All' || dish.category === activeCategory;
    const matchesDiet = selectedDiet === 'All' || dish.dietary.includes(selectedDiet);
    return matchesCategory && matchesDiet;
  });

  // Unique categories for this restaurant
  const categories = ['All', ...Array.from(new Set(allRestaurantDishes.map((d) => d.category)))];

  const dynamicETA = Math.round(14 + restaurant.distanceKm * 3.5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in duration-300">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('feed')}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl glass-pill hover:bg-white/10 text-xs text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Curated Feed</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleFavoriteRestaurant(restaurant.id)}
            className="p-2.5 rounded-xl glass-pill hover:bg-white/10 text-slate-300 hover:text-rose-400 transition"
            aria-label="Save to favorites"
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Hero Showcase Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-glass">
        {/* Background Image */}
        <div className="relative h-64 sm:h-80 w-full">
          <img
            src={restaurant.heroImage}
            alt={restaurant.name}
            className="w-full h-full object-cover brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/60 to-transparent"></div>
        </div>

        {/* Content Floating over Hero */}
        <div className="p-6 sm:p-8 -mt-24 sm:-mt-28 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-4 sm:space-x-5">
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-400 shadow-sage-glow bg-obsidian-900"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {restaurant.name}
                </h1>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]"></span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-400 font-medium mt-0.5">
                {restaurant.tagline}
              </p>
              <p className="text-xs text-slate-300/80 max-w-xl mt-2 leading-relaxed">
                {restaurant.description}
              </p>
            </div>
          </div>

          {/* Quick Metrics Badge Strip */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Rating */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-obsidian-950/80 backdrop-blur-md border border-white/10">
              <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
              <span className="font-bold text-white">{restaurant.rating}</span>
              <span className="text-slate-500">({restaurant.reviewCount})</span>
            </div>

            {/* Hygiene Certification */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-obsidian-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{restaurant.hygieneRating}</span>
            </div>

            {/* ETA */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-obsidian-950/80 backdrop-blur-md border border-white/10 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{dynamicETA} mins ETA</span>
            </div>

            {/* Price Tier */}
            <div className="px-3 py-1.5 rounded-xl bg-obsidian-950/80 backdrop-blur-md border border-white/10 font-mono font-bold text-amber-400">
              {restaurant.priceTier}
            </div>
          </div>
        </div>

        {/* Address and Dietary Strip */}
        <div className="px-6 pb-6 pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{restaurant.address}</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">{restaurant.distanceKm} km from Waterfront</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {restaurant.dietaryBadges.map((badge) => (
              <span
                key={badge}
                className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[10px]"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Filter Navigation Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          {/* Categories Tab Strip */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-emerald-500 text-obsidian-950 shadow-sage-glow'
                    : 'glass-pill text-slate-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dietary Filter Buttons */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            {(['All', 'Vegan', 'Halal', 'Pure Veg', 'Gluten-Free', 'Keto'] as const).map((diet) => (
              <button
                key={diet}
                onClick={() => setSelectedDiet(diet)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  selectedDiet === diet
                    ? 'bg-white/20 text-white border border-white/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        {/* Section Headline */}
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-white flex items-center space-x-2">
            <span>{activeCategory === 'All' ? 'Full Tasting Menu' : `${activeCategory} Selections`}</span>
            <span className="text-xs text-slate-500 font-sans font-normal">
              ({filteredDishes.length} dishes)
            </span>
          </h2>
        </div>

        {/* Dishes Grid */}
        {filteredDishes.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center border border-white/10">
            <p className="text-sm text-slate-400">
              No dishes found matching "{selectedDiet}" in the {activeCategory} category.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSelectedDiet('All');
              }}
              className="mt-4 px-4 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
            >
              Clear Preferences
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>

      {/* Community "BiteReviews" Section */}
      <CommunityReviews
        reviews={restaurant.reviews}
        overallRating={restaurant.rating}
        hygieneAudit={restaurant.hygieneRating}
      />
    </div>
  );
};

