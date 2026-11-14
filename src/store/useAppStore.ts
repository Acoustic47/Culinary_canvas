import { create } from 'zustand';
import { 
  Dish, 
  Restaurant, 
  CartItem, 
  CartCustomization, 
  FilterState, 
  ActiveOrder, 
  OrderStep, 
  DietaryType, 
  PriceTier, 
  TasteVibeId 
} from '../types';
import { RESTAURANTS_DATA, DISHES_DATA } from '../data/mockData';

interface AppStore {
  // Discovery & Filtering
  filters: FilterState;
  setSearchQuery: (query: string) => void;
  setSelectedVibe: (vibe: TasteVibeId) => void;
  setSelectedCuisine: (cuisine: string) => void;
  setMaxDistanceKm: (dist: number) => void;
  toggleDietary: (diet: DietaryType) => void;
  toggleBudgetTier: (tier: PriceTier) => void;
  setSortBy: (sort: FilterState['sortBy']) => void;
  resetFilters: () => void;

  // Selected Restaurant & Modal
  selectedRestaurantId: string | null;
  setSelectedRestaurantId: (id: string | null) => void;
  activeDishModal: Dish | null;
  openDishModal: (dish: Dish) => void;
  closeDishModal: () => void;

  // Cart & Drawer
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  tipAmount: number;
  setTipAmount: (amount: number) => void;
  couponCode: string | null;
  discountAmount: number;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  addItemToCart: (dish: Dish, customization: CartCustomization, quantity?: number) => void;
  updateCartItemQuantity: (cartItemId: string, delta: number) => void;
  removeCartItem: (cartItemId: string) => void;
  clearCart: () => void;

  // Active Order Tracking & Simulation
  activeOrder: ActiveOrder | null;
  isTrackerOpen: boolean;
  setIsTrackerOpen: (open: boolean) => void;
  checkoutAndTrack: (address?: string) => void;
  setOrderStep: (step: OrderStep) => void;
  cancelActiveOrder: () => void;

  // Community & Upvotes
  upvotedDishes: Set<string>;
  toggleUpvoteDish: (dishId: string) => void;
  favoriteRestaurants: Set<string>;
  toggleFavoriteRestaurant: (restId: string) => void;

  // UI Views
  activeView: 'feed' | 'restaurant' | 'track';
  setActiveView: (view: 'feed' | 'restaurant' | 'track') => void;
}

const initialFilters: FilterState = {
  searchQuery: '',
  selectedVibe: 'all',
  selectedCuisine: 'All Cuisines',
  maxDistanceKm: 6.0,
  selectedDietary: [],
  budgetTier: [],
  sortBy: 'dynamic-match',
};

export const useAppStore = create<AppStore>((set, get) => ({
  filters: initialFilters,
  
  setSearchQuery: (query) => set((s) => ({ filters: { ...s.filters, searchQuery: query } })),
  setSelectedVibe: (vibe) => set((s) => ({ filters: { ...s.filters, selectedVibe: vibe } })),
  setSelectedCuisine: (cuisine) => set((s) => ({ filters: { ...s.filters, selectedCuisine: cuisine } })),
  setMaxDistanceKm: (dist) => set((s) => ({ filters: { ...s.filters, maxDistanceKm: dist } })),
  toggleDietary: (diet) => set((s) => {
    const current = s.filters.selectedDietary;
    const exists = current.includes(diet);
    return {
      filters: {
        ...s.filters,
        selectedDietary: exists ? current.filter((d) => d !== diet) : [...current, diet],
      },
    };
  }),
  toggleBudgetTier: (tier) => set((s) => {
    const current = s.filters.budgetTier;
    const exists = current.includes(tier);
    return {
      filters: {
        ...s.filters,
        budgetTier: exists ? current.filter((t) => t !== tier) : [...current, tier],
      },
    };
  }),
  setSortBy: (sort) => set((s) => ({ filters: { ...s.filters, sortBy: sort } })),
  resetFilters: () => set({ filters: initialFilters }),

  // Modal
  selectedRestaurantId: null,
  setSelectedRestaurantId: (id) => set({ selectedRestaurantId: id }),
  activeDishModal: null,
  openDishModal: (dish) => set({ activeDishModal: dish }),
  closeDishModal: () => set({ activeDishModal: null }),

  // Cart
  cart: [],
  isCartOpen: false,
  setIsCartOpen: (open) => set({ isCartOpen: open }),
  tipAmount: 4.0,
  setTipAmount: (amount) => set({ tipAmount: amount }),
  couponCode: null,
  discountAmount: 0,
  couponError: null,
  
  applyCoupon: (codeRaw: string) => {
    const code = codeRaw.trim().toUpperCase();
    const items = get().cart;
    const subtotal = items.reduce((sum, item) => sum + item.unitTotal * item.quantity, 0);

    if (code === 'CULINARY10') {
      const discount = Math.round(subtotal * 0.1 * 100) / 100;
      set({ couponCode: code, discountAmount: discount, couponError: null });
      return true;
    } else if (code === 'SAGEFREE') {
      set({ couponCode: code, discountAmount: 4.5, couponError: null }); // Free delivery approx
      return true;
    } else if (code === 'LUXEBITE') {
      if (subtotal < 40) {
        set({ couponError: 'Add $' + (40 - subtotal).toFixed(2) + ' more to unlock LUXEBITE ($15 OFF)!' });
        return false;
      }
      set({ couponCode: code, discountAmount: 15.0, couponError: null });
      return true;
    } else {
      set({ couponError: 'Invalid voucher code. Try CULINARY10 or LUXEBITE' });
      return false;
    }
  },

  removeCoupon: () => set({ couponCode: null, discountAmount: 0, couponError: null }),

  addItemToCart: (dish, customization, quantity = 1) => {
    set((state) => {
      // Calculate unit total with portion and add-ons
      const addOnsCost = customization.selectedAddOns.reduce((sum, a) => sum + a.price, 0);
      const unitTotal = dish.price + customization.portion.priceDelta + addOnsCost;

      // Create an identifier signature for customized dish
      const addOnKey = customization.selectedAddOns.map((a) => a.id).sort().join(',');
      const signature = `${dish.id}-${customization.portion.id}-spice${customization.spiceLevel}-[${addOnKey}]-${customization.specialInstructions.trim()}`;

      const existingIndex = state.cart.findIndex((item) => item.cartItemId === signature);

      let updatedCart: CartItem[];
      if (existingIndex > -1) {
        updatedCart = [...state.cart];
        updatedCart[existingIndex].quantity += quantity;
      } else {
        const newItem: CartItem = {
          cartItemId: signature,
          dish,
          quantity,
          customization,
          unitTotal,
        };
        updatedCart = [...state.cart, newItem];
      }

      // Re-evaluate discount if percentage
      let newDiscount = state.discountAmount;
      if (state.couponCode === 'CULINARY10') {
        const subtotal = updatedCart.reduce((sum, i) => sum + i.unitTotal * i.quantity, 0);
        newDiscount = Math.round(subtotal * 0.1 * 100) / 100;
      }

      return {
        cart: updatedCart,
        discountAmount: newDiscount,
        isCartOpen: true, // open mini drawer briefly for feedback
      };
    });
  },

  updateCartItemQuantity: (cartItemId, delta) => {
    set((state) => {
      const updated = state.cart
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      let newDiscount = state.discountAmount;
      if (state.couponCode === 'CULINARY10') {
        const subtotal = updated.reduce((sum, i) => sum + i.unitTotal * i.quantity, 0);
        newDiscount = Math.round(subtotal * 0.1 * 100) / 100;
      } else if (state.couponCode === 'LUXEBITE') {
        const subtotal = updated.reduce((sum, i) => sum + i.unitTotal * i.quantity, 0);
        if (subtotal < 40) newDiscount = 0;
      }

      return {
        cart: updated,
        discountAmount: updated.length === 0 ? 0 : newDiscount,
        couponCode: updated.length === 0 ? null : state.couponCode,
      };
    });
  },

  removeCartItem: (cartItemId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.cartItemId !== cartItemId),
    }));
  },

  clearCart: () => set({ cart: [], couponCode: null, discountAmount: 0 }),

  // Order & Tracking Canvas
  activeOrder: null,
  isTrackerOpen: false,
  setIsTrackerOpen: (open) => set({ isTrackerOpen: open }),

  checkoutAndTrack: (address = '428 Mission St, Penthouse 18B, San Francisco') => {
    const { cart, tipAmount, discountAmount, couponCode } = get();
    if (cart.length === 0) return;

    // Pick primary restaurant from first cart item or fallback
    const firstDish = cart[0].dish;
    const rest = RESTAURANTS_DATA.find((r) => r.id === firstDish.restaurantId) || RESTAURANTS_DATA[0];

    const subtotal = cart.reduce((sum, item) => sum + item.unitTotal * item.quantity, 0);
    const deliveryFee = rest.deliveryFee;
    const total = Math.max(0, subtotal + deliveryFee + tipAmount - discountAmount);

    const now = new Date();
    const formatTime = (date: Date) =>
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: ActiveOrder = {
      id: `CC-${Math.floor(100000 + Math.random() * 900000)}`,
      restaurant: rest,
      items: [...cart],
      subtotal,
      deliveryFee,
      tipAmount,
      discount: discountAmount,
      couponCode: couponCode || undefined,
      total,
      step: 'confirmed',
      createdAt: formatTime(now),
      estimatedDeliveryMinutes: 24,
      driver: {
        name: 'Marcus Rivera',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=140&q=80',
        vehicle: 'Matte Sage Electric Vespa GTS',
        plate: 'CA · 7EV91',
        rating: 4.98,
        tripsCount: 1420,
        phone: '+1 (415) 890-4421',
      },
      deliveryAddress: address,
      riderLocation: {
        lat: rest.coordinates.lat,
        lng: rest.coordinates.lng,
        progress: 0.05,
      },
      stepTimestamps: {
        confirmed: formatTime(now),
        prep: formatTime(new Date(now.getTime() + 4 * 60000)),
        riderAssigned: formatTime(new Date(now.getTime() + 10 * 60000)),
        dispatched: formatTime(new Date(now.getTime() + 14 * 60000)),
        eta: formatTime(new Date(now.getTime() + 24 * 60000)),
      },
    };

    set({
      activeOrder: newOrder,
      isCartOpen: false,
      isTrackerOpen: true,
      activeView: 'track',
    });
  },

  setOrderStep: (step) => {
    set((state) => {
      if (!state.activeOrder) return {};
      let progress = 0.05;
      if (step === 'kitchen-prep') progress = 0.25;
      if (step === 'rider-assigned') progress = 0.5;
      if (step === 'out-for-delivery') progress = 0.78;
      if (step === 'arrived') progress = 1.0;

      return {
        activeOrder: {
          ...state.activeOrder,
          step,
          riderLocation: {
            ...state.activeOrder.riderLocation,
            progress,
          },
        },
      };
    });
  },

  cancelActiveOrder: () => set({ activeOrder: null, isTrackerOpen: false, activeView: 'feed' }),

  // Community
  upvotedDishes: new Set<string>(['dish-1', 'dish-4', 'dish-8']),
  toggleUpvoteDish: (dishId) => {
    set((state) => {
      const next = new Set(state.upvotedDishes);
      if (next.has(dishId)) {
        next.delete(dishId);
      } else {
        next.add(dishId);
      }
      return { upvotedDishes: next };
    });
  },

  favoriteRestaurants: new Set<string>(['rest-1', 'rest-4']),
  toggleFavoriteRestaurant: (restId) => {
    set((state) => {
      const next = new Set(state.favoriteRestaurants);
      if (next.has(restId)) {
        next.delete(restId);
      } else {
        next.add(restId);
      }
      return { favoriteRestaurants: next };
    });
  },

  // Active Main View
  activeView: 'feed',
  setActiveView: (view) => set({ activeView: view }),
}));

