import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  ShoppingBag, 
  Sparkles, 
  Compass, 
  Heart, 
  ShieldCheck, 
  ChevronDown, 
  X,
  Bike
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { RESTAURANTS_DATA, DISHES_DATA } from '../data/mockData';
import { formatCurrency } from '../lib/utils';

export const Navbar: React.FC = () => {
  const {
    filters,
    setSearchQuery,
    cart,
    setIsCartOpen,
    activeOrder,
    setActiveView,
    activeView,
    favoriteRestaurants,
    setSelectedRestaurantId,
    openDishModal,
  } = useAppStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Waterfront Pier, SF');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitTotal * item.quantity, 0);

  // Close search autocomplete on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Matching items for autocomplete
  const query = filters.searchQuery.trim().toLowerCase();
  const matchedRestaurants = query.length > 0
    ? RESTAURANTS_DATA.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.cuisines.some((c) => c.toLowerCase().includes(query))
      ).slice(0, 3)
    : [];

  const matchedDishes = query.length > 0
    ? DISHES_DATA.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.tagline.toLowerCase().includes(query) ||
          d.cuisine.toLowerCase().includes(query)
      ).slice(0, 4)
    : [];

  const availableLocations = [
    'Waterfront Pier, SF',
    'Nob Hill, SF',
    'Mission Dolores, SF',
    'Presidio Heights, SF',
    'SOMA Arts District, SF',
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel-elevated border-b border-white/10 backdrop-blur-xl">
      {/* Top Announcement / Active Live Order Bar */}
      {activeOrder && (
        <div className="bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-obsidian-900 border-b border-emerald-500/30 px-4 py-2 text-xs flex items-center justify-between text-emerald-300">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-200">
              Active Order #{activeOrder.id} ({activeOrder.restaurant.name})
            </span>
            <span className="hidden sm:inline text-emerald-400/80">
              • Driver: {activeOrder.driver.name} is on the way
            </span>
          </div>
          <button
            onClick={() => setActiveView('track')}
            className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-semibold transition"
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Track Live Canvas</span>
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => {
              setSelectedRestaurantId(null);
              setActiveView('feed');
            }}
            className="group flex items-center space-x-3 text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-900 flex items-center justify-center shadow-sage-glow border border-emerald-300/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-obsidian-950 fill-obsidian-950" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  CulinaryCanvas
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]"></span>
              </div>
              <p className="text-[10px] tracking-wider uppercase text-slate-400 font-medium">
                Haute Gastronomy & Discovery
              </p>
            </div>
          </button>

          {/* Location Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setLocationMenuOpen(!locationMenuOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl glass-pill hover:bg-white/10 text-xs text-slate-300 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium text-slate-200">{currentLocation}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {locationMenuOpen && (
              <div className="absolute left-0 mt-2 w-56 glass-panel-elevated rounded-xl shadow-glass border border-white/10 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Deliver to Curated Hub
                </div>
                {availableLocations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setCurrentLocation(loc);
                      setLocationMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition ${
                      currentLocation === loc ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <span>{loc}</span>
                    {currentLocation === loc && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Search Engine */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-lg hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search wild otoro, woodfired sourdough, saffron morels..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full bg-obsidian-950/70 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition backdrop-blur-md"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchFocused && query.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 glass-panel-elevated rounded-2xl shadow-2xl border border-white/10 p-3 z-50 animate-in fade-in slide-in-from-top-1">
              {matchedRestaurants.length === 0 && matchedDishes.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  No matching artisan dishes or kitchens for "{query}"
                </div>
              ) : (
                <div className="space-y-3">
                  {matchedRestaurants.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 mb-1.5">
                        Artisan Kitchens
                      </div>
                      <div className="space-y-1">
                        {matchedRestaurants.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => {
                              setSelectedRestaurantId(r.id);
                              setActiveView('restaurant');
                              setIsSearchFocused(false);
                            }}
                            className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-white/5 flex items-center space-x-3 transition group"
                          >
                            <img
                              src={r.logo}
                              alt={r.name}
                              className="w-8 h-8 rounded-lg object-cover border border-white/10"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors truncate">
                                {r.name}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {r.cuisines.join(' • ')} · {r.hygieneRating}
                              </p>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              ★ {r.rating}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchedDishes.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 mb-1.5">
                        Crafted Dishes
                      </div>
                      <div className="space-y-1">
                        {matchedDishes.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => {
                              openDishModal(d);
                              setIsSearchFocused(false);
                            }}
                            className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-white/5 flex items-center space-x-3 transition group"
                          >
                            <img
                              src={d.image}
                              alt={d.name}
                              className="w-8 h-8 rounded-lg object-cover border border-white/10"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors truncate">
                                {d.name}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {d.restaurantName} · {d.prepTime}
                              </p>
                            </div>
                            <span className="text-xs font-semibold text-white">
                              {formatCurrency(d.price)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center space-x-3">
          {/* Feed View Shortcut */}
          <button
            onClick={() => {
              setSelectedRestaurantId(null);
              setActiveView('feed');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center space-x-1.5 ${
              activeView === 'feed'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Discovery</span>
          </button>

          {/* Favorites Pill */}
          <button
            onClick={() => {
              // Quick filter by favorites if clicked
            }}
            title="Saved Favorites"
            className="p-2 rounded-xl glass-pill hover:bg-white/10 text-slate-300 hover:text-emerald-400 transition relative"
          >
            <Heart className="w-4 h-4" />
            {favoriteRestaurants.size > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-obsidian-950 font-bold text-[9px] rounded-full flex items-center justify-center">
                {favoriteRestaurants.size}
              </span>
            )}
          </button>

          {/* Floating Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center space-x-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-obsidian-950 font-bold text-xs shadow-sage-glow hover:scale-102 active:scale-98 transition transform"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-obsidian-950" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-obsidian-950 text-emerald-400 border border-emerald-400 text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">
              {totalCartItems > 0 ? formatCurrency(cartSubtotal) : 'Cart'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Row */}
      <div className="lg:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes, chef specials, kitchens..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-obsidian-950/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>
    </header>
  );
};

