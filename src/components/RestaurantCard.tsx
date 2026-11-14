import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { Restaurant } from '../types';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency } from '../lib/utils';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const {
    setSelectedRestaurantId,
    setActiveView,
    favoriteRestaurants,
    toggleFavoriteRestaurant,
    filters,
  } = useAppStore();

  const isFavorite = favoriteRestaurants.has(restaurant.id);

  // Dynamic ETA calculation based on distance
  const dynamicETA = Math.round(14 + restaurant.distanceKm * 3.5);

  const handleCardClick = () => {
    setSelectedRestaurantId(restaurant.id);
    setActiveView('restaurant');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-emerald-500/30 transition-all duration-300 shadow-glass flex flex-col justify-between"
    >
      {/* Top Media Showcase */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden cursor-pointer" onClick={handleCardClick}>
        <img
          src={restaurant.heroImage}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.88]"
          loading="lazy"
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/30 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          {/* Hygiene Audit Badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-obsidian-950/80 backdrop-blur-md border border-emerald-500/40 text-[10px] font-semibold text-emerald-300 shadow-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{restaurant.hygieneRating}</span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoriteRestaurant(restaurant.id);
            }}
            className="p-2 rounded-full bg-obsidian-950/70 backdrop-blur-md border border-white/15 text-slate-300 hover:text-rose-400 transition hover:scale-110 active:scale-95"
            aria-label="Save restaurant"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
          </button>
        </div>

        {/* Bottom Floating Stats Strip */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs">
          {/* ETA & Distance */}
          <div className="flex items-center space-x-2 text-slate-200 bg-obsidian-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
            <span className="flex items-center space-x-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{dynamicETA} mins</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">{restaurant.distanceKm} km</span>
          </div>

          {/* Price Tier & Rating */}
          <div className="flex items-center space-x-1.5 bg-obsidian-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
            <span className="font-mono font-bold text-amber-400 text-xs">
              {restaurant.priceTier}
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center space-x-1 text-emerald-400 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-emerald-400" />
              <span>{restaurant.rating}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Restaurant Body Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Tagline */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 
                onClick={handleCardClick}
                className="font-serif text-xl font-bold text-white group-hover:text-emerald-300 transition-colors cursor-pointer"
              >
                {restaurant.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                {restaurant.tagline}
              </p>
            </div>
            {restaurant.isFeatured && (
              <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                Featured
              </span>
            )}
          </div>

          {/* Description snippet */}
          <p className="text-xs text-slate-300/80 mt-2 line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>

          {/* Dietary Badges */}
          <div className="flex flex-wrap gap-1 mt-3">
            {restaurant.dietaryBadges.map((badge) => (
              <span
                key={badge}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 border border-white/10 text-slate-300"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Popular Dishes Preview */}
          <div className="mt-3.5 pt-3 border-t border-white/10">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center space-x-1">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Must-Try Dishes:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {restaurant.popularDishNames.map((name) => (
                <span
                  key={name}
                  className="text-[11px] px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300/90 font-medium truncate max-w-full"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action Strip */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="text-slate-400 text-[11px]">
            Delivery: <span className="font-semibold text-slate-200">{formatCurrency(restaurant.deliveryFee)}</span>
          </div>

          <button
            onClick={handleCardClick}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-obsidian-950 text-slate-200 font-semibold transition-all group/btn"
          >
            <span>View Menu</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

