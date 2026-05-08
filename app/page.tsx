'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Form from '@/components/Form';
import Result from '@/components/Result';
import { type GenerationParams, type GenerationResponse } from '@/lib/schemas';
import { BespokeIcons } from '@/components/BespokeIcons';

interface ExtendedResponse extends GenerationResponse {
  _cached?: boolean;
}

export default function Home() {
  const [result, setResult] = useState<ExtendedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: GenerationParams) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue.');
      }

      setResult(data);

      const saved = localStorage.getItem('linkedin_history');
      const history = saved ? JSON.parse(saved) : [];
      const newHistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        params: formData,
        ...data
      };
      localStorage.setItem('linkedin_history', JSON.stringify([newHistoryItem, ...history].slice(0, 10)));

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#191A1A] font-sans text-[#E8E8E8] overflow-hidden flex flex-col relative">
      {/* Minimalist Header */}
      <nav className="relative z-50 bg-[#191A1A]/80 backdrop-blur-md border-b border-white/5 py-3 px-6 h-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-all">
              <Image 
                src="/logo.svg" 
                alt="Impalia" 
                fill 
                className="object-contain"
              />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white/90">Forge Studio</span>
          </Link>
          <div className="h-3 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2">
            <Link href="/" className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-white/5 text-white">Studio</Link>
            <Link href="/history" className="px-2.5 py-0.5 rounded text-[11px] font-medium text-slate-500 hover:text-white transition-colors">History</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Engine Online</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Column: Configuration Console */}
        <div className="w-[560px] border-r border-white/5 flex flex-col bg-[#191A1A]">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12">
            <div className="space-y-2">
              <h1 className="text-3xl font-medium tracking-tight text-white">Composition</h1>
              <p className="text-slate-400 text-[15px]">Configurez les paramètres de votre publication</p>
            </div>

            <div className="search-container p-8">
              <Form onSubmit={handleSubmit} isLoading={isLoading} />

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-red-900/10 border border-red-500/20 text-red-400 text-[11px] rounded-lg"
                  >
                    Erreur: {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: Preview & Intelligence */}
        <div className="flex-1 flex flex-col bg-[#191A1A] overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div className="max-w-[700px] mx-auto w-full">
              <AnimatePresence mode="wait">
                {(isLoading || result) ? (
                  <Result
                    publication={result?.publication}
                    note={result?.note}
                    isLoading={isLoading}
                    isCached={result?._cached}
                  />
                ) : (
                  <div className="h-[70vh] flex flex-col items-center justify-center text-center opacity-20 grayscale">
                    <BespokeIcons.Sparkles className="w-16 h-16 mb-6 text-slate-500" />
                    <p className="text-sm font-medium tracking-wide uppercase">En attente de configuration...</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-2 px-6 border-t border-white/5 text-[9px] text-slate-600 flex justify-between items-center bg-[#191A1A]">
        <div className="flex items-center gap-4">
          <span>&copy; 2026 Impalia Forge Studio</span>
        </div>
        <div className="flex gap-4 uppercase tracking-tighter">
          <span>v2.4.0</span>
          <span>Security Secured</span>
        </div>
      </footer>
    </div>
  );
}



