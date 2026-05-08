'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, FileText, Lightbulb, Sparkles } from 'lucide-react';

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
    <div className="flex-1">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-live="polite"
            aria-busy="true"
            className="space-y-10"
          >
            <div className="space-y-4">
              <div className="h-3 w-24 bg-slate-100 rounded-full animate-pulse" />
              <div className="h-64 bg-slate-50/50 rounded-2xl animate-pulse border border-slate-100" />
            </div>
            <div className="space-y-4">
              <div className="h-3 w-32 bg-slate-100 rounded-full animate-pulse" />
              <div className="h-32 bg-slate-50/50 rounded-2xl animate-pulse border border-slate-100" />
            </div>
          </motion.div>
        ) : publication ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="relative group">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-blue-500" />
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Publication LinkedIn
                </h3>
              </div>
              <div className="bg-slate-50/50 rounded-2xl p-8 text-slate-700 text-sm whitespace-pre-wrap border border-slate-100 leading-relaxed relative group-hover:border-slate-200 transition-colors">
                {publication}
                <button
                  onClick={handleCopy}
                  className="absolute top-4 right-4 p-2.5 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all active:scale-90"
                  title="Copier la publication"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-4 w-4 text-orange-400" />
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Analyse Stratégique
                </h3>
              </div>
              <div className="bg-orange-50/20 rounded-2xl p-8 text-slate-600 text-sm italic border border-orange-100/50 leading-relaxed">
                {note}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full min-h-[350px] text-center"
          >
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 mb-6">
              <Sparkles className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg">Prêt pour l'Impact ?</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-[280px]">
              Remplissez le brief pour forger votre prochaine publication stratégique.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
