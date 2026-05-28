'use client';

import { motion, AnimatePresence } from 'framer-motion';
import LinkedInPost from './LinkedInPost';
import CopyButton from './CopyButton';
import { BespokeIcons } from './BespokeIcons';

interface ResultProps {
  publication?: string;
  note?: string;
  isLoading: boolean;
}

export default function Result({ publication, note, isLoading }: ResultProps) {
  return (
    <div className="w-full flex-1 flex flex-col relative z-10 h-full">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center gap-8 lg:gap-10 mt-8 lg:mt-12"
          >
            {/* Skeleton LinkedIn Post */}
            <div className="bg-[var(--color-card)] border border-white/[0.05] w-full max-w-[550px] rounded-3xl overflow-hidden p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full skeleton-shimmer"></div>
                <div className="space-y-3 flex-1">
                  <div className="h-4 w-32 skeleton-shimmer"></div>
                  <div className="h-3 w-48 skeleton-shimmer opacity-50"></div>
                </div>
              </div>
              <div className="space-y-3 pt-4">
                <div className="h-4 w-full skeleton-shimmer"></div>
                <div className="h-4 w-full skeleton-shimmer"></div>
                <div className="h-4 w-[80%] skeleton-shimmer"></div>
              </div>
              <div className="pt-10 flex justify-between gap-4">
                <div className="h-10 w-1/4 skeleton-shimmer rounded-xl"></div>
                <div className="h-10 w-1/4 skeleton-shimmer rounded-xl"></div>
                <div className="h-10 w-1/4 skeleton-shimmer rounded-xl"></div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border border-[var(--color-accent)]/10 backdrop-blur-sm">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase">
                Forge en cours…
              </span>
            </div>
          </motion.div>
        ) : publication ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full flex flex-col gap-8 lg:gap-10 items-center py-6 lg:py-10"
          >
            {/* LinkedIn Mockup with Copy Button */}
            <div className="w-full relative group max-w-[580px]">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--color-accent)]/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
              <div className="absolute right-4 sm:right-6 top-4 sm:top-6 z-20">
                <CopyButton text={publication} />
              </div>
              <LinkedInPost content={publication} shouldStream={true} />
            </div>

            {/* Strategic Note */}
            {note && (
              <div className="w-full max-w-[550px] space-y-4 lg:space-y-6">
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-6 h-6 bg-white/5 rounded-lg flex items-center justify-center text-[var(--color-accent)]">
                    <BespokeIcons.Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Note d&apos;intention stratégique
                  </h3>
                </div>
                <div className="bg-white/[0.01] dark:bg-white/[0.01] bg-slate-50 border border-slate-200 dark:border-white/[0.04] rounded-[1.5rem] sm:rounded-[2.5rem] p-8 sm:p-12 text-base sm:text-xl text-slate-700 dark:text-slate-400 leading-relaxed italic font-serif relative group backdrop-blur-sm shadow-xl dark:shadow-2xl dark:shadow-black/20">
                  <span className="absolute top-4 sm:top-6 left-6 sm:left-8 text-4xl sm:text-6xl text-slate-300 dark:text-white/[0.03] font-serif select-none">&ldquo;</span>
                  <span className="relative z-10 block">
                    {note}
                  </span>
                  <span className="absolute bottom-2 sm:bottom-4 right-6 sm:right-8 text-4xl sm:text-6xl text-slate-300 dark:text-white/[0.03] font-serif select-none">&rdquo;</span>
                </div>
              </div>
            )}

          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center h-full opacity-30"
          >
            <div className="mb-6">
              <svg className="w-10 h-10 animate-spin-slow text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">
              En attente de configuration…
            </p>
            <p className="text-[10px] text-slate-600 mt-2">
              ⌘ + Entrée pour générer
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
