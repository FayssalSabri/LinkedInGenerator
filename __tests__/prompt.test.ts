import { describe, it, expect } from 'vitest';
import { buildUserPrompt, buildSystemPrompt } from '../lib/prompt';
import { type GenerationParams } from '../lib/schemas';

describe('buildSystemPrompt', () => {
  it('contient les règles de rédaction essentielles', () => {
    const prompt = buildSystemPrompt('generate');
    expect(prompt).toContain('ACCROCHE');
    expect(prompt).toContain('1300 caractères');
  });

  it('inclut un exemple de qualité (few-shot) ou le format JSON', () => {
    const prompt = buildSystemPrompt('generate');
    expect(prompt).toContain('FORMAT DE RÉPONSE OBLIGATOIRE');
    expect(prompt).toContain('"publication"');
    expect(prompt).toContain('"note"');
  });

  it('décrit l\'obligation d\'imagePrompt', () => {
    const prompt = buildSystemPrompt('generate');
    expect(prompt).toContain('imagePrompt');
  });

  it('impose le format JSON obligatoire', () => {
    const prompt = buildSystemPrompt('generate');
    expect(prompt).toContain('FORMAT DE RÉPONSE OBLIGATOIRE');
    expect(prompt).toContain('JSON uniquement');
  });
});

describe('buildUserPrompt', () => {
  const params: GenerationParams = {
    mode: 'generate',
    description: 'Entreprise de conseil en transformation digitale.',
    brief: 'Annonce de recrutement d\'un développeur senior.',
    tone: 'Professionnel'
  };

  it('intègre la description de l\'entreprise', () => {
    const prompt = buildUserPrompt(params);
    expect(prompt).toContain('Entreprise de conseil en transformation digitale.');
  });

  it('intègre le brief du post', () => {
    const prompt = buildUserPrompt(params);
    expect(prompt).toContain('Annonce de recrutement d\'un développeur senior.');
  });

  it('intègre le ton demandé', () => {
    const prompt = buildUserPrompt(params);
    expect(prompt).toContain('Professionnel');
  });

  it('contient les sections structurantes', () => {
    const prompt = buildUserPrompt(params);
    expect(prompt).toContain('DESCRIPTION ENTREPRISE');
    expect(prompt).toContain('BRIEF DU POST');
    expect(prompt).toContain('TON DEMANDÉ');
  });

  it('demande explicitement le format JSON', () => {
    const prompt = buildUserPrompt(params);
    expect(prompt).toContain('format JSON');
  });

  it('fonctionne avec tous les tons', () => {
    const tones: GenerationParams['tone'][] = ['Professionnel', 'Chaleureux', 'Expert', 'Dynamique', 'Créatif'];
    for (const tone of tones) {
      const prompt = buildUserPrompt({ ...params, tone });
      expect(prompt).toContain(tone);
    }
  });
});
