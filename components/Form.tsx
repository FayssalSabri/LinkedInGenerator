'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generationSchema, type GenerationParams } from '@/lib/schemas';
import { BespokeIcons } from '@/components/BespokeIcons';
import { ArrowUp, Sparkles, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCallback, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

interface FormProps {
  onSubmit: (data: GenerationParams) => void;
  isLoading: boolean;
}

const tones = [
  { id: "Professionnel", label: "Pro", icon: <BespokeIcons.Pro className="w-4 h-4" /> },
  { id: "Chaleureux", label: "Chaleureux", icon: <BespokeIcons.Warm className="w-4 h-4" /> },
  { id: "Expert", label: "Expert", icon: <BespokeIcons.Expert className="w-4 h-4" /> },
  { id: "Dynamique", label: "Dynamique", icon: <BespokeIcons.Dynamic className="w-4 h-4" /> },
  { id: "Créatif", label: "Créatif", icon: <BespokeIcons.Creative className="w-4 h-4" /> },
] as const;

export default function Form({ onSubmit, isLoading }: FormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(generationSchema),
    defaultValues: {
      mode: 'generate',
      tone: 'Professionnel',
      description: '',
      brief: '',
      draft: '',
    },
  });

  const mode = watch('mode');
  const tone = watch('tone');
  const descriptionLength = watch('description')?.length ?? 0;
  const briefLength = watch('brief')?.length ?? 0;
  const draftLength = watch('draft')?.length ?? 0;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  }, [handleSubmit, onSubmit, isLoading]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={handleKeyDown}
      className="space-y-5 lg:space-y-6 flex flex-col h-full"
      aria-label="Formulaire de génération LinkedIn"
    >
      <Tabs.Root
        defaultValue="generate"
        value={mode}
        onValueChange={(v) => {
          setValue('mode', v as 'generate' | 'roast');
          clearErrors();
        }}
        className="flex-1 flex flex-col"
      >
        <Tabs.List className="flex w-full border-b border-[var(--color-border)] mb-6">
          <Tabs.Trigger
            value="generate"
            className="flex-1 flex items-center justify-center gap-2 pb-3 text-sm font-semibold transition-colors border-b-2 data-[state=active]:border-[var(--color-accent)] data-[state=active]:text-[var(--color-accent)] text-slate-500 hover:text-slate-300 data-[state=inactive]:border-transparent"
          >
            <Sparkles className="w-4 h-4" />
            Générer
          </Tabs.Trigger>
          <Tabs.Trigger
            value="roast"
            className="flex-1 flex items-center justify-center gap-2 pb-3 text-sm font-semibold transition-colors border-b-2 data-[state=active]:border-[var(--color-accent)] data-[state=active]:text-[var(--color-accent)] text-slate-500 hover:text-slate-300 data-[state=inactive]:border-transparent"
          >
            <Flame className="w-4 h-4" />
            Roaster mon Draft
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="generate" className="space-y-5 lg:space-y-6 focus:outline-none flex-1 flex flex-col">
          {/* Description Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label htmlFor="description" className="field-label">
                Identité &amp; Contexte
              </label>
              <span className={`char-counter ${descriptionLength > 2000 ? 'char-counter-danger' : ''}`}>
                {descriptionLength} / 2 000
              </span>
            </div>
            <textarea
              id="description"
              {...register('description')}
              className="input-field min-h-[100px] lg:min-h-[190px] flex-shrink"
              placeholder="Décrivez votre entreprise, son secteur, ses valeurs..."
              aria-describedby={errors.description ? 'desc-error' : undefined}
              aria-invalid={!!errors.description}
              disabled={isLoading}
            />
            {errors.description && (
              <p id="desc-error" className="text-xs text-red-400/80 px-1 font-medium" role="alert">
                {errors.description.message as string}
              </p>
            )}
          </div>

          {/* Brief Field */}
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex justify-between items-center px-1">
              <label htmlFor="brief" className="field-label">
                Brief de Publication
              </label>
              <span className={`char-counter ${briefLength > 500 ? 'char-counter-danger' : ''}`}>
                {briefLength} / 500
              </span>
            </div>
            <textarea
              id="brief"
              {...register('brief')}
              className="input-field flex-1 min-h-[80px] lg:min-h-[110px]"
              placeholder="Quel est l'enjeu de ce post ?"
              aria-describedby={errors.brief ? 'brief-error' : undefined}
              aria-invalid={!!errors.brief}
              disabled={isLoading}
            />
            {errors.brief && (
              <p id="brief-error" className="text-xs text-red-400/80 px-1 font-medium" role="alert">
                {errors.brief.message as string}
              </p>
            )}
          </div>

          <div className="pt-4 lg:pt-5 border-t border-[var(--color-border)]">
            <label className="field-label px-1 mb-3 block" id="tone-label">
              Tonalité souhaitée
            </label>

            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div
                className="flex flex-nowrap items-center gap-1.5 flex-1 overflow-x-auto no-scrollbar"
                role="radiogroup"
                aria-labelledby="tone-label"
              >
                {tones.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={tone === t.id}
                    onClick={() => setValue('tone', t.id as GenerationParams['tone'])}
                    disabled={isLoading}
                    className={`tone-chip px-2 py-1.5 ${tone === t.id ? 'tone-chip-active' : 'tone-chip-inactive'}`}
                  >
                    {t.icon}
                    <span className="uppercase tracking-wider whitespace-nowrap">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="roast" className="space-y-5 lg:space-y-6 focus:outline-none flex-1 flex flex-col">
          {/* Draft Field */}
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex justify-between items-center px-1">
              <label htmlFor="draft" className="field-label">
                Brouillon à améliorer
              </label>
              <span className={`char-counter ${draftLength > 2000 ? 'char-counter-danger' : ''}`}>
                {draftLength} / 2 000
              </span>
            </div>
            <textarea
              id="draft"
              {...register('draft')}
              className="input-field flex-1 min-h-[180px] lg:min-h-[220px]"
              placeholder="Collez ici votre brouillon de post. L'IA va le roaster et l'améliorer..."
              aria-describedby={errors.draft ? 'draft-error' : undefined}
              aria-invalid={!!errors.draft}
              disabled={isLoading}
            />
            {errors.draft && (
              <p id="draft-error" className="text-xs text-red-400/80 px-1 font-medium" role="alert">
                {errors.draft.message as string}
              </p>
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Submit Button placed globally at the bottom */}
      <div className="flex justify-end pt-4 mt-auto border-t border-slate-200 dark:border-white/[0.05] flex-shrink-0">
        <motion.button
          type="submit"
          disabled={isLoading}
          whileTap={isLoading ? {} : { scale: 0.92 }}
          className={`flex-shrink-0 flex items-center justify-center w-full h-12 sm:h-14 rounded-2xl transition-all duration-500 ${isLoading
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-600 cursor-not-allowed'
            : 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-[0_10px_30px_var(--color-accent-glow)] hover:scale-[1.02]'
            }`}
          aria-label={isLoading ? 'Action en cours' : (mode === 'generate' ? 'Générer (⌘ + Entrée)' : 'Roaster (⌘ + Entrée)')}
          title="⌘ + Entrée"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="font-semibold">{mode === 'generate' ? 'Génération...' : 'Analyse en cours...'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {mode === 'generate' ? <ArrowUp className="w-5 h-5" strokeWidth={3} /> : <Flame className="w-5 h-5" strokeWidth={3} />}
              <span className="font-bold text-lg">{mode === 'generate' ? 'Générer la publication' : 'Roaster & Améliorer'}</span>
            </div>
          )}
        </motion.button>
      </div>
    </form>
  );
}
