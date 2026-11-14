export type DietaryType = 'Vegan' | 'Halal' | 'Jain' | 'Keto' | 'Gluten-Free' | 'Pure Veg';

export type PriceTier = '$' | '$$' | '$$$' | '$$$$';

export type TasteVibeId = 'all' | 'late-night' | 'artisan-bakes' | 'farm-to-table' | 'high-protein' | 'clean-greens';

export interface MacroBreakdown {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface PortionOption {
  id: string;
  name: string;
  label: string;
  priceDelta: number;
}

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
}

export interface Dish {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  image: string;
  gallery: string[];
  cuisine: string;
  category: 'Signature' | 'Appetizers' | 'Mains' | 'Woodfired' | 'Desserts' | 'Artisan Elixirs';
  dietary: DietaryType[];
  spiceLevel: 0 | 1 | 2 | 3; // 0=None, 1=Mild, 2=Medium, 3=Fiery
  macros: MacroBreakdown;
  allergens: string[];
  prepTime: string;
  isChefSpecial: boolean;
  isMustTry: boolean;
  upvotes: number;
  portionSizes: PortionOption[];
  availableAddOns: AddOnOption[];
}

export interface BiteReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  verifiedPurchase: boolean;
  dishRecommended: string;
  comment: string;
  photos?: string[];
  helpfulCount: number;
  metrics?: {
    taste: number;
    presentation: number;
    temperature: number;
    speed: number;
  };
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  description: string;
  cuisines: string[];
  heroImage: string;
  logo: string;
  rating: number;
  reviewCount: number;
  hygieneRating: string; // e.g. "5.0 ★ Triple-Audited"
  priceTier: PriceTier;
  distanceKm: number; // base distance
  deliveryFee: number;
  minimumOrder: number;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  dietaryBadges: DietaryType[];
  vibes: TasteVibeId[];
  isFeatured?: boolean;
  popularDishNames: string[];
  reviews: BiteReview[];
}

export interface CartCustomization {
  portion: PortionOption;
  spiceLevel: number;
  selectedAddOns: AddOnOption[];
  specialInstructions: string;
}

export interface CartItem {
  cartItemId: string; // unique ID per customized item
  dish: Dish;
  quantity: number;
  customization: CartCustomization;
  unitTotal: number;
}

export type OrderStep = 'confirmed' | 'kitchen-prep' | 'rider-assigned' | 'out-for-delivery' | 'arrived';

export interface DriverInfo {
  name: string;
  photo: string;
  vehicle: string;
  plate: string;
  rating: number;
  tripsCount: number;
  phone: string;
}

export interface ActiveOrder {
  id: string;
  restaurant: Restaurant;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tipAmount: number;
  discount: number;
  couponCode?: string;
  total: number;
  step: OrderStep;
  createdAt: string;
  estimatedDeliveryMinutes: number;
  driver: DriverInfo;
  deliveryAddress: string;
  riderLocation: {
    lat: number;
    lng: number;
    progress: number; // 0 to 1
  };
  stepTimestamps: {
    confirmed: string;
    prep: string;
    riderAssigned: string;
    dispatched: string;
    eta: string;
  };
}

export interface FilterState {
  searchQuery: string;
  selectedVibe: TasteVibeId;
  selectedCuisine: string;
  maxDistanceKm: number;
  selectedDietary: DietaryType[];
  budgetTier: PriceTier[];
  sortBy: 'dynamic-match' | 'delivery-speed' | 'hygiene' | 'rating' | 'price-asc';
}

