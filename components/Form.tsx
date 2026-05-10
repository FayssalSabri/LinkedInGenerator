'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generationSchema, type GenerationParams } from '@/lib/schemas';
import { BespokeIcons } from '@/components/BespokeIcons';
import { ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCallback } from 'react';

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
    formState: { errors },
  } = useForm<GenerationParams>({
    resolver: zodResolver(generationSchema),
    defaultValues: {
      tone: 'Professionnel',
      description: '',
      brief: '',
    },
  });

  const tone = watch('tone');
  const descriptionLength = watch('description')?.length ?? 0;
  const briefLength = watch('brief')?.length ?? 0;

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
      className="space-y-8 lg:space-y-10"
      aria-label="Formulaire de génération LinkedIn"
    >
      {/* Description Field */}
      <div className="space-y-3">
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
          className="input-field min-h-[100px] lg:min-h-[120px]"
          placeholder="Décrivez votre entreprise, son secteur, ses valeurs..."
          aria-describedby={errors.description ? 'desc-error' : undefined}
          aria-invalid={!!errors.description}
          disabled={isLoading}
        />
        {errors.description && (
          <p id="desc-error" className="text-xs text-red-400/80 px-1 font-medium" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Brief Field */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <label htmlFor="brief" className="field-label">
            Brief de Publication
          </label>
          <span className={`char-counter ${briefLength > 500 ? 'char-counter-danger' : ''}`}>
            {briefLength} / 500
          </span>
        </div>
        <div className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-5 py-4 sm:px-6 sm:py-5 focus-within:border-[var(--color-border-hover)] focus-within:bg-[var(--color-surface-hover)] transition-all">
          <textarea
            id="brief"
            {...register('brief')}
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
            className="w-full bg-transparent border-none text-base sm:text-lg text-white placeholder:text-slate-700 focus:ring-0 p-0 resize-none min-h-[50px] leading-relaxed font-semibold outline-none"
            placeholder="Quel est l'enjeu de ce post ?"
            aria-describedby={errors.brief ? 'brief-error' : undefined}
            aria-invalid={!!errors.brief}
            disabled={isLoading}
          />
        </div>
        {errors.brief && (
          <p id="brief-error" className="text-xs text-red-400/80 px-1 font-medium" role="alert">
            {errors.brief.message}
          </p>
        )}
      </div>

      <div className="pt-6 lg:pt-8 border-t border-[var(--color-border)]">
        <label className="field-label px-1 mb-6 block" id="tone-label">
          Tonalité souhaitée
        </label>

        <div className="flex items-center justify-between gap-3 sm:gap-4">
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
                className={`tone-chip px-2.5 py-1.5 ${tone === t.id ? 'tone-chip-active' : 'tone-chip-inactive'}`}
              >
                {t.icon}
                <span className="uppercase tracking-wider whitespace-nowrap">{t.label}</span>
              </button>
            ))}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileTap={isLoading ? {} : { scale: 0.92 }}
            className={`flex-shrink-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl transition-all duration-500 ${
              isLoading
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-[0_10px_30px_var(--color-accent-glow)] hover:scale-105'
            }`}
            aria-label={isLoading ? 'Génération en cours' : 'Générer la publication (⌘ + Entrée)'}
            title="⌘ + Entrée"
          >
            {isLoading ? (
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
            )}
          </motion.button>
        </div>
      </div>
    </form>
  );
}
