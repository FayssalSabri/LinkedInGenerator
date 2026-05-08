'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, History, Send, ShieldCheck, Zap } from 'lucide-react';
import Form from '@/components/Form';
import Result from '@/components/Result';
import { type GenerationParams, type GenerationResponse } from '@/lib/schemas';

interface HistoryItem extends GenerationResponse {
  id: string;
  timestamp: number;
  params: GenerationParams;
}

export default function Home() {
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('linkedin_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

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
      
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        params: formData,
        ...data
      };
      
      const updatedHistory = [newHistoryItem, ...history].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem('linkedin_history', JSON.stringify(updatedHistory));

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
      <div className="bg-slate-900 text-white py-2 px-4 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          <Zap className="h-3 w-3 text-orange-400 fill-orange-400" />
          LinkedIn Content Strategy - AI Powered
        </p>
      </div>

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 py-5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="bg-gradient-to-br from-orange-500 to-pink-500 p-1.5 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest hidden sm:block">
              AI Forge
            </span>
          </motion.div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-slate-400">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Enterprise Ready</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 lg:p-12">
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight"
          >
            Maîtrisez votre <span className="text-gradient">Narratif LinkedIn</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg mt-4 max-w-2xl leading-relaxed"
          >
            Conformément aux standards de qualité industrielle, ce service privilégie la **qualité d'exécution** et la **fiabilité** sur la complexité visuelle.
            Conçu pour l'excellence éditoriale.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Section Gauche: Formulaire et Historique */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="premium-card p-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <Send className="h-4 w-4 text-orange-500" />
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                  Configuration du Brief
                </h2>
              </div>
              <Form onSubmit={handleSubmit} isLoading={isLoading} />
              
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {history.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="premium-card p-8 bg-slate-50/30"
              >
                <div className="flex items-center gap-2 mb-6">
                  <History className="h-4 w-4 text-slate-400" />
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Générations récentes
                  </h2>
                </div>
                <div className="space-y-2">
                  {history.map((item) => (
                    <button 
                      key={item.id} 
                      onClick={() => setResult(item)}
                      className="w-full text-left p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all group border border-transparent hover:border-slate-200"
                    >
                      <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                        {new Date(item.timestamp).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-xs text-slate-600 line-clamp-1 group-hover:text-slate-900 font-medium">
                        {item.params.brief}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Section Droite: Résultat */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="premium-card p-8 min-h-[500px] flex flex-col h-full bg-white relative"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-orange-500" />
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                    Atelier Éditorial
                  </h2>
                </div>
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
                </div>
              </div>
              <Result publication={result?.publication} note={result?.note} isLoading={isLoading} />
            </motion.div>
          </div>

        </div>
      </main>

      <footer className="mt-auto border-t border-slate-200/60 bg-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            &copy; 2024 AI Forge — Tous droits réservés
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest cursor-default">Privacy</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest cursor-default">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
