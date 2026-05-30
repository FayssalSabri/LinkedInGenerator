'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LinkedInPost from '@/components/LinkedInPost';
import CopyButton from '@/components/CopyButton';
import Navbar from '@/components/Navbar';
import { BespokeIcons } from '@/components/BespokeIcons';
import { Search, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface DbHistoryItem {
  id: string;
  userId: string;
  timestamp: string;
  mode: string | null;
  description: string | null;
  brief: string | null;
  tone: string | null;
  draft: string | null;
  publication: string;
  note: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<DbHistoryItem[]>([]);
  const [selected, setSelected] = useState<DbHistoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/history');
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setHistory(data);
    } catch {
      toast.error("Impossible de charger l'historique");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/history');
        if (!res.ok) throw new Error('Erreur de chargement');
        const data = await res.json();
        if (!cancelled) setHistory(data);
      } catch {
        if (!cancelled) toast.error("Impossible de charger l'historique");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleClearHistory = async () => {
    if (confirm("Voulez-vous vraiment effacer tout l'historique ?")) {
      try {
        const res = await fetch('/api/history', { method: 'DELETE' });
        if (!res.ok) throw new Error();
        setHistory([]);
        setSelected(null);
        toast.success('Historique effacé');
      } catch {
        toast.error("Impossible de supprimer l'historique");
      }
    }
  };

  const filteredHistory = history.filter((item) => {
    const textToSearch = (item.brief || item.draft || '').toLowerCase();
    return (
      textToSearch.includes(searchQuery.toLowerCase()) ||
      item.publication.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[var(--color-bg)] font-sans text-[var(--color-text)]">
      <Navbar />

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 overflow-hidden">
        {/* Thread Sidebar */}
        <div className="flex w-full flex-shrink-0 flex-col bg-transparent sm:mr-8 sm:w-[300px] lg:mr-16 lg:w-[340px]">
          <div className="px-4 pb-6 pt-8 sm:px-8 lg:pb-10 lg:pt-16">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white lg:mb-10 lg:text-3xl">
              Bibliothèque
            </h2>
            <div className="group relative">
              <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-[var(--color-accent)]" />
              <input
                type="text"
                placeholder="Rechercher dans les archives…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:border-[var(--color-accent)]/60 w-full border-b border-slate-200 bg-[var(--color-surface)] py-3 pl-8 text-[14px] font-medium text-slate-900 outline-none transition-all placeholder:text-slate-500 dark:border-white/10 dark:text-white dark:placeholder:text-slate-400"
                aria-label="Rechercher dans l'historique"
              />
            </div>
          </div>

          <div className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-2 pb-6 lg:pb-10">
            {isLoading ? (
              <div className="flex h-40 flex-col items-center justify-center gap-3 text-center">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--color-accent)]" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Chargement…
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredHistory.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center text-center opacity-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                      Aucune archive
                    </p>
                  </div>
                ) : (
                  filteredHistory.map((item) => (
                    <motion.button
                      key={item.id}
                      layout
                      onClick={() => setSelected(item)}
                      className={`group relative w-full rounded-2xl px-4 py-4 text-left transition-all duration-300 sm:px-6 ${
                        selected?.id === item.id
                          ? 'bg-slate-100 text-slate-900 dark:bg-white/[0.04] dark:text-white'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/[0.02] dark:hover:text-slate-300'
                      }`}
                      aria-pressed={selected?.id === item.id}
                    >
                      {selected?.id === item.id && (
                        <motion.div
                          layoutId="active-dot"
                          className="absolute left-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]"
                        />
                      )}
                      <div className="mb-1 flex items-center justify-between">
                        <span
                          className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                            selected?.id === item.id
                              ? 'text-[var(--color-accent)]'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {item.mode === 'roast'
                            ? 'ROAST'
                            : item.tone || 'Génération'}
                        </span>
                        <span className="text-[9px] font-bold tabular-nums opacity-20">
                          {new Date(item.timestamp).toLocaleDateString(
                            'fr-FR',
                            { day: '2-digit', month: 'short' }
                          )}
                        </span>
                      </div>
                      <h4
                        className={`line-clamp-1 text-[15px] font-medium transition-colors ${
                          selected?.id === item.id
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-500 dark:text-slate-300'
                        }`}
                      >
                        {item.brief || item.draft || 'Publication'}
                      </h4>
                    </motion.button>
                  ))
                )}
              </AnimatePresence>
            )}
          </div>

          {history.length > 0 && (
            <div className="p-4 pb-6 sm:p-8 lg:pb-12">
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-red-500 transition-all hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="h-3 w-3" />
                Tout effacer
              </button>
            </div>
          )}
        </div>

        {/* Content Viewer */}
        <div className="hidden flex-1 flex-col items-center justify-center overflow-hidden sm:flex">
          <div className="custom-scrollbar max-h-screen w-full max-w-[1200px] overflow-y-auto px-4 py-8 lg:px-12 lg:py-12">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, scale: 0.98, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                  className="space-y-12 lg:space-y-16"
                >
                  {/* Header */}
                  <div className="border-b border-slate-200 pb-6 dark:border-white/[0.04] lg:pb-8">
                    <div className="space-y-4 lg:space-y-5">
                      <div className="flex items-center gap-3 text-[var(--color-accent)]">
                        <div className="h-2 w-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_12px_var(--color-accent)]"></div>
                        <span className="text-[11px] font-black uppercase tracking-[0.25em]">
                          Détails de l&apos;archive
                        </span>
                      </div>
                      <h2 className="line-clamp-2 text-2xl font-bold leading-[1.2] tracking-tight text-slate-900 dark:text-white lg:text-3xl">
                        {selected.brief || 'Roast de draft'}
                      </h2>
                      <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 lg:gap-6">
                        <div className="flex items-center gap-2 text-[var(--color-accent)]">
                          <div className="bg-[var(--color-accent)]/10 flex h-4 w-4 items-center justify-center rounded">
                            <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"></div>
                          </div>
                          {selected.mode === 'roast'
                            ? 'Analyse & Roast'
                            : selected.tone || 'Génération'}
                        </div>
                        <span className="opacity-20">/</span>
                        <span>
                          {new Date(selected.timestamp).toLocaleString(
                            'fr-FR',
                            {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-8 pt-6 lg:gap-12 lg:pt-8 xl:flex-row">
                    {/* Publication */}
                    <div className="group relative w-full flex-shrink-0 xl:w-[500px]">
                      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
                        <CopyButton text={selected.publication} />
                      </div>
                      <LinkedInPost content={selected.publication} />
                    </div>

                    {/* Note */}
                    <div className="flex w-full flex-1 flex-col gap-8">
                      {selected.note && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                            <div className="bg-[var(--color-accent)]/10 flex h-6 w-6 items-center justify-center rounded-lg text-[var(--color-accent)]">
                              <BespokeIcons.Sparkles className="h-4 w-4" />
                            </div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.25em]">
                              Note Stratégique
                            </h4>
                          </div>
                          <div className="group relative rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 font-serif text-sm italic leading-relaxed text-slate-700 dark:border-white/[0.04] dark:bg-white/[0.01] dark:text-slate-300 lg:p-8 lg:text-base">
                            <span className="absolute left-4 top-3 select-none font-serif text-3xl text-slate-200 dark:text-white/[0.03]">
                              &ldquo;
                            </span>
                            <span className="relative z-10 block">
                              {selected.note}
                            </span>
                            <span className="absolute bottom-1 right-4 select-none font-serif text-3xl text-slate-200 dark:text-white/[0.03]">
                              &rdquo;
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center opacity-100 transition-opacity duration-500"
                >
                  <div className="relative mb-8 flex h-24 w-24 items-center justify-center overflow-hidden opacity-80 transition-all duration-500">
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
                  <p className="translate-x-[0.2em] text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
                    Sélectionnez une archive…
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
