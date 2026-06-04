'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X } from 'lucide-react';
import LinkedInPost from './LinkedInPost';
import { BespokeIcons } from './BespokeIcons';

interface ResultProps {
  publication?: string;
  note?: string;
  isLoading: boolean;
  onImprove?: (feedback: string) => void;
  onSaveHistory?: (image?: string | null) => Promise<boolean>;
  onImageGenerated?: (image: string) => void;
}

export default function Result({
  publication,
  note,
  isLoading,
  onImprove,
  onSaveHistory,
  onImageGenerated,
}: ResultProps) {
  const [feedback, setFeedback] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const buildImagePrompt = (text: string) => {
    const rawSubject = note || text.split('\n')[0] || '';
    const cleanSubject = rawSubject
      .replace(/[^a-zA-Z0-9 àéèêçôî]/g, ' ')
      .slice(0, 150)
      .trim();

    return `A highly realistic, professional corporate photography representing: ${cleanSubject}. Cinematic lighting, shallow depth of field, modern business environment, shot on 35mm lens, 8k resolution, highly detailed, photorealistic, premium corporate aesthetic, NO text, NO letters, NO words.`;
  };

  async function generateImage(content: string) {
    setImageError(null);
    setImageLoading(true);
    setImageSrc(null);

    try {
      const prompt = buildImagePrompt(content);
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size: '512x512' }),
      });

      if (!res.ok) {
        throw new Error('Erreur de génération d’image');
      }

      const data = await res.json();
      const image = data.image ?? null;
      setImageSrc(image);
      if (image && onImageGenerated) {
        onImageGenerated(image);
      }
    } catch (error) {
      console.error(error);
      setImageError('Impossible de générer l’image pour le moment.');
    } finally {
      setImageLoading(false);
    }
  }

  const [prevPublication, setPrevPublication] = useState(publication);
  if (publication !== prevPublication) {
    setPrevPublication(publication);
    setImageSrc(null);
    setImageError(null);
    setSaved(false);
    setSaveError(null);
  }

  const [prevImageSrc, setPrevImageSrc] = useState(imageSrc);
  if (imageSrc !== prevImageSrc) {
    setPrevImageSrc(imageSrc);
    setSaved(false);
    setSaveError(null);
  }

  const handleSaveHistory = async () => {
    if (!onSaveHistory || !imageSrc) return;

    setSaveError(null);
    setIsSaving(true);

    const success = await onSaveHistory(imageSrc);
    setIsSaving(false);

    if (success) {
      setSaved(true);
    } else {
      setSaveError('Impossible d’enregistrer l’historique. Réessayez.');
    }
  };

  const handleImprove = () => {
    if (feedback.trim() && onImprove) {
      onImprove(feedback);
      setFeedback('');
    }
  };

  return (
    <div className="relative z-10 flex h-full w-full flex-1 flex-col">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 flex w-full flex-col items-center gap-8 lg:mt-12 lg:gap-10"
          >
            {/* Skeleton LinkedIn Post */}
            <div className="w-full max-w-[550px] space-y-6 overflow-hidden rounded-3xl border border-white/[0.05] bg-[var(--color-card)] p-6 shadow-2xl sm:p-8">
              <div className="flex items-center gap-4">
                <div className="skeleton-shimmer h-12 w-12 rounded-full sm:h-14 sm:w-14"></div>
                <div className="flex-1 space-y-3">
                  <div className="skeleton-shimmer h-4 w-32"></div>
                  <div className="skeleton-shimmer h-3 w-48 opacity-50"></div>
                </div>
              </div>
              <div className="space-y-3 pt-4">
                <div className="skeleton-shimmer h-4 w-full"></div>
                <div className="skeleton-shimmer h-4 w-full"></div>
                <div className="skeleton-shimmer h-4 w-[80%]"></div>
              </div>
              <div className="flex justify-between gap-4 pt-10">
                <div className="skeleton-shimmer h-10 w-1/4 rounded-xl"></div>
                <div className="skeleton-shimmer h-10 w-1/4 rounded-xl"></div>
                <div className="skeleton-shimmer h-10 w-1/4 rounded-xl"></div>
              </div>
            </div>

            <img
              src="/logo-white.gif"
              alt="Loading"
              className="mx-auto h-14 w-14 object-contain dark:hidden"
            />
            <img
              src="/logo_no_bg.gif"
              alt="Loading"
              className="mx-auto hidden h-14 w-14 object-contain dark:block"
            />
          </motion.div>
        ) : publication ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="flex w-full flex-col items-center gap-8 py-6 lg:gap-10 lg:py-10"
          >
            {/* LinkedIn Mockup */}
            <div className="group relative w-full max-w-[580px]">
              <div className="from-[var(--color-accent)]/10 absolute -inset-4 -z-10 bg-gradient-to-tr to-transparent opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"></div>
              <LinkedInPost
                content={publication}
                shouldStream={true}
                image={imageSrc}
                onRemoveImage={() => setImageSrc(null)}
              />
              <div className="absolute -bottom-6 right-2 flex items-center gap-1.5 text-xs font-medium text-slate-500 opacity-80">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${publication.length > 1300 ? 'bg-red-500' : 'bg-emerald-500'}`}
                ></span>
                {publication.length} / 1300 caractères
              </div>
            </div>

            {imageSrc && onSaveHistory && (
              <div className="mt-4 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveHistory}
                  disabled={isSaving || saved}
                  className="inline-flex h-12 min-w-[220px] items-center justify-center rounded-full bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0a5ad9] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving
                    ? 'Enregistrement...'
                    : saved
                      ? 'Image enregistrée'
                      : 'Enregistrer l’image'}
                </button>
                {saveError && (
                  <p className="text-xs text-red-500">{saveError}</p>
                )}
              </div>
            )}

            {!imageSrc && (
              <div className="mt-6 flex w-full justify-center">
                <button
                  type="button"
                  onClick={() => generateImage(publication)}
                  disabled={imageLoading}
                  className={
                    imageLoading
                      ? 'inline-flex h-16 w-16 items-center justify-center rounded-full bg-transparent p-0 text-white transition disabled:cursor-not-allowed'
                      : 'inline-flex h-10 min-w-[180px] items-center justify-center rounded-full bg-[var(--color-accent)] px-6 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0a5ad9] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500'
                  }
                >
                  {imageLoading ? (
                    <>
                      <img
                        src="/logo-white.gif"
                        alt="Chargement"
                        className="h-14 w-14 object-contain dark:hidden"
                      />
                      <img
                        src="/logo_no_bg.gif"
                        alt="Chargement"
                        className="hidden h-14 w-14 object-contain dark:block"
                      />
                    </>
                  ) : (
                    'Générer l’image'
                  )}
                </button>
              </div>
            )}

            {imageError && (
              <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-300">
                {imageError}
              </div>
            )}

            {/* Strategic Note */}
            {note && (
              <div className="w-full max-w-[550px] space-y-4 lg:space-y-6">
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 text-[var(--color-accent)]">
                    <BespokeIcons.Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Note d&apos;intention stratégique
                  </h3>
                </div>
                <div className="group relative rounded-[1.5rem] border border-slate-200 bg-slate-50 bg-white/[0.01] p-6 font-serif text-base italic leading-relaxed text-slate-700 shadow-xl backdrop-blur-sm dark:border-white/[0.04] dark:bg-white/[0.01] dark:text-slate-400 dark:shadow-2xl dark:shadow-black/20 sm:rounded-[2.5rem] sm:p-12 sm:text-xl">
                  <span className="absolute left-4 top-2 select-none font-serif text-4xl text-slate-300 dark:text-white/[0.03] sm:left-8 sm:top-6 sm:text-6xl">
                    &ldquo;
                  </span>
                  <span className="relative z-10 block">{note}</span>
                  <span className="absolute bottom-0 right-4 select-none font-serif text-4xl text-slate-300 dark:text-white/[0.03] sm:bottom-4 sm:right-8 sm:text-6xl">
                    &rdquo;
                  </span>
                </div>
              </div>
            )}

            {/* Improvement Feedback Box */}
            {publication && onImprove && (
              <div className="mt-4 w-full max-w-[550px]">
                <div className="group relative">
                  <input
                    type="text"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleImprove();
                      }
                    }}
                    placeholder="Ex: Rends ça plus percutant, Rends ça plus long, ajoute des emojis..."
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] dark:border-white/[0.1] dark:bg-slate-900 dark:text-slate-300"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleImprove}
                    disabled={!feedback.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[var(--color-accent)] p-2 text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-full flex-1 flex-col items-center justify-center text-center opacity-100 transition-opacity duration-500"
          >
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center overflow-hidden opacity-80 transition-all duration-500">
              <img
                src="/logo-white.gif"
                alt="Forge Studio"
                className="h-full w-full object-contain dark:hidden"
              />
              <img
                src="/logo_no_bg.gif"
                alt="Forge Studio"
                className="hidden h-full w-full object-contain dark:block"
              />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">
              En attente de configuration…
            </p>
            <p className="mt-2 text-[10px] text-slate-600">
              ⌘ + Entrée pour générer
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
