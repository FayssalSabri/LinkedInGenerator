'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generationSchema, type GenerationParams } from '@/lib/schemas';
import { BespokeIcons } from '@/components/BespokeIcons';
import { ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormProps {
  onSubmit: (data: GenerationParams) => void;
  isLoading: boolean;
}

const tones = [
  { id: "Professionnel", label: "Pro", icon: <BespokeIcons.Pro className="w-4 h-4" /> },
  { id: "Chaleureux", label: "Warm", icon: <BespokeIcons.Warm className="w-4 h-4" /> },
  { id: "Expert", label: "Expert", icon: <BespokeIcons.Expert className="w-4 h-4" /> },
  { id: "Dynamique", label: "Fast", icon: <BespokeIcons.Dynamic className="w-4 h-4" /> },
  { id: "Créatif", label: "Creative", icon: <BespokeIcons.Creative className="w-4 h-4" /> },
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Description Field */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identité & Contexte</label>
          <span className={`text-[10px] font-bold tabular-nums ${descriptionLength > 2000 ? 'text-red-400' : 'text-slate-600'}`}>
            {descriptionLength} / 2,000
          </span>
        </div>
        <textarea
          {...register('description')}
          className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl px-6 py-5 text-[16px] text-white/90 placeholder:text-slate-700 focus:border-[#1FB8CD]/40 focus:bg-white/[0.04] outline-none transition-all resize-none min-h-[120px] leading-relaxed font-medium"
          placeholder="Décrivez votre entreprise, son secteur, ses valeurs..."
        />
        {errors.description && <p className="text-xs text-red-400/80 px-1 font-medium">{errors.description.message}</p>}
      </div>

      {/* Brief Field */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Brief de Publication</label>
          <span className={`text-[10px] font-bold tabular-nums ${briefLength > 500 ? 'text-red-400' : 'text-slate-600'}`}>
            {briefLength} / 500
          </span>
        </div>
        <div className="relative bg-white/[0.02] border border-white/[0.05] rounded-2xl px-6 py-5 focus-within:border-[#1FB8CD]/40 focus-within:bg-white/[0.04] transition-all">
          <textarea
            {...register('brief')}
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
            className="w-full bg-transparent border-none text-[18px] text-white placeholder:text-slate-700 focus:ring-0 p-0 resize-none min-h-[50px] leading-relaxed font-semibold"
            placeholder='Quel est l’enjeu de ce post ?'
          />
        </div>
        {errors.brief && <p className="text-xs text-red-400/80 px-1 font-medium">{errors.brief.message}</p>}
      </div>

      {/* Tone & Submit Button - Cleaner Layout */}
      <div className="pt-6 border-t border-white/[0.03]">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1 mb-6 block">Tonalité souhaitée</label>
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto custom-scrollbar pb-2 flex-1">
            {tones.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setValue('tone', t.id as any)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 border ${
                  tone === t.id 
                    ? 'bg-[#1FB8CD] text-white border-transparent shadow-[0_0_15px_rgba(31,184,205,0.2)]' 
                    : 'text-slate-500 border-white/[0.05] hover:bg-white/5 hover:text-slate-300'
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
            className={`flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500 ${
              isLoading 
                ? 'bg-slate-800 text-slate-600' 
                : 'bg-[#1FB8CD] text-white hover:bg-[#1DA8BA] shadow-[0_10px_30px_rgba(31,184,205,0.15)] hover:scale-105 active:scale-95'
            }`}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-6 h-6" strokeWidth={3} />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
