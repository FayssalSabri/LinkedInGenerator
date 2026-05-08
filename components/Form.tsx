'use client';

import { useState } from 'react';
import { generationSchema, type GenerationParams } from '@/lib/schemas';
import { ChevronRight } from 'lucide-react';

interface FormProps {
  onSubmit: (data: GenerationParams) => void;
  isLoading: boolean;
}

export default function Form({ onSubmit, isLoading }: FormProps) {
  const [formData, setFormData] = useState<GenerationParams>({
    description: '',
    brief: '',
    tone: 'Professionnel',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const result = generationSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) newErrors[err.path[0] as string] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof GenerationParams, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <label htmlFor="description" className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Identité de l'entreprise
        </label>
        <textarea
          id="description"
          rows={5}
          maxLength={2000}
          aria-describedby="description-hint"
          aria-invalid={!!errors.description}
          className={`input-premium resize-none leading-relaxed ${errors.description ? 'border-red-200 focus:ring-red-500/10 focus:border-red-500' : ''}`}
          placeholder="Vision, valeurs, secteur d'activité..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
        <div id="description-hint" className="flex justify-between px-1">
          <span className="text-[10px] font-medium text-red-500">{errors.description}</span>
          <span className="text-[10px] font-bold text-slate-300 uppercase tabular-nums">
            {formData.description.length} <span className="text-slate-200">/</span> 2000
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="brief" className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Objectif du Post
        </label>
        <textarea
          id="brief"
          rows={3}
          maxLength={500}
          className={`input-premium resize-none leading-relaxed ${errors.brief ? 'border-red-200 focus:ring-red-500/10 focus:border-red-500' : ''}`}
          placeholder="Ex: Annonce de recrutement stratégique..."
          value={formData.brief}
          onChange={(e) => handleChange('brief', e.target.value)}
        />
        <div className="flex justify-between px-1">
          <span className="text-[10px] font-medium text-red-500">{errors.brief}</span>
          <span className="text-[10px] font-bold text-slate-300 uppercase tabular-nums">
            {formData.brief.length} <span className="text-slate-200">/</span> 500
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="tone" className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Direction Éditoriale
        </label>
        <div className="relative group">
          <select
            id="tone"
            className="input-premium appearance-none cursor-pointer pr-10"
            value={formData.tone}
            onChange={(e) => handleChange('tone', e.target.value)}
          >
            <option>Professionnel</option>
            <option>Chaleureux</option>
            <option>Expert</option>
            <option>Dynamique</option>
            <option>Sobre</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
            <ChevronRight className="h-4 w-4 rotate-90" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-premium flex items-center justify-center gap-2 group"
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Forge en cours...</span>
          </div>
        ) : (
          <>
            <span>Générer la publication</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
