import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MessageCircle, Share2, Folder, ExternalLink, Calendar, Send } from 'lucide-react';
import { Pin, Board, Comment } from '../types';

interface PinDetailModalProps {
  pin: Pin | null;
  isOpen: boolean;
  onClose: () => void;
  boards: Board[];
  onSaveToBoard: (pinId: string, boardId: string) => void;
  onLikeToggle: (pinId: string) => void;
  isSavedGlobally: boolean;
  isLikedByUser: boolean;
  allPins: Pin[];
  onSelectRelatedPin: (pin: Pin) => void;
  onAddComment: (pinId: string, comment: Comment) => void;
}

export default function PinDetailModal({
  pin,
  isOpen,
  onClose,
  boards,
  onSaveToBoard,
  onLikeToggle,
  isSavedGlobally,
  isLikedByUser,
  allPins,
  onSelectRelatedPin,
  onAddComment
}: PinDetailModalProps) {
  const [newComment, setNewComment] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);

  if (!pin) return null;

  // Filter related pins in the same category (excluding current pin)
  const relatedPins = allPins
    .filter((p) => p.category === pin.category && p.id !== pin.id)
    .slice(0, 4);

  const handleShare = () => {
    // Copy a fake aesthetic link to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/pins/${pin.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: 'You (Curator)',
      content: newComment.trim(),
      createdAt: 'Just now'
    };

    onAddComment(pin.id, comment);
    setNewComment('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="pin-detail-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Blur backdrop */}
          <motion.div
            id="detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            id="detail-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-5xl rounded-pinterest border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 max-h-[92vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              id="detail-close-btn"
              onClick={onClose}
              className="absolute top-4 right-4 p-2.5 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-surface z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Inner Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              {/* Left side: Visual media banner */}
              <div className="md:col-span-6 bg-surface-container-low flex items-center justify-center relative min-h-[350px] md:max-h-[600px] overflow-hidden rounded-t-pinterest md:rounded-l-pinterest md:rounded-tr-none">
                <img
                  src={pin.imageUrl}
                  alt={pin.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover max-h-[600px]"
                />
                <div className="absolute top-4 left-4">
                  {pin.price && (
                    <span className="bg-emerald-500 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1 backdrop-blur-sm">
                      <ExternalLink className="w-3.5 h-3.5" /> Shoppable • {pin.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Right side: Detailed curation panels */}
              <div className="md:col-span-6 p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-outline-variant/30 max-h-[600px] overflow-y-auto">
                <div className="space-y-6">
                  {/* Row 1: Actions */}
                  <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onLikeToggle(pin.id)}
                        className={`p-2.5 rounded-full transition-all active:scale-90 cursor-pointer ${
                          isLikedByUser
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLikedByUser ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={handleShare}
                        className="p-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all cursor-pointer relative"
                      >
                        <Share2 className="w-4 h-4" />
                        {copied && (
                          <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] font-bold px-2 py-1 rounded-md shadow-md animate-fade-in whitespace-nowrap">
                            Link Copied!
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Board selector */}
                    <div className="relative">
                      <button
                        onClick={() => setShowSaveDropdown(!showSaveDropdown)}
                        className="bg-accent-pastel hover:bg-accent-pastel/90 text-on-primary-container font-extrabold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        <Folder className="w-3.5 h-3.5" /> Save To Board
                      </button>

                      {showSaveDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white/95 rounded-xl shadow-xl border border-outline-variant/40 py-1.5 z-30 backdrop-blur-md">
                          <p className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest px-3 py-1 border-b border-outline-variant/20 mb-1">
                            Save to Board
                          </p>
                          {boards.length === 0 ? (
                            <button
                              onClick={() => {
                                onSaveToBoard(pin.id, 'default');
                                setShowSaveDropdown(false);
                              }}
                              className="w-full text-left text-xs font-semibold px-3 py-1.5 hover:bg-surface-container text-on-surface block"
                            >
                              General Collection
                            </button>
                          ) : (
                            boards.map((b) => (
                              <button
                                key={b.id}
                                onClick={() => {
                                  onSaveToBoard(pin.id, b.id);
                                  setShowSaveDropdown(false);
                                }}
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

                  {/* Creator Account */}
                  <div className="flex items-center gap-3">
                    <img
                      src={pin.author.avatarUrl}
                      alt={pin.author.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-outline-variant/50"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">{pin.author.name}</h4>
                      <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Curated on Pinterest
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-on-surface leading-snug">
                      {pin.title}
                    </h1>
                    <p className="text-sm text-on-surface-variant leading-relaxed mt-3.5">
                      {pin.description}
                    </p>
                  </div>

                  {/* Accent tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {pin.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-surface-container-low text-on-tertiary-container text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer hover:bg-surface-container transition-colors"
                      >
                        #{tag.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>

                  {/* Comments Section */}
                  <div className="border-t border-outline-variant/20 pt-6">
                    <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-on-surface-variant" />
                      Comments ({pin.comments.length})
                    </h3>

                    {pin.comments.length === 0 ? (
                      <p className="text-xs text-on-surface-variant italic py-2">
                        No comments yet. Start the conversation with some creative feedback!
                      </p>
                    ) : (
                      <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
                        {pin.comments.map((comment) => (
                          <div key={comment.id} className="text-xs flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-accent-pastel/20 text-primary font-bold flex items-center justify-center flex-shrink-0">
                              {comment.author[0]}
                            </div>
                            <div className="bg-surface-container-low rounded-xl p-2.5 flex-1">
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="font-extrabold text-on-surface">{comment.author}</span>
                                <span className="text-[9px] text-on-surface-variant/75">{comment.createdAt}</span>
                              </div>
                              <p className="text-on-surface-variant font-medium leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Comment Input */}
                <form onSubmit={handleSubmitComment} className="mt-4 pt-4 border-t border-outline-variant/10 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add an aesthetic comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    maxLength={140}
                    className="flex-1 px-4 py-2.5 rounded-full border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-xs font-medium transition-all"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-full bg-accent-pastel text-on-primary-container hover:bg-accent-pastel/90 shadow-md active:scale-90 transition-all cursor-pointer flex items-center justify-center"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Related Pins Section below */}
            {relatedPins.length > 0 && (
              <div className="p-8 border-t border-outline-variant/20 bg-surface-container-low/20">
                <h3 className="text-lg font-extrabold tracking-tight text-on-surface mb-6">
                  More like this
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {relatedPins.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectRelatedPin(item)}
                      className="group cursor-pointer flex flex-col space-y-1.5"
                    >
                      <div className="rounded-xl overflow-hidden aspect-[4/5] bg-surface-container shadow-sm group-hover:shadow-md transition-all">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="text-xs font-extrabold text-on-surface truncate px-1">
                        {item.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
