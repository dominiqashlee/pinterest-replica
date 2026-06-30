import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Folder, ShoppingBag, Eye } from 'lucide-react';
import { Pin, Board } from '../types';

interface PinCardProps {
  pin: Pin;
  boards: Board[];
  onSelect: (pin: Pin) => void;
  onSaveToBoard: (pinId: string, boardId: string) => void;
  onLikeToggle: (pinId: string) => void;
  isSavedGlobally: boolean;
  isLikedByUser: boolean;
}

export default function PinCard({
  pin,
  boards,
  onSelect,
  onSaveToBoard,
  onLikeToggle,
  isSavedGlobally,
  isLikedByUser
}: PinCardProps) {
  const [hovered, setHovered] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);

  // Stop click propagation to avoid opening pin details modal
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeToggle(pin.id);
  };

  const handleSaveDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSaveDropdown(!showSaveDropdown);
  };

  const handleSelectBoard = (e: React.MouseEvent, boardId: string) => {
    e.stopPropagation();
    onSaveToBoard(pin.id, boardId);
    setShowSaveDropdown(false);
  };

  return (
    <motion.div
      layout
      id={`pin-${pin.id}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="masonry-item break-inside-avoid mb-6 flex flex-col group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowSaveDropdown(false);
      }}
      onClick={() => onSelect(pin)}
    >
      {/* Visual Image container */}
      <div className="relative w-full overflow-hidden rounded-xl bg-surface-container shadow-sm transition-all duration-300 group-hover:shadow-lg">
        <img
          src={pin.imageUrl}
          alt={pin.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Hover glassmorphic actions layer */}
        <div
          className={`absolute inset-0 z-10 flex flex-col justify-between p-4 bg-gradient-to-t from-black/50 via-black/10 to-black/30 transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Top row: Shop indicator and Board Save */}
          <div className="flex justify-between items-start">
            {pin.price ? (
              <span className="bg-emerald-500/95 text-white text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm shadow-sm">
                <ShoppingBag className="w-3 h-3" /> {pin.price}
              </span>
            ) : (
              <div />
            )}

            <div className="relative">
              <button
                onClick={handleSaveDropdownToggle}
                className="bg-accent-pastel hover:bg-accent-pastel/90 text-on-primary-container text-xs font-bold px-3 py-1.5 rounded-full shadow-md transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                <Folder className="w-3 h-3" /> Save
              </button>

              {/* Quick Save Dropdown */}
              {showSaveDropdown && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white/95 rounded-xl shadow-xl border border-outline-variant/40 py-1.5 z-20 backdrop-blur-md">
                  <p className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest px-3 py-1 border-b border-outline-variant/20 mb-1">
                    Save to Board
                  </p>
                  {boards.length === 0 ? (
                    <button
                      onClick={(e) => handleSelectBoard(e, 'default')}
                      className="w-full text-left text-xs font-semibold px-3 py-1.5 hover:bg-surface-container text-on-surface block"
                    >
                      General Collection
                    </button>
                  ) : (
                    boards.map((b) => (
                      <button
                        key={b.id}
                        onClick={(e) => handleSelectBoard(e, b.id)}
                        className={`w-full text-left text-xs font-semibold px-3 py-1.5 hover:bg-surface-container text-on-surface block truncate ${
                          b.pinIds.includes(pin.id) ? 'text-primary font-bold bg-primary-container/10' : ''
                        }`}
                      >
                        {b.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom row: Quick metrics */}
          <div className="flex justify-between items-center text-white">
            <span className="text-xs font-bold flex items-center gap-1.5 drop-shadow-md">
              <Eye className="w-3.5 h-3.5" /> View details
            </span>

            <button
              onClick={handleLike}
              className={`p-2 rounded-full shadow-md transition-all active:scale-90 cursor-pointer ${
                isLikedByUser
                  ? 'bg-primary text-white scale-110'
                  : 'bg-white/80 hover:bg-white text-on-surface-variant hover:text-primary backdrop-blur-sm'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLikedByUser ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Description below card */}
      <div className="mt-2.5 px-1.5 flex flex-col">
        <h3 className="text-sm font-bold tracking-tight text-on-surface leading-tight truncate">
          {pin.title}
        </h3>

        {/* Creator and Likes */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <img
              src={pin.author.avatarUrl}
              alt={pin.author.name}
              className="w-5 h-5 rounded-full object-cover border border-outline-variant/30 flex-shrink-0"
              referrerPolicy="no-referrer"
            />
            <span className="text-xs text-on-surface-variant font-medium truncate">
              {pin.author.name}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-on-surface-variant/80">
            <Heart className="w-3 h-3 text-primary fill-primary/10" />
            <span>{pin.likes + (isLikedByUser ? 1 : 0)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
