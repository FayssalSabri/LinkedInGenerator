'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Form from '@/components/Form';
import Result from '@/components/Result';
import { type GenerationParams, type GenerationResponse } from '@/lib/schemas';
import Link from 'next/link';
import { PenSquare, History } from 'lucide-react';

export default function Home() {
  const [result, setResult] = useState<GenerationResponse | null>(null);
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
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#191A1A]">
      {/* Navigation Bar - Even cleaner */}
      <nav className="flex-shrink-0 h-16 border-b border-white/[0.03] bg-[#191A1A] z-50 flex items-center justify-between px-8 lg:px-16">
        <div className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-all">
            <img 
              src="/logo.svg" 
              alt="Forge Studio" 
              className="w-full h-full object-contain p-1.5"
            />
          </div>
          <span className="font-semibold text-sm tracking-tight text-white/90">Forge Studio</span>
        </div>
        <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.05]">
          <Link href="/" className="nav-item !px-5 !py-1.5 nav-item-active !rounded-lg text-xs">
            <PenSquare className="w-3.5 h-3.5" />
            <span>Forge</span>
          </Link>
          <Link href="/history" className="nav-item !px-5 !py-1.5 nav-item-inactive !rounded-lg text-xs">
            <History className="w-3.5 h-3.5" />
            <span>Library</span>
          </Link>
        </div>
      </nav>

      {/* Main Workspace - More generous spacing */}
      <main className="flex-1 overflow-hidden w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12 p-8 lg:p-12">
        
        {/* Left Column: Form - Vertically Centered and cleaner */}
        <div className="w-full lg:w-[42%] h-full flex flex-col justify-center overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col max-h-full"
          >
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Studio Créatif</h1>
              <p className="text-base text-slate-400 font-medium leading-relaxed max-w-md">
                Configurez votre identité et votre message pour générer une publication LinkedIn à forte valeur ajoutée.
              </p>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar pr-4">
              <Form onSubmit={handleSubmit} isLoading={isLoading} />
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-8 p-4 bg-red-500/5 border border-red-500/20 text-red-400 text-sm font-medium rounded-2xl flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Result / Preview - More breathing space */}
        <div className="w-full lg:w-[58%] h-full flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center justify-start rounded-3xl">
            <Result publication={result?.publication} note={result?.note} isLoading={isLoading} />
          </div>
        </div>

      </main>
    </div>
  );
}
