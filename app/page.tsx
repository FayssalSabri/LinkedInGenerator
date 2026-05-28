'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Form from '@/components/Form';
import Result from '@/components/Result';
import Navbar from '@/components/Navbar';
import { type GenerationParams, type GenerationResponse } from '@/lib/schemas';
import { saveToHistory } from '@/lib/storage';
import { toast } from 'sonner';

export default function Home() {
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [currentFormData, setCurrentFormData] = useState<GenerationParams | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSubmit = useCallback(async (formData: GenerationParams) => {
    // Cancel any in-flight request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setCurrentFormData(formData);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue.');
      }

      setResult(data);

      // Save to history via safe storage wrapper
      saveToHistory({
        params: formData,
        publication: data.publication,
        note: data.note,
      });

      toast.success('Publication générée avec succès');

    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const errorMsg = err instanceof Error ? err.message : 'Une erreur inattendue est survenue.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleImprove = useCallback(async (feedback: string) => {
    if (!result?.publication || !currentFormData) return;
    
    const improveData: GenerationParams = {
      ...currentFormData,
      mode: 'improve',
      draft: result.publication,
      feedback: feedback
    };

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(improveData),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue.');
      }

      setResult(data);

      saveToHistory({
        params: improveData,
        publication: data.publication,
        note: data.note,
      });

      toast.success('Publication améliorée avec succès');

    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const errorMsg = err instanceof Error ? err.message : 'Une erreur inattendue est survenue.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [result, currentFormData]);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[var(--color-bg)]">
      <Navbar />

      {/* Main Workspace */}
      <main className="flex-1 overflow-hidden w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">

        {/* Left Column: Form */}
        <div className="w-full lg:w-[40%] h-full flex flex-col overflow-hidden bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-3xl p-6 lg:p-8 shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-full"
          >
            <div className="mb-6 lg:mb-8 flex-shrink-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                Forge Studio
              </h1>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md">
                Configurez votre identité et votre message pour générer une publication LinkedIn à forte valeur ajoutée.
              </p>
            </div>

            <div className="flex-1 flex flex-col">
              <Form onSubmit={handleSubmit} isLoading={isLoading} />
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 lg:mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-2xl flex items-center gap-3"
                    role="alert"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Result / Preview */}
        <div className="w-full lg:w-[60%] h-full flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center justify-start rounded-3xl lg:pl-6">
            <Result publication={result?.publication} note={result?.note} isLoading={isLoading} onImprove={handleImprove} />
          </div>
        </div>

      </main>
    </div>
  );
}
