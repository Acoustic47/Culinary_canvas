import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Phone, 
  MessageSquare, 
  Share2, 
  FileText, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Bike, 
  CheckCircle2, 
  ChevronRight,
  Flame,
  UtensilsCrossed,
  Play,
  RotateCcw
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { OrderStep } from '../types';
import { DriverCommunicationModal } from './DriverCommunicationModal';
import { formatCurrency } from '../lib/utils';

export const LiveTracker: React.FC = () => {
  const { activeOrder, setActiveView, setOrderStep, cancelActiveOrder } = useAppStore();

  const [activeModalType, setActiveModalType] = useState<'call' | 'chat' | 'instructions' | 'share' | null>(null);
  const [etaRemainingSeconds, setEtaRemainingSeconds] = useState(840); // 14 mins initial
  const [isSimulating, setIsSimulating] = useState(true);

  // SVG Waypoints for courier route simulation
  // From Restaurant (top-left) to Customer (bottom-right)
  const routeWaypoints = [
    { x: 120, y: 80 },
    { x: 220, y: 110 },
    { x: 320, y: 170 },
    { x: 440, y: 220 },
    { x: 540, y: 280 },
    { x: 680, y: 320 },
  ];

  // Rider position progress (0 to 1) based on current step
  const getProgressFromStep = (step: OrderStep): number => {
    switch (step) {
      case 'confirmed': return 0.05;
      case 'kitchen-prep': return 0.22;
      case 'rider-assigned': return 0.45;
      case 'out-for-delivery': return 0.78;
      case 'arrived': return 1.0;
      default: return 0.05;
    }
  };

  const currentStep = activeOrder?.step || 'confirmed';
  const progress = getProgressFromStep(currentStep);

  // Calculate rider's current SVG coordinate along waypoints
  const getCoordinatesAlongRoute = (prog: number) => {
    const totalSegments = routeWaypoints.length - 1;
    const scaledProg = prog * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaledProg), totalSegments - 1);
    const subProg = scaledProg - segmentIndex;

    const p1 = routeWaypoints[segmentIndex];
    const p2 = routeWaypoints[segmentIndex + 1];

    return {
      x: p1.x + (p2.x - p1.x) * subProg,
      y: p1.y + (p2.y - p1.y) * subProg,
    };
  };

  const riderCoord = getCoordinatesAlongRoute(progress);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Automated order lifecycle progression simulation
  useEffect(() => {
    if (!isSimulating || !activeOrder) return;

    const steps: OrderStep[] = ['confirmed', 'kitchen-prep', 'rider-assigned', 'out-for-delivery', 'arrived'];
    const currentIdx = steps.indexOf(currentStep);

    if (currentIdx < steps.length - 1) {
      const advanceTimer = setTimeout(() => {
        setOrderStep(steps[currentIdx + 1]);
      }, 7000); // advance every 7 seconds for visual delight

      return () => clearTimeout(advanceTimer);
    }
  }, [isSimulating, currentStep, activeOrder, setOrderStep]);

  if (!activeOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h3 className="font-serif text-2xl font-bold text-white">No Active Dispatch</h3>
        <p className="text-xs text-slate-400 mt-2">Place an order from any artisan restaurant to monitor live GPS tracking.</p>
        <button
          onClick={() => setActiveView('feed')}
          className="mt-6 px-4 py-2 rounded-xl bg-emerald-500 text-obsidian-950 font-bold text-xs"
        >
          Return to Discovery Feed
        </button>
      </div>
    );
  }

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const stepsList: { id: OrderStep; label: string; sub: string; icon: any }[] = [
    { id: 'confirmed', label: 'Order Confirmed', sub: activeOrder.stepTimestamps.confirmed, icon: CheckCircle2 },
    { id: 'kitchen-prep', label: 'Kitchen Woodfire & Prep', sub: activeOrder.stepTimestamps.prep, icon: Flame },
    { id: 'rider-assigned', label: 'Courier Assigned', sub: activeOrder.stepTimestamps.riderAssigned, icon: Bike },
    { id: 'out-for-delivery', label: 'Traversing Live Route', sub: activeOrder.stepTimestamps.dispatched, icon: MapPin },
    { id: 'arrived', label: 'Arrived at Concierge', sub: activeOrder.stepTimestamps.eta, icon: Sparkles },
  ];

  const currentStepIndex = stepsList.findIndex((s) => s.id === currentStep);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Navigation Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveView('feed')}
            className="p-2.5 rounded-xl glass-pill hover:bg-white/10 text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-xl sm:text-2xl font-bold text-white">
                Dispatch Order #{activeOrder.id}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                Live GPS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Dispatched from <strong className="text-slate-200">{activeOrder.restaurant.name}</strong>
            </p>
          </div>
        </div>

        {/* Live ETA Card */}
        <div className="flex items-center space-x-4 bg-obsidian-900 border border-white/10 px-4 py-2.5 rounded-2xl shadow-glass">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Live Arrival ETA
            </div>
            <div className="font-mono text-xl sm:text-2xl font-black text-emerald-400 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>{currentStep === 'arrived' ? 'Delivered!' : `${formatTimer(etaRemainingSeconds)} mins`}</span>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10"></div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Destination
            </div>
            <div className="text-xs text-slate-200 font-medium truncate max-w-[140px]">
              {activeOrder.deliveryAddress}
            </div>
          </div>
        </div>
      </div>

      {/* Developer Simulation Bar */}
      <div className="glass-panel p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs border border-white/10">
        <div className="flex items-center space-x-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="font-semibold">Interactive Demo Simulator:</span>
          <span className="text-slate-400">Step through order milestones:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {stepsList.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => {
                setOrderStep(step.id);
                setIsSimulating(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                currentStep === step.id
                  ? 'bg-emerald-500 text-obsidian-950 font-bold shadow-sage-glow'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              {idx + 1}. {step.label}
            </button>
          ))}

          <button
            onClick={() => {
              setOrderStep('confirmed');
              setIsSimulating(true);
              setEtaRemainingSeconds(840);
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            title="Reset Simulator Cycle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Tracker Grid: Left Animated Canvas + Right Courier Card & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Visual Stepper + Interactive Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Animated Visual Stepper */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10">
            <div className="grid grid-cols-5 gap-2 sm:gap-4 relative">
              {/* Stepper connecting background bar */}
              <div className="absolute top-5 left-6 right-6 h-0.5 bg-obsidian-700 -z-0"></div>
              {/* Active filled line */}
              <motion.div
                className="absolute top-5 left-6 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-300 -z-0"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStepIndex / 4) * 100}%` }}
                transition={{ duration: 0.6 }}
              />

              {stepsList.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const IconComponent = step.icon;

                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
                    <motion.div
                      animate={{ scale: isCurrent ? [1, 1.15, 1] : 1 }}
                      transition={{ duration: 2, repeat: isCurrent ? Infinity : 0 }}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-obsidian-950 font-bold shadow-sage-glow'
                          : 'bg-obsidian-850 text-slate-500 border border-white/10'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </motion.div>

                    <span
                      className={`text-[11px] font-bold mt-2 line-clamp-1 ${
                        isCurrent
                          ? 'text-emerald-400'
                          : isCompleted
                          ? 'text-slate-200'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[10px] text-slate-500 hidden sm:inline">
                      {step.sub}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Simulated Interactive Delivery Map Canvas */}
          <div className="relative h-96 sm:h-[420px] w-full rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl bg-[#080B11]">
            {/* Map Cartographic Grid overlay */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(#233045 1px, transparent 1px), linear-gradient(90deg, #233045 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            ></div>

            {/* City District Road Network Mock SVG */}
            <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
              <defs>
                {/* Glowing neon green gradient for route */}
                <linearGradient id="neonRoute" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>

                {/* Filter for glowing neon stroke */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* City secondary background streets */}
              <g stroke="#172233" strokeWidth="3" fill="none">
                <path d="M 50,50 L 750,50 M 50,150 L 750,150 M 50,250 L 750,250 M 50,350 L 750,350" />
                <path d="M 100,20 L 100,380 M 250,20 L 250,380 M 400,20 L 400,380 M 550,20 L 550,380 M 700,20 L 700,380" />
                <path d="M 60,300 Q 300,100 740,320" stroke="#1c283c" strokeWidth="4" />
              </g>

              {/* District Labels */}
              <text x="130" y="45" fill="#4B5563" fontSize="11" fontFamily="sans-serif" letterSpacing="1">WATERFRONT HARBOR</text>
              <text x="360" y="130" fill="#4B5563" fontSize="11" fontFamily="sans-serif" letterSpacing="1">FINANCIAL CORE</text>
              <text x="560" y="370" fill="#4B5563" fontSize="11" fontFamily="sans-serif" letterSpacing="1">SOMA ARTS QUARTER</text>

              {/* Active Delivery Route Polyline */}
              <path
                d="M 120,80 L 220,110 L 320,170 L 440,220 L 540,280 L 680,320"
                fill="none"
                stroke="rgba(16, 185, 129, 0.25)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 120,80 L 220,110 L 320,170 L 440,220 L 540,280 L 680,320"
                fill="none"
                stroke="url(#neonRoute)"
                strokeWidth="4"
                strokeDasharray="8 6"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              >
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="3s" repeatCount="indefinite" />
              </path>

              {/* 1. Restaurant Origin Pin */}
              <g transform="translate(120, 80)">
                <circle r="18" fill="rgba(245, 158, 11, 0.2)" />
                <circle r="9" fill="#F59E0B" />
                <circle r="4" fill="#0B0F17" />
                <text x="18" y="5" fill="#F59E0B" fontSize="12" fontWeight="bold">
                  {activeOrder.restaurant.name}
                </text>
              </g>

              {/* 2. Customer Destination Pin */}
              <g transform="translate(680, 320)">
                <circle r="22" fill="rgba(16, 185, 129, 0.25)" />
                <circle r="10" fill="#10B981" />
                <circle r="4" fill="#FFFFFF" />
                <text x="-140" y="5" fill="#34D399" fontSize="12" fontWeight="bold">
                  Delivery Destination
                </text>
              </g>

              {/* 3. Smooth Moving Rider Marker */}
              <g transform={`translate(${riderCoord.x}, ${riderCoord.y})`}>
                {/* Pulsing beacon circles */}
                <circle r="24" fill="rgba(16, 185, 129, 0.3)">
                  <animate attributeName="r" values="16;28;16" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7;0.1;0.7" dur="2s" repeatCount="indefinite" />
                </circle>

                <circle r="14" fill="#10B981" stroke="#0B0F17" strokeWidth="2" filter="url(#glow)" />
                
                {/* Vespa / Bike Icon representation */}
                <path
                  d="M -6,-2 L 6,-2 L 3,4 L -3,4 Z"
                  fill="#0B0F17"
                />
              </g>
            </svg>

            {/* Map Top Floating Telemetry Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 text-xs">
              <div className="bg-obsidian-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center space-x-2 text-slate-200">
                <Bike className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium">Marcus Rivera · 28 km/h</span>
              </div>
              <div className="bg-obsidian-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center space-x-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-mono font-bold">Cold-Chain Insulated 4°C</span>
              </div>
            </div>

            {/* Map Bottom Status Toast */}
            <div className="absolute bottom-4 left-4 right-4 bg-obsidian-950/90 backdrop-blur-xl p-3 rounded-2xl border border-white/15 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <span className="text-slate-300 font-medium">
                  {currentStep === 'arrived'
                    ? 'Package safely dropped off at concierge. Enjoy your dining!'
                    : 'Electric courier equipped with thermal sensor bag & live tamper seal.'}
                </span>
              </div>

              <span className="font-mono text-emerald-400 font-bold hidden sm:inline">
                {Math.round(progress * 100)}% route completed
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Courier Card, Actions & Receipt Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* 1. Courier Identity Card */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center space-x-3.5">
              <img
                src={activeOrder.driver.photo}
                alt={activeOrder.driver.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-sage-glow"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-base truncate">
                    {activeOrder.driver.name}
                  </h4>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
                    ★ {activeOrder.driver.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{activeOrder.driver.vehicle}</p>
                <p className="text-[11px] text-slate-500">{activeOrder.driver.plate} · {activeOrder.driver.tripsCount} deliveries</p>
              </div>
            </div>

            {/* Quick Action Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setActiveModalType('call')}
                className="py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 hover:text-obsidian-950 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition flex items-center justify-center space-x-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Driver</span>
              </button>

              <button
                onClick={() => setActiveModalType('chat')}
                className="py-2.5 px-3 rounded-xl glass-pill hover:bg-white/10 text-slate-200 font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Live Chat</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveModalType('instructions')}
                className="py-2 px-3 rounded-xl glass-pill hover:bg-white/10 text-slate-300 text-[11px] transition flex items-center justify-center space-x-1.5"
              >
                <FileText className="w-3 h-3 text-amber-400" />
                <span>Instructions</span>
              </button>

              <button
                onClick={() => setActiveModalType('share')}
                className="py-2 px-3 rounded-xl glass-pill hover:bg-white/10 text-slate-300 text-[11px] transition flex items-center justify-center space-x-1.5"
              >
                <Share2 className="w-3 h-3 text-emerald-400" />
                <span>Share Link</span>
              </button>
            </div>
          </div>

          {/* 2. Order Breakdown & Receipt */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-serif text-base font-bold text-white">Itemized Canvas</span>
              <span className="text-xs text-slate-400">{activeOrder.items.length} dishes</span>
            </div>

            {/* Dish items in order */}
            <div className="space-y-3 max-h-56 overflow-y-auto custom-scrollbar pr-1">
              {activeOrder.items.map((item) => (
                <div key={item.cartItemId} className="flex items-start justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200">
                      {item.quantity}x {item.dish.name}
                    </span>
                    <p className="text-[10px] text-emerald-400">
                      {item.customization.portion.name}
                    </p>
                    {item.customization.selectedAddOns.length > 0 && (
                      <p className="text-[10px] text-slate-400 truncate">
                        +{item.customization.selectedAddOns.map((a) => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-mono font-medium text-slate-300">
                    {formatCurrency(item.unitTotal * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing receipt totals */}
            <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-slate-200">{formatCurrency(activeOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-mono text-slate-200">
                  {activeOrder.deliveryFee === 0 ? 'FREE' : formatCurrency(activeOrder.deliveryFee)}
                </span>
              </div>
              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Voucher ({activeOrder.couponCode})</span>
                  <span className="font-mono">-{formatCurrency(activeOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Driver Tip</span>
                <span className="font-mono text-slate-200">{formatCurrency(activeOrder.tipAmount)}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                <span>Paid via Apple Pay</span>
                <span className="font-mono text-emerald-400 text-base">
                  {formatCurrency(activeOrder.total)}
                </span>
              </div>
            </div>

            {/* Cancel Order Action */}
            <button
              onClick={cancelActiveOrder}
              className="w-full text-center text-[11px] text-slate-500 hover:text-rose-400 transition pt-2"
            >
              Cancel Order & Return to Discovery
            </button>
          </div>
        </div>
      </div>

      {/* Driver Interactive Modal Dialog */}
      {activeModalType && (
        <DriverCommunicationModal
          type={activeModalType}
          isOpen={!!activeModalType}
          onClose={() => setActiveModalType(null)}
          driver={activeOrder.driver}
          orderId={activeOrder.id}
        />
      )}
    </div>
  );
};

