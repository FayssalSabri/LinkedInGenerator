'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formGenerationSchema, type FormGenerationParams } from '@/lib/schemas';
import { BespokeIcons } from '@/components/BespokeIcons';
import { ArrowUp, Sparkles, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

interface FormProps {
  onSubmit: (data: FormGenerationParams) => void;
  isLoading: boolean;
}

const tones = [
  {
    id: 'Professionnel',
    label: 'Pro',
    icon: <BespokeIcons.Pro className="h-4 w-4" />,
  },
  {
    id: 'Chaleureux',
    label: 'Chaleureux',
    icon: <BespokeIcons.Warm className="h-4 w-4" />,
  },
  {
    id: 'Expert',
    label: 'Expert',
    icon: <BespokeIcons.Expert className="h-4 w-4" />,
  },
  {
    id: 'Dynamique',
    label: 'Dynamique',
    icon: <BespokeIcons.Dynamic className="h-4 w-4" />,
  },
  {
    id: 'Créatif',
    label: 'Créatif',
    icon: <BespokeIcons.Creative className="h-4 w-4" />,
  },
] as const;

export default function Form({ onSubmit, isLoading }: FormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<FormGenerationParams>({
    resolver: zodResolver(formGenerationSchema),
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isLoading) {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }
    },
    [handleSubmit, onSubmit, isLoading]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={handleKeyDown}
      className="flex h-full flex-col space-y-5 lg:space-y-6"
      aria-label="Formulaire de génération LinkedIn"
    >
      <Tabs.Root
        defaultValue="generate"
        value={mode}
        onValueChange={(v) => {
          setValue('mode', v as FormGenerationParams['mode']);
          clearErrors();
        }}
        className="flex flex-1 flex-col"
      >
        <Tabs.List className="mb-6 flex w-full border-b border-[var(--color-border)]">
          <Tabs.Trigger
            value="generate"
            className="flex flex-1 items-center justify-center gap-2 border-b-2 pb-3 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-300 data-[state=active]:border-[var(--color-accent)] data-[state=inactive]:border-transparent data-[state=active]:text-[var(--color-accent)]"
          >
            <Sparkles className="h-4 w-4" />
            Générer
          </Tabs.Trigger>
          <Tabs.Trigger
            value="roast"
            className="flex flex-1 items-center justify-center gap-2 border-b-2 pb-3 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-300 data-[state=active]:border-[var(--color-accent)] data-[state=inactive]:border-transparent data-[state=active]:text-[var(--color-accent)]"
          >
            <Flame className="h-4 w-4" />
            Roaster mon Draft
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content
          value="generate"
          className="flex flex-1 flex-col space-y-5 focus:outline-none data-[state=inactive]:hidden lg:space-y-6"
        >
          {/* Description Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label htmlFor="description" className="field-label">
                Identité &amp; Contexte
              </label>
              <span
                className={`char-counter ${descriptionLength > 2000 ? 'char-counter-danger' : ''}`}
              >
                {descriptionLength} / 2 000
              </span>
            </div>
            <textarea
              id="description"
              {...register('description')}
              className="input-field min-h-[100px] flex-shrink lg:min-h-[190px]"
              placeholder="Décrivez votre entreprise, son secteur, ses valeurs..."
              aria-describedby={errors.description ? 'desc-error' : undefined}
              aria-invalid={!!errors.description}
              disabled={isLoading}
            />
            {errors.description && (
              <p
                id="desc-error"
                className="px-1 text-xs font-medium text-red-400/80"
                role="alert"
              >
                {errors.description.message as string}
              </p>
            )}
          </div>

          {/* Brief Field */}
          <div className="flex flex-1 flex-col space-y-2">
            <div className="flex items-center justify-between px-1">
              <label htmlFor="brief" className="field-label">
                Brief de Publication
              </label>
              <span
                className={`char-counter ${briefLength > 500 ? 'char-counter-danger' : ''}`}
              >
                {briefLength} / 500
              </span>
            </div>
            <textarea
              id="brief"
              {...register('brief')}
              className="input-field min-h-[80px] flex-1 lg:min-h-[110px]"
              placeholder="Quel est l'enjeu de ce post ?"
              aria-describedby={errors.brief ? 'brief-error' : undefined}
              aria-invalid={!!errors.brief}
              disabled={isLoading}
            />
            {errors.brief && (
              <p
                id="brief-error"
                className="px-1 text-xs font-medium text-red-400/80"
                role="alert"
              >
                {errors.brief.message as string}
              </p>
            )}
          </div>

          <div className="border-t border-[var(--color-border)] pt-4 lg:pt-5">
            <label className="field-label mb-3 block px-1" id="tone-label">
              Tonalité souhaitée
            </label>

            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div
                className="no-scrollbar flex flex-1 flex-nowrap items-center gap-1.5 overflow-x-auto"
                role="radiogroup"
                aria-labelledby="tone-label"
              >
                {tones.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={tone === t.id}
                    onClick={() =>
                      setValue('tone', t.id as FormGenerationParams['tone'])
                    }
                    disabled={isLoading}
                    className={`tone-chip px-2 py-1.5 ${tone === t.id ? 'tone-chip-active' : 'tone-chip-inactive'}`}
                  >
                    {t.icon}
                    <span className="whitespace-nowrap uppercase tracking-wider">
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content
          value="roast"
          className="flex flex-1 flex-col space-y-5 focus:outline-none data-[state=inactive]:hidden lg:space-y-6"
        >
          {/* Draft Field */}
          <div className="flex flex-1 flex-col space-y-2">
            <div className="flex items-center justify-between px-1">
              <label htmlFor="draft" className="field-label">
                Brouillon à améliorer
              </label>
              <span
                className={`char-counter ${draftLength > 2000 ? 'char-counter-danger' : ''}`}
              >
                {draftLength} / 2 000
              </span>
            </div>
            <textarea
              id="draft"
              {...register('draft')}
              className="input-field min-h-[180px] flex-1 lg:min-h-[220px]"
              placeholder="Collez ici votre brouillon de post. L'IA va le roaster et l'améliorer..."
              aria-describedby={errors.draft ? 'draft-error' : undefined}
              aria-invalid={!!errors.draft}
              disabled={isLoading}
            />
            {errors.draft && (
              <p
                id="draft-error"
                className="px-1 text-xs font-medium text-red-400/80"
                role="alert"
              >
                {errors.draft.message as string}
              </p>
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Submit Button placed globally at the bottom */}
      <div className="mt-auto flex flex-shrink-0 justify-end border-t border-slate-200 pt-4 dark:border-white/[0.05]">
        <motion.button
          type="submit"
          disabled={isLoading}
          whileTap={isLoading ? {} : { scale: 0.92 }}
          className={`flex h-14 w-full flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent)] px-6 text-white shadow-[0_10px_30px_var(--color-accent-glow)] transition-all duration-500 ${
            isLoading ? 'cursor-not-allowed opacity-80' : 'hover:scale-[1.02] hover:bg-[var(--color-accent-hover)]'
          }`}
          aria-label={
            isLoading
              ? 'Action en cours'
              : mode === 'generate'
                ? 'Générer (⌘ + Entrée)'
                : 'Roaster (⌘ + Entrée)'
          }
          title="⌘ + Entrée"
        >
          {isLoading ? (
            <span className="text-lg font-bold">
              {mode === 'generate' ? 'Génération...' : 'Analyse en cours...'}
            </span>
          ) : (
            <div className="flex items-center gap-2">
              {mode === 'generate' ? (
                <ArrowUp className="h-5 w-5" strokeWidth={3} />
              ) : (
                <Flame className="h-5 w-5" strokeWidth={3} />
              )}
              <span className="text-lg font-bold">
                {mode === 'generate'
                  ? 'Générer la publication'
                  : 'Roaster & Améliorer'}
              </span>
            </div>
          )}
        </motion.button>
      </div>
    </form>
  );
}
