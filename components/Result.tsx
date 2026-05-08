'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LinkedInPost from './LinkedInPost';
import { Copy, Check } from 'lucide-react';

interface ResultProps {
  publication?: string;
  note?: string;
  isLoading: boolean;
}

export default function Result({ publication, note, isLoading }: ResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (publication) {
      await navigator.clipboard.writeText(publication);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col relative z-10 h-full">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center gap-10 mt-12"
          >
            {/* Skeleton LinkedIn Post */}
            <div className="bg-[#202222] border border-white/[0.05] w-full max-w-[550px] rounded-3xl overflow-hidden p-8 space-y-6 shadow-2xl">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-full skeleton-shimmer"></div>
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
            
            <div className="flex items-center gap-4 text-[#1FB8CD] bg-[#1FB8CD]/5 px-8 py-4 rounded-2xl border border-[#1FB8CD]/10 backdrop-blur-sm">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-bold tracking-widest uppercase">Forge en cours...</span>
            </div>
          </motion.div>
        ) : publication ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full flex flex-col gap-10 items-center py-10"
          >
            {/* LinkedIn Mockup */}
            <div className="w-full relative group max-w-[580px]">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#1FB8CD]/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
              <LinkedInPost content={publication} />
              
              {/* Floating Copy Button - Even more comfortable */}
              <div className="absolute -right-6 top-6 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                <button
                  onClick={handleCopy}
                  className="bg-[#1FB8CD] text-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(31,184,205,0.3)] hover:bg-[#1DA8BA] transition-all hover:scale-110"
                  title="Copier le contenu"
                >
                  {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Strategic Note */}
            <div className="bg-white/[0.02] border border-white/[0.05] p-8 w-full max-w-[550px] rounded-3xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#1FB8CD] shadow-[0_0_10px_#1FB8CD]"></div>
                <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Note d'intention stratégique</h3>
              </div>
              <p className="text-base text-slate-400 leading-relaxed italic font-medium">
                "{note}"
              </p>
            </div>
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
              En attente de configuration...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
