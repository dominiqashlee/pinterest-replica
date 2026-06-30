import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Mail, Lock, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
  onSuccess: (userName: string, email: string) => void;
}

export default function AuthModal({ isOpen, onClose, initialMode, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync mode if changed from prop
  React.useEffect(() => {
    setMode(initialMode);
    setError('');
  }, [initialMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === 'signup' && !name)) {
      setError('Please fill out all required fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate network latency
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(mode === 'signup' ? name : email.split('@')[0], email);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="auth-modal-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with strong blur */}
          <motion.div
            id="auth-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-inverse-surface/45 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            id="auth-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md overflow-hidden rounded-pinterest border border-outline-variant bg-surface-container-lowest p-8 shadow-2xl z-10"
          >
            {/* Soft decorative blur orbs */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-primary-container/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-secondary-container/30 rounded-full blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              id="auth-close-btn"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-12 h-12 bg-accent-pastel/20 text-primary flex items-center justify-center rounded-full mb-3 shadow-inner">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">
                {mode === 'signup' ? 'Create Your Space' : 'Welcome Back'}
              </h2>
              <p className="text-sm text-on-surface-variant mt-1.5 max-w-xs">
                {mode === 'signup'
                  ? 'Join Pinterest to discover and curate aesthetic, mindful inspirations.'
                  : 'Log in to continue exploring matches and saving beautiful ideas.'}
              </p>
            </div>

            {/* Form */}
            <form id="auth-form" onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs bg-error-container text-on-error-container rounded-xl font-medium">
                  {error}
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-on-surface-variant">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Domi Kurniawan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-on-surface-variant">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-on-surface-variant">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent-pastel hover:bg-accent-pastel/90 text-on-primary-container font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-on-primary-container" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Setting up your feed...
                  </span>
                ) : mode === 'signup' ? (
                  'Join Pinterest For Free'
                ) : (
                  'Log In Securely'
                )}
              </button>
            </form>

            {/* Toggle Mode Footer */}
            <div className="mt-6 pt-4 border-t border-outline-variant text-center text-xs text-on-surface-variant">
              {mode === 'signup' ? (
                <span>
                  Already have an account?{' '}
                  <button
                    onClick={() => { setMode('login'); setError(''); }}
                    className="text-primary font-bold hover:underline ml-1"
                  >
                    I already have an account
                  </button>
                </span>
              ) : (
                <span>
                  New to Pinterest?{' '}
                  <button
                    onClick={() => { setMode('signup'); setError(''); }}
                    className="text-primary font-bold hover:underline ml-1"
                  >
                    Create a free account
                  </button>
                </span>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
