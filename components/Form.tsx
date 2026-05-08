'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generationSchema, type GenerationParams } from '@/lib/schemas';
import { BespokeIcons } from '@/components/BespokeIcons';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormProps {
  onSubmit: (data: GenerationParams) => void;
  isLoading: boolean;
}

const tones = [
  { id: "Professionnel", label: "Pro", icon: <BespokeIcons.Pro className="w-3.5 h-3.5" /> },
  { id: "Chaleureux", label: "Warm", icon: <BespokeIcons.Warm className="w-3.5 h-3.5" /> },
  { id: "Expert", label: "Expert", icon: <BespokeIcons.Expert className="w-3.5 h-3.5" /> },
  { id: "Dynamique", label: "Fast", icon: <BespokeIcons.Dynamic className="w-3.5 h-3.5" /> },
  { id: "Créatif", label: "Creative", icon: <BespokeIcons.Creative className="w-3.5 h-3.5" /> },
];

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
  const descriptionLength = watch('description').length;
  const briefLength = watch('brief').length;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Description Field (Context) */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.12em]">Contexte de l'entreprise</label>
          <span className={`text-[10px] font-bold tabular-nums ${descriptionLength > 2000 ? 'text-red-400' : 'text-slate-500'}`}>
            {descriptionLength} / 2,000
          </span>
        </div>
        <textarea
          {...register('description')}
          rows={3}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-[15px] text-white/90 placeholder:text-slate-600 focus:border-[#1FB8CD]/50 outline-none transition-all resize-none min-h-[80px] leading-relaxed"
          placeholder="Décrivez votre entreprise, ses valeurs..."
        />
        {errors.description && <p className="text-[11px] text-red-400 px-1 font-medium">{errors.description.message}</p>}
      </div>

      {/* Brief Field (Prompt) */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.12em]">Brief de la publication</label>
          <span className={`text-[10px] font-bold tabular-nums ${briefLength > 500 ? 'text-red-400' : 'text-slate-500'}`}>
            {briefLength} / 500
          </span>
        </div>
        <div className="relative bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 focus-within:border-[#1FB8CD]/30 transition-all">
          <textarea
            {...register('brief')}
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
            className="w-full bg-transparent border-none text-[17px] text-white placeholder:text-slate-600 focus:ring-0 p-0 resize-none min-h-[44px] leading-relaxed font-medium"
            placeholder='De quoi doit parler ce post ?'
          />
        </div>
        {errors.brief && <p className="text-[11px] text-red-400 px-1 font-medium">{errors.brief.message}</p>}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex flex-wrap gap-2">
          {tones.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setValue('tone', t.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-bold transition-all duration-200 border ${
                tone === t.id 
                  ? 'bg-[#1FB8CD]/10 text-[#1FB8CD] border-[#1FB8CD]/30' 
                  : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white'
              }`}
            >
              {t.icon}
              <span className="uppercase tracking-wider">{t.label}</span>
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`flex items-center justify-center p-3 rounded-full transition-all duration-300 ${
            isLoading 
              ? 'bg-slate-700 text-slate-400' 
              : 'bg-[#1FB8CD] text-white hover:bg-[#1DA8BA] shadow-lg shadow-[#1FB8CD]/10 hover:scale-105'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ArrowUp className="w-5 h-5" strokeWidth={3} />
          )}
        </button>
      </div>
    </form>
  );
}
