import React from 'react';
import { Compass, ShoppingBag, Info, User, Search, LogOut, Plus, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'shop' | 'about' | 'saved';
  onTabChange: (tab: 'explore' | 'shop' | 'about' | 'saved') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoggedIn: boolean;
  userName: string;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onUploadClick: () => void;
  onNewBoardClick: () => void;
}

export default function Navbar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  isLoggedIn,
  userName,
  onLoginClick,
  onLogoutClick,
  onUploadClick,
  onNewBoardClick
}: NavbarProps) {
  return (
    <>
      {/* Top Header - Sticky bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-outline-variant/35 px-4 py-3 max-w-7xl mx-auto w-full rounded-b-xl flex flex-col md:flex-row justify-between items-center gap-3 shadow-sm">
        <div className="flex items-center justify-between w-full md:w-auto gap-6">
          {/* Brand Logo */}
          <div
            onClick={() => onTabChange('explore')}
            className="flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform"
          >
            <div className="w-9 h-9 rounded-full bg-accent-pastel text-on-primary-container flex items-center justify-center shadow-md">
              <svg aria-hidden="true" className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M0 12c0 5.123 3.211 9.497 7.73 11.218-.105-.958-.199-2.425.041-3.47.218-.944 1.41-5.973 1.41-5.973s-.36-.723-.36-1.792c0-1.677.973-2.93 2.184-2.93 1.03 0 1.527.773 1.527 1.7 0 1.035-.659 2.583-.998 4.02-.284 1.2.6 2.177 1.782 2.177 2.14 0 3.782-2.254 3.782-5.508 0-2.88-2.07-4.894-5.024-4.894-3.422 0-5.43 2.566-5.43 5.219 0 1.033.397 2.143.893 2.746.098.118.112.222.083.344-.09.375-.293 1.187-.33 1.348-.048.21-.16.255-.37.158-1.38-.643-2.242-2.662-2.242-4.283 0-3.487 2.535-6.689 7.303-6.689 3.832 0 6.812 2.73 6.812 6.381 0 3.808-2.398 6.874-5.73 6.874-1.118 0-2.17-.582-2.529-1.265 0 0-.554 2.107-.689 2.622-.25.96-.922 2.163-1.372 2.898A11.977 11.977 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12z" />
              </svg>
            </div>
            <span className="text-on-surface font-extrabold text-xl tracking-tighter">
              Pinterest
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 font-extrabold text-sm">
            <button
              onClick={() => onTabChange('explore')}
              className={`px-4 py-2 rounded-full transition-colors cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-accent-pastel text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => onTabChange('shop')}
              className={`px-4 py-2 rounded-full transition-colors cursor-pointer ${
                activeTab === 'shop'
                  ? 'bg-accent-pastel text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => onTabChange('about')}
              className={`px-4 py-2 rounded-full transition-colors cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-accent-pastel text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              About
            </button>
          </nav>
        </div>

        {/* Search Bar & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto md:max-w-md flex-1 justify-end">
          {/* Quick Search */}
          <div className="relative w-full max-w-xs md:max-w-md">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search inspiration..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-full border border-outline-variant bg-surface-container-low focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all text-on-surface"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant hover:text-on-surface"
              >
                Clear
              </button>
            )}
          </div>

          {/* Creation & Account buttons */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <button
                  onClick={onUploadClick}
                  title="Create Pin"
                  className="bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-full transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onTabChange('saved')}
                  title="My Profile & Boards"
                  className={`flex items-center gap-1.5 p-1 rounded-full transition-all cursor-pointer border ${
                    activeTab === 'saved' ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-accent-pastel text-on-primary-container flex items-center justify-center font-bold text-xs shadow-inner">
                    {userName[0]?.toUpperCase()}
                  </div>
                </button>

                <button
                  onClick={onLogoutClick}
                  title="Log Out"
                  className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-error transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-accent-pastel hover:bg-accent-pastel/90 text-on-primary-container font-extrabold text-xs px-4 py-2.5 rounded-full shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Join Free
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Footer Bottom Navigation (matches user mockup style) */}
      <footer className="fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md border-t border-outline-variant/35 px-4 py-2.5 md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
        <div className="flex justify-around items-center">
          <button
            onClick={() => onTabChange('explore')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'explore' ? 'text-primary font-extrabold scale-105' : 'text-on-surface-variant'
            }`}
          >
            <Compass className="w-5.5 h-5.5" />
            <span className="text-[10px]">Explore</span>
          </button>

          <button
            onClick={() => onTabChange('shop')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'shop' ? 'text-primary font-extrabold scale-105' : 'text-on-surface-variant'
            }`}
          >
            <ShoppingBag className="w-5.5 h-5.5" />
            <span className="text-[10px]">Shop</span>
          </button>

          <button
            onClick={() => onTabChange('about')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'about' ? 'text-primary font-extrabold scale-105' : 'text-on-surface-variant'
            }`}
          >
            <Info className="w-5.5 h-5.5" />
            <span className="text-[10px]">About</span>
          </button>

          <button
            onClick={() => {
              if (isLoggedIn) {
                onTabChange('saved');
              } else {
                onLoginClick();
              }
            }}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'saved' ? 'text-primary font-extrabold scale-105' : 'text-on-surface-variant'
            }`}
          >
            <User className="w-5.5 h-5.5" />
            <span className="text-[10px]">{isLoggedIn ? 'Profile' : 'Log In'}</span>
          </button>
        </div>
      </footer>
    </>
  );
}
