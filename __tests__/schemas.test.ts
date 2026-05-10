import { describe, it, expect } from 'vitest';
import { generationSchema, responseSchema } from '../lib/schemas';

describe('generationSchema — Validation des entrées', () => {
  it('valide une entrée correcte', () => {
    const data = {
      description: 'Une PME française dans le secteur de la tech.',
      brief: 'Annonce de recrutement.',
      tone: 'Professionnel'
    };
    const result = generationSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('échoue si la description est trop courte (< 10 caractères)', () => {
    const data = { description: 'Court', brief: 'Annonce.', tone: 'Professionnel' };
    const result = generationSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('échoue si la description dépasse 2000 caractères', () => {
    const data = {
      description: 'x'.repeat(2001),
      brief: 'Annonce de recrutement.',
      tone: 'Professionnel'
    };
    const result = generationSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('accepte une description de exactement 2000 caractères', () => {
    const data = {
      description: 'x'.repeat(2000),
      brief: 'Annonce de recrutement.',
      tone: 'Professionnel'
    };
    const result = generationSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('échoue si le brief est trop court (< 5 caractères)', () => {
    const data = {
      description: 'Une entreprise valide.',
      brief: 'Hel',
      tone: 'Expert'
    };
    const result = generationSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('échoue si le brief dépasse 500 caractères', () => {
    const data = {
      description: 'Une entreprise valide.',
      brief: 'b'.repeat(501),
      tone: 'Expert'
    };
    const result = generationSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('échoue si le ton est invalide', () => {
    const data = {
      description: 'Une PME française.',
      brief: 'Annonce de recrutement.',
      tone: 'Agressif'
    };
    const result = generationSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('accepte tous les tons valides', () => {
    const validTones = ['Professionnel', 'Chaleureux', 'Expert', 'Dynamique', 'Créatif'];
    for (const tone of validTones) {
      const result = generationSchema.safeParse({
        description: 'Une entreprise valide pour le test.',
        brief: 'Brief valide.',
        tone,
      });
      expect(result.success, `Échec pour le ton: ${tone}`).toBe(true);
    }
  });

  it('échoue si la description est absente', () => {
    const result = generationSchema.safeParse({ brief: 'Test', tone: 'Expert' });
    expect(result.success).toBe(false);
  });

  it('échoue si le brief est absent', () => {
    const result = generationSchema.safeParse({ description: 'Entreprise valide.', tone: 'Expert' });
    expect(result.success).toBe(false);
  });
});

describe('responseSchema — Validation des réponses IA', () => {
  it('valide une réponse IA correcte', () => {
    const data = {
      publication: '🚀 Post LinkedIn valide avec du contenu.',
      note: 'Note expliquant les choix éditoriaux.'
    };
    const result = responseSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('échoue si la publication est vide', () => {
    const result = responseSchema.safeParse({ publication: '', note: 'Note valide.' });
    expect(result.success).toBe(false);
  });

  it('échoue si la note est vide', () => {
    const result = responseSchema.safeParse({ publication: 'Post valide.', note: '' });
    expect(result.success).toBe(false);
  });

  it('échoue si la publication dépasse 1300 caractères', () => {
    const result = responseSchema.safeParse({
      publication: 'x'.repeat(1301),
      note: 'Note valide.'
    });
    expect(result.success).toBe(false);
  });

  it('accepte une publication de exactement 1300 caractères', () => {
    const result = responseSchema.safeParse({
      publication: 'x'.repeat(1300),
      note: 'Note valide.'
    });
    expect(result.success).toBe(true);
  });

  it('échoue si un champ est manquant', () => {
    expect(responseSchema.safeParse({ publication: 'Test' }).success).toBe(false);
    expect(responseSchema.safeParse({ note: 'Test' }).success).toBe(false);
    expect(responseSchema.safeParse({}).success).toBe(false);
  });
});
