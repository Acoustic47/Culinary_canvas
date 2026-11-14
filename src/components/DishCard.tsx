import React from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  ThumbsUp, 
  Sparkles, 
  Clock, 
  Plus, 
  Activity,
  AlertCircle 
} from 'lucide-react';
import { Dish } from '../types';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency } from '../lib/utils';

interface DishCardProps {
  dish: Dish;
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const { openDishModal, upvotedDishes, toggleUpvoteDish } = useAppStore();
  const isUpvoted = upvotedDishes.has(dish.id);
  const upvoteCount = dish.upvotes + (isUpvoted ? 1 : 0);

  // Spice level flame icons
  const renderSpiceMeter = (level: number) => {
    if (level === 0) return null;
    return (
      <div 
        className="flex items-center space-x-0.5 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-bold"
        title={`Spice Level: ${level}/3`}
      >
        <Flame className="w-3 h-3 fill-rose-500 text-rose-500" />
        <span>{'•'.repeat(level)}</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="group glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-500/40 transition-all duration-300 shadow-glass flex flex-col justify-between"
    >
      {/* Media & Badges */}
      <div 
        className="relative h-48 w-full overflow-hidden cursor-pointer"
        onClick={() => openDishModal(dish)}
      >
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.9]"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent"></div>

        {/* Top Floating Tags */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            {dish.isChefSpecial && (
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-[10px] font-bold text-amber-300 shadow">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Chef Special</span>
              </span>
            )}
            {dish.isMustTry && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-[10px] font-bold text-emerald-300 shadow">
                ★ Must-Try
              </span>
            )}
          </div>

          {/* Spice Meter */}
          {renderSpiceMeter(dish.spiceLevel)}
        </div>

        {/* Bottom Floating Stats (Prep time & Calories) */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-300">
          <div className="flex items-center space-x-1.5 bg-obsidian-950/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{dish.prepTime}</span>
          </div>

          <div className="flex items-center space-x-1 bg-obsidian-950/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>{dish.macros.calories} kcal</span>
          </div>
        </div>
      </div>

      {/* Dish Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Headline */}
          <div className="flex items-start justify-between gap-2">
            <h4 
              onClick={() => openDishModal(dish)}
              className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors cursor-pointer leading-snug"
            >
              {dish.name}
            </h4>
            <span className="font-mono text-base font-bold text-white flex-shrink-0">
              {formatCurrency(dish.price)}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
            {dish.tagline}
          </p>

          <p className="text-xs text-slate-300/80 mt-2 line-clamp-2 leading-relaxed">
            {dish.description}
          </p>

          {/* Dietary & Allergen chips */}
          <div className="flex flex-wrap gap-1 mt-3">
            {dish.dietary.map((d) => (
              <span
                key={d}
                className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-slate-300 font-medium"
              >
                {d}
              </span>
            ))}
            {dish.allergens.length > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-300/90 font-medium">
                Contains {dish.allergens.join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Footer: Social Proof Upvote & Customize CTA */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          {/* Community Upvote */}
          <button
            onClick={() => toggleUpvoteDish(dish.id)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition ${
              isUpvoted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'glass-pill text-slate-400 hover:text-slate-200'
            }`}
            title="Upvote this signature dish"
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-emerald-400' : ''}`} />
            <span>{upvoteCount}</span>
          </button>

          {/* Customize Button */}
          <button
            onClick={() => openDishModal(dish)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-obsidian-950 font-bold text-xs border border-emerald-500/30 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

