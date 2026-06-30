import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UploadCloud, Image as ImageIcon, Sparkles, Tag } from 'lucide-react';
import { Pin, PinCategory } from '../types';

interface UploadPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (newPin: Pin) => void;
}

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1520004434532-6684162097ae?auto=format&fit=crop&q=80&w=800'
];

export default function UploadPinModal({ isOpen, onClose, onUpload }: UploadPinModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PinCategory>('general');
  const [price, setPrice] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    setError('');
    const localUrl = URL.createObjectURL(file);
    setImageUrl(localUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSelectPreset = (url: string) => {
    setImageUrl(url);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setError('Please upload an image or choose an aesthetic preset.');
      return;
    }
    if (!title.trim()) {
      setError('Pin title is required.');
      return;
    }

    const tags = tagsText
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const aspectRatios = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]'];
    const randomAspect = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];

    const newPin: Pin = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'A user curated aesthetic pin.',
      imageUrl,
      category,
      author: {
        name: 'You (Curator)',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
      },
      likes: 0,
      tags: tags.length > 0 ? tags : ['Curated', 'Self Upload'],
      price: price.trim() ? `$${parseFloat(price).toFixed(2)}` : undefined,
      comments: [],
      aspectRatio: randomAspect
    };

    onUpload(newPin);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setCategory('general');
    setPrice('');
    setTagsText('');
    setImageUrl('');
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="upload-modal-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            id="upload-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-inverse-surface/45 backdrop-blur-md"
          />

          <motion.div
            id="upload-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-pinterest border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              id="upload-close-btn"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-on-surface z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="flex flex-col items-center mb-6 text-center border-b border-outline-variant/30 pb-4">
                <div className="w-12 h-12 bg-primary-container/20 text-primary flex items-center justify-center rounded-full mb-2">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">Publish New Pin</h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  Share your visual inspiration with the curation feed.
                </p>
              </div>

              <form id="upload-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left side: Upload Area */}
                <div className="flex flex-col space-y-4">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Visual Media File
                  </label>

                  <div
                    id="dropzone"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-pinterest flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer min-h-[300px] overflow-hidden ${
                      isDragging
                        ? 'border-primary bg-primary-container/10'
                        : imageUrl
                        ? 'border-outline-variant hover:border-primary bg-surface'
                        : 'border-outline-variant hover:border-primary bg-surface-container-low'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    {imageUrl ? (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-surface-dim">
                        <img
                          src={imageUrl}
                          alt="Uploaded Pin Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-all">
                          <span className="text-white text-xs font-bold bg-black/60 px-3 py-2 rounded-full flex items-center gap-1.5">
                            <UploadCloud className="w-4 h-4" /> Replace Image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 pointer-events-none">
                        <div className="w-14 h-14 bg-surface-container flex items-center justify-center rounded-full mx-auto text-on-surface-variant shadow-sm">
                          <ImageIcon className="w-7 h-7" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-on-surface">
                            Drag and drop or click to upload
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            Supports PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Preset Aesthetics selector */}
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-2">
                      Or select an aesthetic pastel preset:
                    </label>
                    <div className="flex gap-2.5">
                      {PRESET_IMAGES.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPreset(url)}
                          className={`w-12 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            imageUrl === url ? 'border-primary scale-105 shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt="Preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side: Meta Details */}
                <div className="flex flex-col space-y-4">
                  {error && (
                    <div className="p-3 text-xs bg-error-container text-on-error-container rounded-xl font-medium">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Give your pin a catchy name"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={60}
                      className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                      Description <span className="text-on-surface-variant/50 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      placeholder="Detail what people can see, buy or replicate here..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={300}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as PinCategory)}
                        className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
                      >
                        <option value="general">General Discovery</option>
                        <option value="soccer">⚽ Soccer Season</option>
                        <option value="fashion">🧥 Fashion & Knits</option>
                        <option value="interior">🌿 Mindful Space</option>
                        <option value="lifestyle">🎨 Lifestyle Moods</option>
                        <option value="food">🍵 Aesthetic Food</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                        Shop Price <span className="text-on-surface-variant/50 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                      Tags <span className="text-on-surface-variant/50 font-normal">(Comma separated)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-on-surface-variant">
                        <Tag className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Pastel, Summer, Matcha, Retro"
                        value={tagsText}
                        onChange={(e) => setTagsText(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-outline-variant/30 mt-4">
                    <button
                      type="button"
                      onClick={() => { handleReset(); onClose(); }}
                      className="flex-1 bg-surface-container text-on-surface font-bold py-3 px-4 rounded-xl text-sm hover:bg-surface-container-high transition-all cursor-pointer"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-accent-pastel hover:bg-accent-pastel/90 text-on-primary-container font-bold py-3 px-4 rounded-xl text-sm shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" /> Publish Pin
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
