import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Flame, 
  Sparkles, 
  Check, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Activity, 
  Clock, 
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Dish, PortionOption, AddOnOption, CartCustomization } from '../types';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency } from '../lib/utils';

export const DishModal: React.FC = () => {
  const { activeDishModal, closeDishModal, addItemToCart } = useAppStore();

  const dish = activeDishModal;

  // Selected state
  const [selectedPortion, setSelectedPortion] = useState<PortionOption | null>(null);
  const [selectedSpice, setSelectedSpice] = useState<number>(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Initialize defaults on modal open
  useEffect(() => {
    if (dish) {
      setSelectedPortion(dish.portionSizes[0] || { id: 'default', name: 'Standard', label: 'Standard', priceDelta: 0 });
      setSelectedSpice(dish.spiceLevel);
      setSelectedAddOns([]);
      setSpecialInstructions('');
      setQuantity(1);
      setActiveImageIndex(0);
    }
  }, [dish]);

  if (!dish || !selectedPortion) return null;

  // Calculate live total price
  const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const unitPrice = dish.price + selectedPortion.priceDelta + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const toggleAddOn = (addOn: AddOnOption) => {
    const exists = selectedAddOns.some((a) => a.id === addOn.id);
    if (exists) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addOn.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addOn]);
    }
  };

  const handleAddToCart = () => {
    const customization: CartCustomization = {
      portion: selectedPortion,
      spiceLevel: selectedSpice,
      selectedAddOns,
      specialInstructions,
    };
    addItemToCart(dish, customization, quantity);
    closeDishModal();
  };

  const images = dish.gallery && dish.gallery.length > 0 ? dish.gallery : [dish.image];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDishModal}
          className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-obsidian-900 border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={closeDishModal}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-obsidian-950/80 backdrop-blur-md text-slate-300 hover:text-white border border-white/15 transition hover:scale-105"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Container */}
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {/* Gallery Carousel */}
            <div className="relative h-64 sm:h-72 w-full bg-obsidian-950">
              <img
                src={images[activeImageIndex]}
                alt={dish.name}
                className="w-full h-full object-cover brightness-[0.88]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-transparent to-black/40"></div>

              {/* Prev / Next photo buttons */}
              {images.length > 1 && (
                <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                    }
                    className="p-1.5 rounded-full bg-obsidian-950/70 backdrop-blur-md text-white pointer-events-auto hover:bg-obsidian-950 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                    }
                    className="p-1.5 rounded-full bg-obsidian-950/70 backdrop-blur-md text-white pointer-events-auto hover:bg-obsidian-950 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Bottom Image Indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeImageIndex === idx ? 'w-5 bg-emerald-400' : 'w-1.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Cuisine & Special Tags */}
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full bg-obsidian-950/80 backdrop-blur-md text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                  {dish.cuisine}
                </span>
                {dish.isChefSpecial && (
                  <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-amber-500/40">
                    <Sparkles className="w-3 h-3" />
                    <span>Chef Tasting</span>
                  </span>
                )}
              </div>
            </div>

            {/* Content & Options */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* Header Title & Tagline */}
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {dish.name}
                  </h3>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">
                    {formatCurrency(unitPrice)}
                  </div>
                </div>
                <p className="text-xs text-emerald-400/90 font-medium mt-0.5">
                  by {dish.restaurantName}
                </p>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  {dish.description}
                </p>
              </div>

              {/* Calorie & Macro Breakdown Dashboard */}
              <div className="p-4 rounded-2xl bg-obsidian-950/70 border border-white/10">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Nutritional Precision</span>
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Est. Prep: {dish.prepTime}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Calories</div>
                    <div className="text-sm font-bold text-white mt-0.5 font-mono">
                      {dish.macros.calories}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="text-[10px] text-emerald-400 uppercase font-medium">Protein</div>
                    <div className="text-sm font-bold text-emerald-300 mt-0.5 font-mono">
                      {dish.macros.protein}g
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="text-[10px] text-amber-400 uppercase font-medium">Carbs</div>
                    <div className="text-sm font-bold text-amber-300 mt-0.5 font-mono">
                      {dish.macros.carbs}g
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Lipids</div>
                    <div className="text-sm font-bold text-slate-200 mt-0.5 font-mono">
                      {dish.macros.fat}g
                    </div>
                  </div>
                </div>

                {dish.allergens.length > 0 && (
                  <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-amber-300/80">
                    <Info className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Allergen Notice: Contains {dish.allergens.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* 1. Portion Size Selection */}
              {dish.portionSizes.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Select Portion Architecture <span className="text-emerald-400">*</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {dish.portionSizes.map((portion) => {
                      const isSelected = selectedPortion.id === portion.id;
                      return (
                        <button
                          key={portion.id}
                          type="button"
                          onClick={() => setSelectedPortion(portion)}
                          className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-sage-glow'
                              : 'bg-white/5 border-white/10 hover:border-white/20 text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-semibold">{portion.label}</div>
                            <div className="text-[10px] text-slate-400">{portion.name}</div>
                          </div>
                          <div className="text-xs font-mono font-bold text-emerald-400">
                            {portion.priceDelta > 0
                              ? `+${formatCurrency(portion.priceDelta)}`
                              : 'Included'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Spice Level Adjustment */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span>Spice Calibration</span>
                  </span>
                  <span className="text-rose-400 font-semibold lowercase">
                    {selectedSpice === 0
                      ? 'Mild / No heat'
                      : selectedSpice === 1
                      ? 'Subtle warmth'
                      : selectedSpice === 2
                      ? 'Pronounced heat'
                      : 'Chef Fiery'}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { level: 0, label: 'Gentle', desc: 'No pepper' },
                    { level: 1, label: 'Subtle', desc: 'Aromatic' },
                    { level: 2, label: 'Medium', desc: 'Authentic' },
                    { level: 3, label: 'Fiery', desc: 'Mala kick' },
                  ].map((spice) => {
                    const isSelected = selectedSpice === spice.level;
                    return (
                      <button
                        key={spice.level}
                        type="button"
                        onClick={() => setSelectedSpice(spice.level)}
                        className={`p-2.5 rounded-xl border text-center transition ${
                          isSelected
                            ? 'bg-rose-500/20 border-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                            : 'bg-white/5 border-white/10 hover:border-white/20 text-slate-400'
                        }`}
                      >
                        <div className="text-xs font-bold">{spice.label}</div>
                        <div className="text-[10px] text-slate-500">{spice.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Artisan Add-Ons */}
              {dish.availableAddOns.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Artisan Accoutrements & Add-Ons
                  </div>
                  <div className="space-y-2">
                    {dish.availableAddOns.map((addOn) => {
                      const isChecked = selectedAddOns.some((a) => a.id === addOn.id);
                      return (
                        <button
                          key={addOn.id}
                          type="button"
                          onClick={() => toggleAddOn(addOn)}
                          className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                            isChecked
                              ? 'bg-amber-500/15 border-amber-400 text-white shadow-brass-glow'
                              : 'bg-white/5 border-white/10 hover:border-white/20 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${
                                isChecked
                                  ? 'bg-amber-400 border-amber-400 text-obsidian-950'
                                  : 'border-white/30'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-medium">{addOn.name}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-400">
                            +{formatCurrency(addOn.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Special Chef Prep Instructions */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Chef Notes & Culinary Instructions
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Extra crispy skin, dressing on the side, allergies note..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
                />
              </div>
            </div>
          </div>

          {/* Sticky Modal Bottom Action Bar */}
          <div className="p-4 sm:p-5 bg-obsidian-950 border-t border-white/10 flex items-center justify-between gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center space-x-2 bg-obsidian-850 border border-white/10 rounded-2xl p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 flex items-center justify-center transition"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-mono font-bold text-sm text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 flex items-center justify-center transition"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Order CTA */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 hover:brightness-110 text-obsidian-950 font-bold text-sm shadow-sage-glow transition flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Canvas</span>
              </div>
              <span className="font-mono text-base font-extrabold">
                {formatCurrency(totalPrice)}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

