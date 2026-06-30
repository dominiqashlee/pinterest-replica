import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Folder, FolderPlus, Heart, Grid, LayoutGrid, CheckCircle, Plus, ChevronRight, ShoppingBag, Info, Compass } from 'lucide-react';
import { Pin, Board, Comment, UserProfile } from './types';
import { INITIAL_PINS, INITIAL_BOARDS, APP_USER } from './data';

import Navbar from './components/Navbar';
import PinCard from './components/PinCard';
import PinDetailModal from './components/PinDetailModal';
import UploadPinModal from './components/UploadPinModal';
import BoardModal from './components/BoardModal';
import AuthModal from './components/AuthModal';

export default function App() {
  // --- Persistent Storage State ---
  const [pins, setPins] = useState<Pin[]>(() => {
    const saved = localStorage.getItem('pinterest_pins');
    return saved ? JSON.parse(saved) : INITIAL_PINS;
  });

  const [boards, setBoards] = useState<Board[]>(() => {
    const saved = localStorage.getItem('pinterest_boards');
    return saved ? JSON.parse(saved) : INITIAL_BOARDS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('pinterest_user_profile');
    if (saved) return JSON.parse(saved);
    // Not logged in by default to let them experience the gorgeous landing buttons
    return null;
  });

  // --- UI Layout State ---
  const [activeTab, setActiveTab] = useState<'explore' | 'shop' | 'about' | 'saved'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeBoardFilter, setActiveBoardFilter] = useState<string | null>(null);

  // --- Active Interactive Modal States ---
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isBoardOpen, setIsBoardOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  // --- Dynamic Feedback Toast ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Save state updates to LocalStorage ---
  useEffect(() => {
    localStorage.setItem('pinterest_pins', JSON.stringify(pins));
  }, [pins]);

  useEffect(() => {
    localStorage.setItem('pinterest_boards', JSON.stringify(boards));
  }, [boards]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('pinterest_user_profile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('pinterest_user_profile');
    }
  }, [userProfile]);

  // --- Toast Trigger Helper ---
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // --- Authentication Handlers ---
  const handleAuthSuccess = (name: string, email: string) => {
    const newProfile: UserProfile = {
      name,
      email,
      avatarUrl: APP_USER.avatarUrl,
      boards: [],
      likedPinIds: [],
      savedPinIds: []
    };
    setUserProfile(newProfile);
    triggerToast(`Welcome back, ${name}! Your creative space is ready.`);
  };

  const handleLogout = () => {
    setUserProfile(null);
    setActiveTab('explore');
    setActiveBoardFilter(null);
    triggerToast('Logged out successfully.');
  };

  // --- Board Creation ---
  const handleCreateBoard = (name: string, description: string) => {
    const newBoard: Board = {
      id: `board-${Date.now()}`,
      name,
      description,
      pinIds: []
    };
    setBoards([...boards, newBoard]);
    triggerToast(`Created Board: "${name}" successfully!`);
  };

  // --- Pin Custom Upload ---
  const handlePublishPin = (newPin: Pin) => {
    setPins([newPin, ...pins]);
    triggerToast(`Published "${newPin.title}" to discovery feed.`);
  };

  // --- Interaction Event Handlers ---
  const handlePinSaveToBoard = (pinId: string, boardId: string) => {
    if (!userProfile) {
      // Force Login if trying to save
      setAuthMode('signup');
      setIsAuthOpen(true);
      triggerToast('Please create a free account to save curated pins!');
      return;
    }

    if (boardId === 'default' || !boardId) {
      // Save globally
      if (userProfile.savedPinIds.includes(pinId)) {
        triggerToast('Already saved in your general collection.');
        return;
      }
      setUserProfile({
        ...userProfile,
        savedPinIds: [...userProfile.savedPinIds, pinId]
      });
      triggerToast('Pin saved to General Collection.');
    } else {
      // Save inside specific board
      setBoards(
        boards.map((b) => {
          if (b.id === boardId) {
            if (b.pinIds.includes(pinId)) {
              return b; // already exists
            }
            // Update board cover if it didn't have one
            const targetPin = pins.find((p) => p.id === pinId);
            return {
              ...b,
              pinIds: [...b.pinIds, pinId],
              coverUrl: b.coverUrl || targetPin?.imageUrl
            };
          }
          return b;
        })
      );
      const targetBoard = boards.find((b) => b.id === boardId);
      triggerToast(`Saved to board: ${targetBoard?.name}`);
    }
  };

  const handlePinLikeToggle = (pinId: string) => {
    setPins(
      pins.map((p) => {
        if (p.id === pinId) {
          const currentlyLiked = p.likedByUser;
          return {
            ...p,
            likes: currentlyLiked ? Math.max(0, p.likes - 1) : p.likes + 1,
            likedByUser: !currentlyLiked
          };
        }
        return p;
      })
    );

    // If logged in, update profile liked list
    if (userProfile) {
      const isLiked = userProfile.likedPinIds.includes(pinId);
      setUserProfile({
        ...userProfile,
        likedPinIds: isLiked
          ? userProfile.likedPinIds.filter((id) => id !== pinId)
          : [...userProfile.likedPinIds, pinId]
      });
    }
  };

  const handleAddComment = (pinId: string, comment: Comment) => {
    setPins(
      pins.map((p) => {
        if (p.id === pinId) {
          return {
            ...p,
            comments: [...p.comments, comment]
          };
        }
        return p;
      })
    );

    // Sync active selected pin inside modal
    if (selectedPin && selectedPin.id === pinId) {
      setSelectedPin({
        ...selectedPin,
        comments: [...selectedPin.comments, comment]
      });
    }
  };

  // --- Related Pin Selection inside Modal ---
  const handleSelectRelatedPin = (relatedPin: Pin) => {
    setSelectedPin(relatedPin);
  };

  // --- Filtering Discovery Feed ---
  const filteredPins = pins.filter((p) => {
    // 1. Search Query Filter
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Category Filter
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    // 3. Board/Collection Filter (active when in Profile Tab 'saved')
    const matchesBoardFilter =
      activeTab !== 'saved' ||
      !activeBoardFilter ||
      (activeBoardFilter === 'all-saved' && userProfile?.savedPinIds.includes(p.id)) ||
      boards.find((b) => b.id === activeBoardFilter)?.pinIds.includes(p.id);

    return matchesSearch && matchesCategory && matchesBoardFilter;
  });

  const categories = [
    { id: 'all', label: '✨ All Discovery', color: 'bg-surface-container-low text-on-surface' },
    { id: 'soccer', label: '⚽ Soccer Season', color: 'bg-secondary-container text-on-secondary-container' },
    { id: 'fashion', label: '🧥 Fashion & Knits', color: 'bg-primary-container text-on-primary-container' },
    { id: 'interior', label: '🌿 Mindful Spaces', color: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
    { id: 'lifestyle', label: '🎨 Aesthetics', color: 'bg-surface-container-high text-on-surface-variant' },
    { id: 'food', label: '🍵 Matcha & Food', color: 'bg-secondary-fixed text-on-secondary-fixed-variant' }
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-surface-bright flex flex-col font-hanken">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setActiveBoardFilter(null); // Reset profile filter
          setSelectedCategory('all'); // Reset categories
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLoggedIn={!!userProfile}
        userName={userProfile?.name || ''}
        onLoginClick={() => {
          setAuthMode('login');
          setIsAuthOpen(true);
        }}
        onLogoutClick={handleLogout}
        onUploadClick={() => setIsUploadOpen(true)}
        onNewBoardClick={() => setIsBoardOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 pt-6 flex-grow">
        
        {/* TAB 1: EXPLORE & VISUAL DISCOVERY (LANDING) */}
        {activeTab === 'explore' && (
          <div className="space-y-12">
            
            {/* Elegant Hero Banner - Styled directly from screenshot */}
            {!userProfile && (
              <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 pt-10 pb-8 text-center max-w-4xl mx-auto"
              >
                <h1 className="text-4xl sm:text-[54px] font-extrabold tracking-tight mb-6 leading-[1.08] text-on-surface">
                  Create the life you want on Pinterest
                </h1>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto mt-8">
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setIsAuthOpen(true);
                    }}
                    className="bg-accent-pastel hover:bg-accent-pastel/90 text-on-primary-container font-extrabold py-4 px-8 rounded-full w-full sm:w-auto text-base active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    Join Pinterest for free
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setIsAuthOpen(true);
                    }}
                    className="bg-surface-container-low hover:bg-surface-container text-on-surface font-extrabold py-4 px-8 rounded-full w-full sm:w-auto text-base active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    I already have an account
                  </button>
                </div>
              </motion.section>
            )}

            {/* Visual Mosaic Inspiration Collage - Hotlinked from mockup */}
            {!userProfile && (
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden mb-8 max-w-3xl mx-auto rounded-pinterest shadow-sm bg-surface-container-low/30 p-2"
              >
                <div className="flex justify-center">
                  <img
                    alt="Inspiration grid"
                    className="w-full max-w-[500px] h-auto object-contain rounded-pinterest hover:scale-102 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida/AP1WRLfaFaul-qEAVBrPcriRiIM_HajBH1OpkAR3IYx32t-3gpk416SsXxwhwaNeFhtlUDCpHS96hm5IfJFnKqPkI5gO3LoSLaq7Qzc87uyXpGJl66j0gVgWUAAF6OMZIEIVA3nQkMWVwXSFVewUC5l4k3UmT-n6_ANSZQVuPN1qrqZqcsdcgMZb5r7B9p8e1u7AvG11ZrLqwGGixsIRJ4U6ITxHlQB7r9WD22qbSuzbwL1wcnrjF6VRb4-zRY"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.section>
            )}

            {/* Featured Theme Banner: "Step into soccer season" */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-6 py-12 rounded-pinterest text-center bg-surface-container-lowest border border-outline-variant/30 shadow-sm max-w-5xl mx-auto"
            >
              <h2 className="text-3xl sm:text-[46px] font-extrabold tracking-tight mb-3 leading-tight text-on-surface">
                Step into soccer season
              </h2>
              <p className="text-base sm:text-lg text-on-surface-variant max-w-md mx-auto mb-8 font-medium">
                Flex your fandom and score fresh inspiration for every match.
              </p>

              {/* Quick filter trigger */}
              <button
                onClick={() => setSelectedCategory('soccer')}
                className="bg-secondary-container text-on-secondary-container font-extrabold px-6 py-3 rounded-full text-sm inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                Explore Soccer Matches ⚽ <ChevronRight className="w-4 h-4" />
              </button>
            </motion.section>

            {/* Discovery Feed Filters */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                <h3 className="text-xl font-extrabold text-on-surface tracking-tight flex items-center gap-2">
                  <Compass className="w-5 h-5 text-primary" /> Discovery Feed
                </h3>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              {/* Pastel category chips */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 border ${
                      selectedCategory === cat.id
                        ? 'border-primary ring-1 ring-primary shadow-sm scale-102'
                        : 'border-transparent opacity-85 hover:opacity-100 hover:bg-surface-container'
                    } ${cat.color}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Responsive Discovery Masonry Feed */}
            <section className="pb-12">
              {filteredPins.length === 0 ? (
                <div className="text-center py-16 bg-surface-container-low/40 rounded-pinterest p-8 max-w-md mx-auto">
                  <p className="text-sm font-bold text-on-surface">No inspirations found.</p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Try typing another term, or upload your own mockup pin right now!
                  </p>
                </div>
              ) : (
                <div className="masonry-grid">
                  <AnimatePresence mode="popLayout">
                    {filteredPins.map((pin) => (
                      <PinCard
                        key={pin.id}
                        pin={pin}
                        boards={boards}
                        onSelect={(p) => {
                          setSelectedPin(p);
                          setIsDetailOpen(true);
                        }}
                        onSaveToBoard={handlePinSaveToBoard}
                        onLikeToggle={handlePinLikeToggle}
                        isSavedGlobally={userProfile?.savedPinIds.includes(pin.id) || false}
                        isLikedByUser={userProfile?.likedPinIds.includes(pin.id) || false}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 2: SHOP */}
        {activeTab === 'shop' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center py-10 max-w-xl mx-auto space-y-3">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 flex items-center justify-center rounded-full mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
                Aesthetic Shop Feed
              </h1>
              <p className="text-sm text-on-surface-variant font-medium">
                Shop curated, pastel home items, matches accessories, knitwear, and boutique bakery boxes.
              </p>
            </div>

            {/* Shoppable Pin Masonry Feed */}
            <div className="masonry-grid pb-12">
              {pins
                .filter((p) => p.price)
                .map((pin) => (
                  <PinCard
                    key={pin.id}
                    pin={pin}
                    boards={boards}
                    onSelect={(p) => {
                      setSelectedPin(p);
                      setIsDetailOpen(true);
                    }}
                    onSaveToBoard={handlePinSaveToBoard}
                    onLikeToggle={handlePinLikeToggle}
                    isSavedGlobally={userProfile?.savedPinIds.includes(pin.id) || false}
                    isLikedByUser={userProfile?.likedPinIds.includes(pin.id) || false}
                  />
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: ABOUT */}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto py-12 space-y-16 animate-fade-in">
            
            {/* Hero details */}
            <section className="text-center space-y-4">
              <h1 className="text-4xl font-extrabold text-on-surface tracking-tight">
                About Pinterest Landing Page
              </h1>
              <p className="text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                A highly responsive, client-side visual discovery application featuring a serene 
                <strong> Luminous Pastel</strong> layout, full grid alignment, and micro-animations.
              </p>
            </section>

            {/* Features lists */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="bg-white p-8 rounded-pinterest border border-outline-variant/30 space-y-4 shadow-sm">
                <h3 className="text-lg font-extrabold text-on-surface flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" /> High-Fidelity Design
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
                  Matches your mockups in extreme precision. Integrated custom rounded cards (`rounded-xl`), 
                  soft glassmorphism accents, and native **Hanken Grotesk** typography.
                </p>
              </div>

              <div className="bg-white p-8 rounded-pinterest border border-outline-variant/30 space-y-4 shadow-sm">
                <h3 className="text-lg font-extrabold text-on-surface flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" /> Interactive Playground
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
                  Log in simulates custom accounts, lets you publish new pins via drag & drop upload, 
                  create custom collection boards, and leave aesthetic suggestions in the comments!
                </p>
              </div>
            </section>

            {/* Design System Details */}
            <section className="bg-surface-container p-8 rounded-pinterest space-y-4">
              <h2 className="text-xl font-extrabold text-on-surface tracking-tight">
                Luminous Pastel Specs
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-accent-pastel mx-auto mb-2" />
                  <p className="text-xs font-bold text-on-surface">Pastel Coral</p>
                  <p className="text-[10px] text-on-surface-variant/70 mt-0.5">#f8ad9d</p>
                </div>
                <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-[#3e6750] mx-auto mb-2" />
                  <p className="text-xs font-bold text-on-surface">Mint Air</p>
                  <p className="text-[10px] text-on-surface-variant/70 mt-0.5">#3e6750</p>
                </div>
                <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-surface-container-low mx-auto mb-2" />
                  <p className="text-xs font-bold text-on-surface">Soft Blue</p>
                  <p className="text-[10px] text-on-surface-variant/70 mt-0.5">#e7f6ff</p>
                </div>
                <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-on-surface mx-auto mb-2" />
                  <p className="text-xs font-bold text-on-surface">Dark Slate</p>
                  <p className="text-[10px] text-on-surface-variant/70 mt-0.5">#0e1d25</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 4: SAVED / PROFILE */}
        {activeTab === 'saved' && (
          <div className="space-y-8 animate-fade-in pb-12">
            
            {/* User Profile Header */}
            {userProfile ? (
              <div className="bg-white rounded-pinterest p-8 border border-outline-variant/30 shadow-sm max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-pastel/10 rounded-full blur-2xl" />
                
                <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                  <div className="w-16 h-16 bg-accent-pastel text-on-primary-container font-extrabold text-2xl flex items-center justify-center rounded-full shadow-md">
                    {userProfile.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-on-surface">{userProfile.name}</h2>
                    <p className="text-xs font-semibold text-on-surface-variant mt-0.5">{userProfile.email}</p>
                    <div className="flex gap-4 mt-3 justify-center md:justify-start">
                      <span className="text-xs font-bold text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full">
                        📁 {boards.length} Boards
                      </span>
                      <span className="text-xs font-bold text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full">
                        ❤️ {pins.filter(p => p.likedByUser).length} Liked
                      </span>
                    </div>
                  </div>
                </div>

                {/* Create actions */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setIsBoardOpen(true)}
                    className="bg-surface-container hover:bg-surface-container-high text-on-surface font-extrabold text-xs px-4 py-3 rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <FolderPlus className="w-4 h-4" /> Create Board
                  </button>
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="bg-accent-pastel hover:bg-accent-pastel/90 text-on-primary-container font-extrabold text-xs px-4 py-3 rounded-full flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Upload Pin
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-pinterest border border-outline-variant/35 max-w-md mx-auto space-y-4">
                <p className="text-sm font-bold text-on-surface">Sign up to manage your Saved Boards</p>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthOpen(true);
                  }}
                  className="bg-accent-pastel hover:bg-accent-pastel/90 text-on-primary-container font-extrabold text-xs px-6 py-3 rounded-full shadow-md cursor-pointer"
                >
                  Join Pinterest Free
                </button>
              </div>
            )}

            {/* Profile Board / Collection grid */}
            {userProfile && (
              <div className="space-y-6">
                <h3 className="text-lg font-extrabold text-on-surface border-b border-outline-variant/25 pb-2">
                  My Boards
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* General Collection Card */}
                  <div
                    onClick={() => setActiveBoardFilter(activeBoardFilter === 'all-saved' ? null : 'all-saved')}
                    className={`group cursor-pointer rounded-pinterest border overflow-hidden shadow-sm transition-all flex flex-col justify-between h-48 bg-white ${
                      activeBoardFilter === 'all-saved' ? 'border-primary ring-1 ring-primary' : 'border-outline-variant/30 hover:shadow-md'
                    }`}
                  >
                    <div className="bg-surface-container-low h-32 relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="text-primary font-bold text-sm bg-white/90 px-3 py-1.5 rounded-full z-10 shadow-sm flex items-center gap-1.5">
                        <Grid className="w-4 h-4" /> General Collection
                      </div>
                    </div>
                    <div className="p-4 bg-white flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-extrabold text-on-surface">General Saved</h4>
                        <p className="text-[10px] text-on-surface-variant font-semibold">
                          {userProfile.savedPinIds.length} Saved Pins
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Custom Boards */}
                  {boards.map((board) => (
                    <div
                      key={board.id}
                      onClick={() => setActiveBoardFilter(activeBoardFilter === board.id ? null : board.id)}
                      className={`group cursor-pointer rounded-pinterest border overflow-hidden shadow-sm transition-all flex flex-col justify-between h-48 bg-white ${
                        activeBoardFilter === board.id ? 'border-primary ring-1 ring-primary' : 'border-outline-variant/30 hover:shadow-md'
                      }`}
                    >
                      <div className="bg-surface-container-low h-32 relative overflow-hidden flex items-center justify-center">
                        {board.coverUrl ? (
                          <img
                            src={board.coverUrl}
                            alt={board.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-primary-container/10" />
                        )}
                        <div className="absolute inset-0 bg-black/10" />
                        <span className="text-xs font-bold bg-white/90 px-3 py-1.5 rounded-full z-10 shadow-sm block truncate max-w-[80%]">
                          📁 {board.name}
                        </span>
                      </div>
                      <div className="p-4 bg-white flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-extrabold text-on-surface">{board.name}</h4>
                          <p className="text-[10px] text-on-surface-variant font-semibold">
                            {board.pinIds.length} Curations • {board.description || 'No description'}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Filtered Pins inside Board */}
                {activeBoardFilter && (
                  <div className="pt-8 space-y-4">
                    <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                      <h4 className="text-base font-extrabold text-on-surface">
                        Currently Viewing Board Curations:
                      </h4>
                      <button
                        onClick={() => setActiveBoardFilter(null)}
                        className="text-xs font-bold text-primary hover:underline cursor-pointer"
                      >
                        Show All Saved
                      </button>
                    </div>

                    {filteredPins.length === 0 ? (
                      <p className="text-xs text-on-surface-variant italic py-6">
                        No pins currently saved in this board. Click Explore to find and save pins!
                      </p>
                    ) : (
                      <div className="masonry-grid pb-12">
                        {filteredPins.map((pin) => (
                          <PinCard
                            key={pin.id}
                            pin={pin}
                            boards={boards}
                            onSelect={(p) => {
                              setSelectedPin(p);
                              setIsDetailOpen(true);
                            }}
                            onSaveToBoard={handlePinSaveToBoard}
                            onLikeToggle={handlePinLikeToggle}
                            isSavedGlobally={userProfile.savedPinIds.includes(pin.id)}
                            isLikedByUser={userProfile.likedPinIds.includes(pin.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- ALL INTERACTIVE MODALS --- */}

      {/* Detail view Modal */}
      <PinDetailModal
        pin={selectedPin}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedPin(null);
        }}
        boards={boards}
        onSaveToBoard={handlePinSaveToBoard}
        onLikeToggle={handlePinLikeToggle}
        isSavedGlobally={userProfile?.savedPinIds.includes(selectedPin?.id || '') || false}
        isLikedByUser={userProfile?.likedPinIds.includes(selectedPin?.id || '') || false}
        allPins={pins}
        onSelectRelatedPin={handleSelectRelatedPin}
        onAddComment={handleAddComment}
      />

      {/* Auth Account Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />

      {/* Board Creation Modal */}
      <BoardModal
        isOpen={isBoardOpen}
        onClose={() => setIsBoardOpen(false)}
        onCreate={handleCreateBoard}
      />

      {/* Pin Custom Upload Modal */}
      <UploadPinModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handlePublishPin}
      />

      {/* --- INTERACTIVE TOAST NOTIFICATIONS --- */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            id="toast-bubble"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-full text-xs font-bold shadow-2xl z-[150] flex items-center gap-2 border border-outline/20"
          >
            <Sparkles className="w-4 h-4 text-accent-pastel animate-spin-slow" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
