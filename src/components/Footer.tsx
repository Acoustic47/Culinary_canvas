import React from 'react';
import { Sparkles, ShieldCheck, Heart, Navigation, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-24 border-t border-white/10 bg-obsidian-950/90 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-serif text-lg font-bold text-white">CulinaryCanvas</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Redefining food discovery and dining delivery. Celebrating regenerative farms, artisanal kitchens, and bespoke gastronomy delivered with cold-chain precision.
            </p>
          </div>

          {/* Curated Cuisines */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Curated Gastronomy
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li className="hover:text-emerald-400 cursor-pointer transition">Japanese & Nikkei Robata</li>
              <li className="hover:text-emerald-400 cursor-pointer transition">Modern Italian Woodfire</li>
              <li className="hover:text-emerald-400 cursor-pointer transition">Levantine & Coastal Mezze</li>
              <li className="hover:text-emerald-400 cursor-pointer transition">Contemporary Awadhi Dum</li>
              <li className="hover:text-emerald-400 cursor-pointer transition">New Nordic Wild Foraged</li>
            </ul>
          </div>

          {/* Quality Standards */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              The Canvas Standard
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center space-x-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Triple Hygiene Audited</span>
              </li>
              <li className="flex items-center space-x-1.5 text-slate-300">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sub-30 Min Live GPS Dispatch</span>
              </li>
              <li className="flex items-center space-x-1.5 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Layout Shift Interface</span>
              </li>
              <li className="flex items-center space-x-1.5 text-slate-300">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>100% Courier Tip Retention</span>
              </li>
            </ul>
          </div>

          {/* Curated Hubs */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Active Hubs
            </h5>
            <p className="text-xs text-slate-400">
              San Francisco Bay Area · Waterfront Pier · Mission Dolores · SOMA Arts · Nob Hill
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono">
                ● Live Fleet Active (24/7 Dispatch)
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 CulinaryCanvas Inc. Built with Next-Gen React, Tailwind & Framer Motion.
          </div>
          <div className="flex space-x-4">
            <span className="hover:text-slate-300 cursor-pointer">Hygiene Protocols</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

