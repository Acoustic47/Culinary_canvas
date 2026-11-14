import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  Heart, 
  Sparkles, 
  ArrowRight, 
  ShoppingBag, 
  Bike,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency } from '../lib/utils';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    tipAmount,
    setTipAmount,
    couponCode,
    discountAmount,
    couponError,
    applyCoupon,
    removeCoupon,
    checkoutAndTrack,
  } = useAppStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.unitTotal * item.quantity, 0);
  
  // Free delivery threshold: $50
  const freeDeliveryThreshold = 50.0;
  const deliveryFee = subtotal >= freeDeliveryThreshold || couponCode === 'SAGEFREE' ? 0 : 4.5;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const grandTotal = Math.max(0, subtotal + deliveryFee + tipAmount - discountAmount);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = codeToApply || inputCoupon;
    if (!code) return;
    const success = applyCoupon(code);
    if (success) {
      // Trigger confetti celebration!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#34D399', '#F59E0B', '#F8F9FA'],
      });
      setInputCoupon('');
    }
  };

  const handleCheckout = () => {
    checkoutAndTrack('428 Mission St, Penthouse 18B, San Francisco');
  };

  return (
    <>
      {/* 1. Persistent Floating Mini-Dock when Cart has items but drawer is closed */}
      <AnimatePresence>
        {!isCartOpen && cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 text-obsidian-950 font-bold shadow-sage-glow hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-300/40"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-2 bg-obsidian-950 text-emerald-400 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-obsidian-900 leading-none">
                  Review Canvas
                </div>
                <div className="text-sm font-mono font-extrabold">
                  {formatCurrency(grandTotal)}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Interactive Slide-over Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-md transition-opacity"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="w-screen max-w-md bg-obsidian-900 border-l border-white/10 shadow-2xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-5 border-b border-white/10 flex items-center justify-between bg-obsidian-950/60 backdrop-blur-xl">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white">Your Canvas Tray</h3>
                      <p className="text-[11px] text-slate-400">
                        {cart.length === 0
                          ? 'Empty'
                          : `${cart.reduce((s, i) => s + i.quantity, 0)} curated selections`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
                    aria-label="Close cart"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Free Delivery Progress Bar */}
                {cart.length > 0 && (
                  <div className="px-5 py-3 bg-emerald-950/30 border-b border-emerald-500/20 text-xs">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-slate-300 font-medium">
                        {amountToFreeDelivery === 0 ? (
                          <span className="text-emerald-400 font-bold flex items-center space-x-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Unlocked Free Priority Delivery!</span>
                          </span>
                        ) : (
                          <span>
                            Add <strong className="text-emerald-400">{formatCurrency(amountToFreeDelivery)}</strong> more for Free Delivery
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {formatCurrency(subtotal)} / {formatCurrency(freeDeliveryThreshold)}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-obsidian-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${freeDeliveryProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}

                {/* Scrollable Items List */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mb-4">
                        <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                      </div>
                      <h4 className="font-serif text-lg font-bold text-white">Your Tray is Clean</h4>
                      <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                        Explore our curated kitchens and customize artisan dishes to build your personal tasting menu.
                      </p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="mt-6 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold hover:bg-emerald-500/30 transition"
                      >
                        Explore Flavors
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Cart Items List */}
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div
                            key={item.cartItemId}
                            className="p-3.5 rounded-2xl glass-panel border border-white/10 flex items-start justify-between gap-3"
                          >
                            <img
                              src={item.dish.image}
                              alt={item.dish.name}
                              className="w-14 h-14 rounded-xl object-cover border border-white/10 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-bold text-white truncate">
                                {item.dish.name}
                              </h5>
                              <p className="text-[11px] text-emerald-400 font-medium">
                                {item.customization.portion.label}
                              </p>

                              {/* Add-ons list */}
                              {item.customization.selectedAddOns.length > 0 && (
                                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                  + {item.customization.selectedAddOns.map((a) => a.name).join(', ')}
                                </p>
                              )}

                              {item.customization.specialInstructions && (
                                <p className="text-[10px] text-amber-300/80 italic mt-0.5 truncate">
                                  "{item.customization.specialInstructions}"
                                </p>
                              )}

                              <div className="flex items-center justify-between mt-2.5">
                                <div className="flex items-center space-x-2 bg-obsidian-950 rounded-lg p-0.5 border border-white/10">
                                  <button
                                    onClick={() => updateCartItemQuantity(item.cartItemId, -1)}
                                    className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-4 text-center font-mono text-xs font-bold text-white">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateCartItemQuantity(item.cartItemId, 1)}
                                    className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <div className="text-xs font-mono font-bold text-white">
                                  {formatCurrency(item.unitTotal * item.quantity)}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => removeCartItem(item.cartItemId)}
                              className="text-slate-500 hover:text-rose-400 p-1 transition"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Promo Code Applicator */}
                      <div className="pt-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center space-x-1.5">
                          <Tag className="w-3.5 h-3.5 text-amber-400" />
                          <span>Artisan Voucher</span>
                        </div>

                        {couponCode ? (
                          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-300">
                            <div className="flex items-center space-x-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span className="font-mono font-bold">{couponCode}</span>
                              <span className="text-slate-300">
                                (-{formatCurrency(discountAmount)})
                              </span>
                            </div>
                            <button
                              onClick={removeCoupon}
                              className="text-slate-400 hover:text-rose-400 text-xs font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={inputCoupon}
                                onChange={(e) => setInputCoupon(e.target.value)}
                                placeholder="Try CULINARY10 or LUXEBITE"
                                className="flex-1 px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                              />
                              <button
                                onClick={() => handleApplyCoupon()}
                                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-obsidian-950 text-xs font-bold transition"
                              >
                                Apply
                              </button>
                            </div>
                            {couponError && (
                              <div className="text-[11px] text-rose-400 flex items-center space-x-1">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                <span>{couponError}</span>
                              </div>
                            )}

                            {/* Preset Voucher Pills */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {['CULINARY10', 'SAGEFREE', 'LUXEBITE'].map((code) => (
                                <button
                                  key={code}
                                  onClick={() => handleApplyCoupon(code)}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 transition"
                                >
                                  +{code}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Courier Appreciation Tip */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                          <span className="flex items-center space-x-1.5">
                            <Heart className="w-3.5 h-3.5 text-rose-400" />
                            <span>Courier Appreciation</span>
                          </span>
                          <span className="text-[11px] text-slate-400 lowercase font-normal">
                            100% goes directly to Marcus
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          {[2.0, 4.0, 6.0, 8.0].map((amt) => {
                            const isSelected = tipAmount === amt;
                            return (
                              <button
                                key={amt}
                                type="button"
                                onClick={() => setTipAmount(amt)}
                                className={`py-2 rounded-xl text-xs font-mono font-bold transition ${
                                  isSelected
                                    ? 'bg-emerald-500/25 border-emerald-400 text-white shadow-sage-glow'
                                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                                } border`}
                              >
                                {formatCurrency(amt)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Footer Pricing Summary & Checkout CTA */}
                {cart.length > 0 && (
                  <div className="p-5 bg-obsidian-950 border-t border-white/10 space-y-3">
                    {/* Cost Breakdown */}
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span>Canvas Subtotal</span>
                        <span className="font-mono text-white">{formatCurrency(subtotal)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Priority Dispatch</span>
                        <span className="font-mono text-white">
                          {deliveryFee === 0 ? (
                            <span className="text-emerald-400 font-bold">FREE</span>
                          ) : (
                            formatCurrency(deliveryFee)
                          )}
                        </span>
                      </div>

                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-400 font-medium">
                          <span>Voucher Discount</span>
                          <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Courier Tip</span>
                        <span className="font-mono text-white">{formatCurrency(tipAmount)}</span>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex justify-between text-base font-bold text-white">
                        <span>Total Due</span>
                        <span className="font-mono text-lg text-emerald-400">
                          {formatCurrency(grandTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Checkout CTA */}
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 hover:brightness-110 text-obsidian-950 font-extrabold text-sm shadow-sage-glow transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Bike className="w-5 h-5" />
                        <span>Confirm & Dispatch Live</span>
                      </div>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

