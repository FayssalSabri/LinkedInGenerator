import { z } from 'zod';

const toneSchema = z.enum(
  ['Professionnel', 'Chaleureux', 'Expert', 'Dynamique', 'Créatif'],
  { error: 'Veuillez sélectionner un ton valide.' }
);

const generateInputSchema = z.object({
  mode: z.literal('generate'),
  description: z
    .string()
    .min(10, 'La description doit faire au moins 10 caractères.')
    .max(2000, 'La description ne doit pas dépasser 2000 caractères.'),
  brief: z
    .string()
    .min(5, 'Le brief doit faire au moins 5 caractères.')
    .max(500, 'Le brief ne doit pas dépasser 500 caractères.'),
  tone: toneSchema,
  draft: z.string().optional(),
  feedback: z.string().optional(),
});

const roastInputSchema = z.object({
  mode: z.literal('roast'),
  draft: z
    .string()
    .min(10, 'Le brouillon doit faire au moins 10 caractères.')
    .max(2000, 'Le brouillon ne doit pas dépasser 2000 caractères.'),
  description: z.string().optional(),
  brief: z.string().optional(),
  tone: toneSchema.optional(),
  feedback: z.string().optional(),
});

const improveInputSchema = z.object({
  mode: z.literal('improve'),
  draft: z
    .string()
    .min(10, 'Le brouillon doit faire au moins 10 caractères.')
    .max(2000, 'Le brouillon ne doit pas dépasser 2000 caractères.'),
  feedback: z
    .string()
    .min(3, 'Le feedback doit faire au moins 3 caractères.')
    .max(1000, 'Le feedback ne doit pas dépasser 1000 caractères.'),
  description: z.string().optional(),
  brief: z.string().optional(),
  tone: toneSchema.optional(),
});

const generationUnion = z.discriminatedUnion('mode', [
  generateInputSchema,
  roastInputSchema,
  improveInputSchema,
]);

/** Defaults missing `mode` to `generate` for API and form payloads. */
export const generationSchema = z.preprocess((value) => {
  if (typeof value === 'object' && value !== null && !('mode' in value)) {
    return { ...value, mode: 'generate' };
  }
  return value;
}, generationUnion);

export type GenerationParams = z.infer<typeof generationUnion>;

/** Schema for the studio form (generate + roast tabs only). */
export const formGenerationSchema = z.discriminatedUnion('mode', [
  generateInputSchema,
  roastInputSchema,
]);

export type FormGenerationParams = z.infer<typeof formGenerationSchema>;

export const responseSchema = z.object({
  publication: z.string().min(1).max(1300),
  note: z.string().min(1).max(5000),
});

export type GenerationResponse = z.infer<typeof responseSchema>;

export const historyCreateSchema = z.object({
  mode: z.enum(['generate', 'roast', 'improve']).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  brief: z.string().max(500).optional().nullable(),
  tone: z.string().max(50).optional().nullable(),
  draft: z.string().max(2000).optional().nullable(),
  publication: z.string().min(1).max(1300),
  note: z.string().min(1).max(5000),
  image: z.string().max(5000000).optional().nullable(),
});

export type HistoryCreateInput = z.infer<typeof historyCreateSchema>;
