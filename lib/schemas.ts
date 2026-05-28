import { z } from 'zod';

export const generationSchema = z.object({
  mode: z.enum(['generate', 'roast']).default('generate'),
  description: z.string().optional(),
  brief: z.string().optional(),
  draft: z.string().optional(),
  tone: z.enum(['Professionnel', 'Chaleureux', 'Expert', 'Dynamique', 'Créatif'], {
    error: "Veuillez sélectionner un ton valide."
  }).optional(),
}).refine(data => {
  if (data.mode === 'generate') {
    return !!data.description && !!data.brief && !!data.tone;
  } else if (data.mode === 'roast') {
    return !!data.draft;
  }
  return false;
}, {
  message: "Veuillez remplir les champs obligatoires selon le mode sélectionné.",
  path: ["mode"],
});

export type GenerationParams = z.infer<typeof generationSchema>;

export const responseSchema = z.object({
  publication: z.string().min(1).max(1300),
  note: z.string().min(1),
});

export type GenerationResponse = z.infer<typeof responseSchema>;
