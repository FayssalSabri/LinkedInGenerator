'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Form from '@/components/Form';
import Result from '@/components/Result';
import Navbar from '@/components/Navbar';
import { requestGeneration } from '@/lib/generateClient';
import {
  type FormGenerationParams,
  type GenerationParams,
  type GenerationResponse,
} from '@/lib/schemas';
import { toast } from 'sonner';

export default function Home() {
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [currentFormData, setCurrentFormData] =
    useState<GenerationParams | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const saveToDb = useCallback(
    async (params: GenerationParams, publication: string, note: string) => {
      try {
        await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: params.mode,
            description: params.description,
            brief: params.brief,
            tone: params.tone,
            draft: params.draft,
            publication,
            note,
          }),
        });
      } catch {
        console.warn('[history] Failed to save to database');
      }
    },
    []
  );

  const runGeneration = useCallback(
    async (params: GenerationParams, successMessage: string) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setCurrentFormData(params);
      setIsLoading(true);
      setError(null);
      setResult(null);

      // Scroll to result on mobile
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setTimeout(() => {
          document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }

      try {
        const data = await requestGeneration(params, controller.signal);
        setResult(data);
        saveToDb(params, data.publication, data.note);
        toast.success(successMessage);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        const errorMsg =
          err instanceof Error
            ? err.message
            : 'Une erreur inattendue est survenue.';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [saveToDb]
  );

  const handleSubmit = useCallback(
    (formData: FormGenerationParams) =>
      runGeneration(formData, 'Publication générée avec succès'),
    [runGeneration]
  );

  const handleImprove = useCallback(
    async (feedback: string) => {
      if (!result?.publication || !currentFormData) return;

      const improveData: GenerationParams = {
        ...currentFormData,
        mode: 'improve',
        draft: result.publication,
        feedback,
      };

      await runGeneration(improveData, 'Publication améliorée avec succès');
    },
    [result, currentFormData, runGeneration]
  );

  return (
    <div className="flex min-h-[100dvh] w-screen flex-col overflow-x-hidden bg-[var(--color-bg)] lg:h-screen lg:overflow-hidden">
      <Navbar isAnimating={isLoading} />

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:gap-8 lg:overflow-hidden lg:p-8">
        <div className="flex w-full flex-col rounded-3xl border border-slate-200 bg-slate-50/50 p-6 shadow-lg dark:border-white/[0.05] dark:bg-white/[0.02] lg:h-full lg:w-[40%] lg:overflow-hidden lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex h-full flex-col"
          >
            <div className="mb-6 flex-shrink-0 lg:mb-8">
              <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Forge Studio
              </h1>
              <p className="max-w-md text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
                Configurez votre identité et votre message pour générer une
                publication LinkedIn à forte valeur ajoutée.
              </p>
            </div>

            <div className="flex flex-1 flex-col">
              <Form onSubmit={handleSubmit} isLoading={isLoading} />
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-600 dark:text-red-400 lg:mt-8"
                    role="alert"
                  >
                    <div className="h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full bg-red-500" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <div id="result-section" className="relative flex w-full flex-col lg:h-full lg:w-[60%] lg:overflow-hidden">
          <div className="custom-scrollbar flex flex-1 flex-col items-center justify-start rounded-3xl pb-10 lg:overflow-y-auto lg:pl-6 lg:pb-0">
            <Result
              publication={result?.publication}
              note={result?.note}
              isLoading={isLoading}
              onImprove={handleImprove}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
