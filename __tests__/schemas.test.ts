import { describe, it, expect } from 'vitest';
import { generationSchema } from '../lib/schemas';

describe('Validation des schémas Zod', () => {
  it('doit valider une entrée correcte', () => {
    const data = {
      description: 'Une PME française dans le secteur de la tech.',
      brief: 'Annonce de recrutement.',
      tone: 'Professionnel'
    };
    const result = generationSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('doit échouer si la description est trop courte', () => {
    const data = {
      description: 'Court',
      brief: 'Annonce de recrutement.',
      tone: 'Professionnel'
    };
    const result = generationSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('doit échouer si le ton est invalide', () => {
    const data = {
      description: 'Une PME française dans le secteur de la tech.',
      brief: 'Annonce de recrutement.',
      tone: 'Agreessif' // Ton non supporté
    };
    const result = generationSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
