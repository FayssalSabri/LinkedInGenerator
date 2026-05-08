import { z } from 'zod';

export const generationSchema = z.object({
  description: z.string()
    .min(10, "La description doit faire au moins 10 caractères.")
    .max(2000, "La description ne peut pas dépasser 2000 caractères."),
  brief: z.string()
    .min(5, "Le brief doit faire au moins 5 caractères.")
    .max(500, "Le brief ne peut pas dépasser 500 caractères."),
  tone: z.enum(['Professionnel', 'Chaleureux', 'Expert', 'Dynamique', 'Créatif'], {
    error: "Veuillez sélectionner un ton valide."
  }),
});

export type GenerationParams = z.infer<typeof generationSchema>;

export const responseSchema = z.object({
  publication: z.string().min(1).max(1300),
  note: z.string().min(1),
});

export type GenerationResponse = z.infer<typeof responseSchema>;
