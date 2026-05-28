'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LinkedInPost from '@/components/LinkedInPost';
import CopyButton from '@/components/CopyButton';
import Navbar from '@/components/Navbar';
import { BespokeIcons } from '@/components/BespokeIcons';
import { Search } from 'lucide-react';
import { getHistory, clearHistory as clearStoredHistory, type HistoryItem } from '@/lib/storage';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selected, setSelected] = useState<HistoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClearHistory = () => {
    if (confirm('Voulez-vous vraiment effacer tout l\'historique ?')) {
      clearStoredHistory();
      setHistory([]);
      setSelected(null);
    }
  };

  const filteredHistory = history.filter(item => {
    const textToSearch = (item.params.brief || item.params.draft || '').toLowerCase();
    return textToSearch.includes(searchQuery.toLowerCase()) ||
           item.publication.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-screen w-screen bg-[var(--color-bg)] font-sans text-[var(--color-text)] overflow-hidden flex flex-col relative">
      <Navbar />

      <main className="flex-1 flex overflow-hidden w-full max-w-[1600px] mx-auto">
        {/* Thread Sidebar */}
        <div className="w-full sm:w-[300px] lg:w-[340px] flex flex-col bg-transparent sm:mr-8 lg:mr-16 flex-shrink-0">
          <div className="pt-8 lg:pt-16 pb-6 lg:pb-10 px-4 sm:px-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-6 lg:mb-10 tracking-tight">
              Bibliothèque
            </h2>
            <div className="relative group">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[var(--color-accent)] transition-colors" />
              <input
                type="text"
                placeholder="Rechercher dans les archives…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 py-3 bg-[var(--color-surface)] border-b border-slate-200 dark:border-white/10 text-[14px] text-slate-900 dark:text-white focus:border-[var(--color-accent)]/60 outline-none transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400 font-medium"
                aria-label="Rechercher dans l'historique"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1 pb-6 lg:pb-10">
            <AnimatePresence mode="popLayout">
              {filteredHistory.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-center opacity-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Aucune archive</p>
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <motion.button
                    key={item.id}
                    layout
                    onClick={() => setSelected(item)}
                    className={`w-full text-left px-4 sm:px-6 py-4 rounded-2xl transition-all duration-300 group relative ${
                      selected?.id === item.id
                        ? 'bg-slate-100 dark:bg-white/[0.04] text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                    }`}
                    aria-pressed={selected?.id === item.id}
                  >
                    {selected?.id === item.id && (
                      <motion.div
                        layoutId="active-dot"
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full shadow-[0_0_10px_var(--color-accent)]"
                      />
                    )}
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                        selected?.id === item.id ? 'text-[var(--color-accent)]' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {item.params.mode === 'roast' ? 'ROAST' : item.params.tone}
                      </span>
                      <span className="text-[9px] font-bold tabular-nums opacity-20">
                        {new Date(item.timestamp).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <h4 className={`text-[15px] font-medium line-clamp-1 transition-colors ${
                      selected?.id === item.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-300'
                    }`}>
                      {item.params.brief || item.params.draft}
                    </h4>
                  </motion.button>
                ))
              )}
            </AnimatePresence>
          </div>

          {history.length > 0 && (
            <div className="p-4 sm:p-8 pb-6 lg:pb-12">
              <button
                onClick={handleClearHistory}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-all"
              >
                Tout effacer
              </button>
            </div>
          )}
        </div>

        {/* Content Viewer */}
        <div className="hidden sm:flex flex-1 overflow-hidden flex-col items-center justify-center">
          <div className="w-full max-w-[1200px] px-4 lg:px-12 overflow-y-auto custom-scrollbar max-h-screen py-8 lg:py-12">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, scale: 0.98, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 120 }}
                  className="space-y-12 lg:space-y-16"
                >
                  {/* Header */}
                  <div className="pb-6 lg:pb-8 border-b border-slate-200 dark:border-white/[0.04]">
                    <div className="space-y-4 lg:space-y-5">
                      <div className="flex items-center gap-3 text-[var(--color-accent)]">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_12px_var(--color-accent)]"></div>
                        <span className="text-[11px] font-black uppercase tracking-[0.25em]">Détails de l&apos;archive</span>
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.2] line-clamp-2">
                        {selected.params.brief || 'Roast de draft'}
                      </h2>
                      <div className="flex items-center gap-4 lg:gap-6 text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-[0.15em]">
                        <div className="flex items-center gap-2 text-[var(--color-accent)]">
                          <div className="w-4 h-4 bg-[var(--color-accent)]/10 rounded flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full"></div>
                          </div>
                          {selected.params.mode === 'roast' ? 'Analyse & Roast' : selected.params.tone}
                        </div>
                        <span className="opacity-20">/</span>
                        <span>
                          {new Date(selected.timestamp).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col xl:flex-row gap-8 lg:gap-12 items-start pt-6 lg:pt-8">
                    {/* Publication */}
                    <div className="w-full xl:w-[500px] flex-shrink-0 relative group">
                      <div className="absolute right-4 sm:right-6 top-4 sm:top-6 z-20">
                        <CopyButton text={selected.publication} />
                      </div>
                      <LinkedInPost content={selected.publication} />
                    </div>

                    {/* Note */}
                    <div className="flex-1 flex flex-col gap-8 w-full">
                      {selected.note && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                            <div className="w-6 h-6 bg-[var(--color-accent)]/10 rounded-lg flex items-center justify-center text-[var(--color-accent)]">
                              <BespokeIcons.Sparkles className="w-4 h-4" />
                            </div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.25em]">
                              Note Stratégique
                            </h4>
                          </div>
                          <div className="bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/[0.04] rounded-[1.5rem] p-6 lg:p-8 text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed italic font-serif relative group">
                            <span className="absolute top-3 left-4 text-3xl text-slate-200 dark:text-white/[0.03] font-serif select-none">&ldquo;</span>
                            <span className="relative z-10 block">
                              {selected.note}
                            </span>
                            <span className="absolute bottom-1 right-4 text-3xl text-slate-200 dark:text-white/[0.03] font-serif select-none">&rdquo;</span>
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
                  className="flex flex-col items-center justify-center text-center opacity-30"
                >
                  <div className="mb-8">
                    <svg className="w-12 h-12 animate-spin-slow text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 translate-x-[0.2em]">
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
