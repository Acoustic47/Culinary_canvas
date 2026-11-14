# 🌿 CulinaryCanvas — Next-Gen Food Discovery & Dining Web Application

**CulinaryCanvas** is a hyper-smooth, luxury food discovery and delivery web application built as a modern alternative to traditional food aggregators like Zomato. Abandoning aggressive saturated red banners, CulinaryCanvas embraces an obsidian slate palette, electric sage accents, frosted glassmorphism surfaces, and typography blending Plus Jakarta Sans with editorial display serifs (Playfair Display & Fraunces).

Please note: This is a demonstration project, not a live food delivery service. Restaurant listings, orders, delivery tracking, GPS movement, courier communication, and payment-related experiences are simulated using sample data. No real orders or deliveries take place.
---

## 🎨 Visual Identity & Aesthetic System

- **Base Canvas**: Deep obsidian slate (`#070A0F`, `#0B0F17`) and elevated surfaces (`#111723`, `#172030`) with warm ivory text (`#F8F9FA`).
- **Accent Tones**: Vibrant electric sage (`#10B981` / `#059669`) symbolizing culinary freshness and precision, paired with metallic amber / brass (`#F59E0B`) for prestige touches.
- **Glassmorphism**: Bespoke `.glass-panel` and `.glass-panel-elevated` classes with `backdrop-filter: blur(16px)`, subtle 1px border highlights (`rgba(255, 255, 255, 0.08)`), and soft radial ambient lighting.
- **Editorial Typography**: Modern clean sans-serif (**Plus Jakarta Sans**) for UI controls and telemetry, paired with high-contrast display serif (**Playfair Display** & **Fraunces**) for restaurant titles and signature dish headlines.
- **Micro-Interactions**: Framer Motion physics-based card hovers, spring-animated modals, shimmering skeleton screens, and confetti celebratory bursts upon voucher activation.

---

## 🚀 Key Functional Modules

### 1. Dynamic Discovery Feed
- **Curated "Taste Vibes" Carousel**: 6 curated dining moods (*Late Night Cravings*, *Artisan Coffee & Bakes*, *Farm-to-Table*, *High-Protein Bites*, *Guilt-Free Clean Greens*, *Curated Palette*) with ambient colored glow matching card themes and instant feed filtering.
- **Smart Faceting & Filter Bar**:
  - **Dynamic Distance Slider**: Adjust radius from 1 km to 10 km with real-time ETA recalculation (e.g. `14–22 mins`).
  - **Dietary Toggles**: Multi-select pills for *Vegan*, *Halal*, *Jain*, *Keto*, *Gluten-Free*, and *Pure Veg*.
  - **Interactive Budget Meter**: `$`, `$$`, `$$$`, `$$$$` with amber glow highlights.
  - **Cuisine Quick-Chips**: Filter by *Japanese & Nikkei*, *Modern Italian*, *Levantine & Mezze*, *Contemporary Indian*, *New Nordic*, and *Mexican Woodfire*.
  - **Sorting Matrix**: Sort by *Dynamic Match Score*, *Fastest Dispatch / ETA*, *Hygiene Audit*, *Highest Rating*, and *Price*.
- **Search Autocomplete**: Live autocomplete searching across restaurant names, cuisines, and dish titles simultaneously.

### 2. Interactive Menu & Immersive Dish Showcase
- **Story-Style Dish Previews**: High-resolution gallery carousel, spice-level meters (0–3 flame indicators), nutritional macro dashboard (Calories, Protein, Carbs, Lipids), and allergen warnings.
- **Customization Engine**:
  - Portion size selection with dynamic price deltas.
  - Spice calibration selector (*Gentle*, *Subtle*, *Medium*, *Fiery*).
  - Artisan add-on toggles (e.g., *Hokkaido Uni Crown*, *Perigord Truffle*, *Onsen Egg*).
  - Special chef notes input.
  - Live total price calculation.
- **Social Upvote System**: Dynamic community upvote button (*"Must-Try Dish of this spot"*) with persistent counters.

### 3. Live Cart Tray & Persistent Mini-Dock
- **Persistent Floating Mini-Dock**: Appears unobtrusively when items are in tray with quick total badge and one-click expand.
- **Slide-Over Tray Drawer**:
  - Quantity steppers (`+` / `-`) and item removal.
  - **Free Priority Delivery Progress Bar** (progresses toward \$50 threshold).
  - **Artisan Voucher Engine**: Supports `CULINARY10` (10% off), `SAGEFREE` (Free delivery), and `LUXEBITE` (\$15 off \$40+) with celebratory confetti animation.
  - **Courier Tip Selector**: \$2, \$4, \$6, \$8 with 100% courier retention notice.
  - Instant transition into the live order dispatch canvas.

### 4. Live Order Tracking & Real-Time Status Canvas
- **Milestone Stepper**: Glowing animated stepper (*Order Confirmed → Kitchen Prep → Courier Assigned → Out for Delivery → Arrived*).
- **Simulated Interactive GPS Map**:
  - Dark-mode cartographic street grid with glowing neon route line.
  - Pulsing beacon on the courier avatar (Marcus Rivera on Electric Vespa).
  - Real-time coordinate interpolation along waypoints.
  - Live countdown timer with real-time ticking ETA.
- **Courier Telemetry & Direct Communication**:
  - **Simulated Voice Call**: Interactive call dialog with live animated audio waveform, timer, and mute toggles.
  - **Driver Live Chat**: Interactive messaging drawer with instant intelligent courier replies and quick suggestion chips.
  - **Delivery Instructions**: Contactless toggle and custom notes.
  - **Share Live Link**: One-click clipboard copy.
- **Interactive Demo Simulator**: Step buttons to manually test any milestone or run automated cycle progression.

### 5. Community "BiteReviews" & Social Proof
- Verified diner purchase tags with date and rating stars.
- Must-try dish recommendation highlight tags.
- Sensory scorecards: *Taste Perfection (99.4%)*, *Presentation & Craft (98.8%)*, *Thermal Packaging (99.1%)*, and *Courier Speed (97.6%)*.
- Restaurant hygiene audit badge (*"5.0 ★ Exceptional — Triple-Audited"*).

---

## 🛠️ Tech Stack

- **Framework**: React 18+ with TypeScript (Vite 8)
- **Styling**: Tailwind CSS 3.4 with custom color tokens, gradients, and typography
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Celebration**: Canvas-Confetti

---

## 🏃 Quick Start Guide

### Development Server
```bash
cd culinary-canvas
npm run dev
```


### Production Build
```bash
cd culinary-canvas
npm run build
npm run preview
```
