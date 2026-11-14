import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/Navbar';
import { DiscoveryFeed } from './components/DiscoveryFeed';
import { RestaurantDetailView } from './components/RestaurantDetailView';
import { LiveTracker } from './components/LiveTracker';
import { DishModal } from './components/DishModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const { 
    activeView, 
    closeDishModal, 
    setIsCartOpen, 
    activeDishModal, 
    isCartOpen 
  } = useAppStore();

  // Keyboard accessibility: ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeDishModal) closeDishModal();
        if (isCartOpen) setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDishModal, isCartOpen, closeDishModal, setIsCartOpen]);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeView === 'feed' && <DiscoveryFeed />}
        {activeView === 'restaurant' && <RestaurantDetailView />}
        {activeView === 'track' && <LiveTracker />}
      </main>

      {/* Global Interactive Overlays */}
      <DishModal />
      <CartDrawer />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
