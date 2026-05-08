import { describe, it, expect } from 'vitest';
import { buildUserPrompt } from '../lib/prompt';

describe('Générateur de Prompts', () => {
  it('doit inclure les informations du brief dans le prompt utilisateur', () => {
    const params = {
      description: 'Entreprise de conseil.',
      brief: 'Post sur le télétravail.',
      tone: 'Professionnel'
    };
    const prompt = buildUserPrompt(params);
    expect(prompt).toContain('Entreprise de conseil.');
    expect(prompt).toContain('Post sur le télétravail.');
    expect(prompt).toContain('Professionnel');
  });
});
