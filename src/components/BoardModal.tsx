import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FolderPlus } from 'lucide-react';

interface BoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

export default function BoardModal({ isOpen, onClose, onCreate }: BoardModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Board name is required.');
      return;
    }
    onCreate(name.trim(), description.trim());
    setName('');
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="board-modal-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            id="board-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-inverse-surface/45 backdrop-blur-md"
          />

          <motion.div
            id="board-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-pinterest border border-outline-variant bg-surface-container-lowest p-8 shadow-2xl z-10"
          >
            <button
              id="board-close-btn"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-12 h-12 bg-secondary-container/30 text-secondary flex items-center justify-center rounded-full mb-3">
                <FolderPlus className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">Create Board</h2>
              <p className="text-sm text-on-surface-variant mt-1.5">
                Organize your curated pins into custom themed collections.
              </p>
            </div>

            <form id="board-form" onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs bg-error-container text-on-error-container rounded-xl font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Board Name
                </label>
                <input
                  type="text"
                  placeholder='e.g. "Summer Retro 🍉" or "Cozy Nooks ☕"'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={30}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Description <span className="text-on-surface-variant/50 font-normal">(Optional)</span>
                </label>
                <textarea
                  placeholder="What is this board about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={120}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-surface-container text-on-surface font-bold py-3 px-4 rounded-xl text-sm hover:bg-surface-container-high transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-accent-pastel hover:bg-accent-pastel/90 text-on-primary-container font-bold py-3 px-4 rounded-xl text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Create Board
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
