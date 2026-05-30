import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Form from '../../components/Form';

describe('Composant Form', () => {
  const mockSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche les champs de formulaire correctement', () => {
    render(<Form onSubmit={mockSubmit} isLoading={false} />);
    expect(screen.getByLabelText(/Identité & Contexte/i)).toBeDefined();
    expect(screen.getByLabelText(/Brief de Publication/i)).toBeDefined();
    expect(
      screen.getByRole('button', { name: /Générer \(⌘ \+ Entrée\)/i })
    ).toBeDefined();
  });

  it('désactive le bouton de soumission pendant le chargement', () => {
    render(<Form onSubmit={mockSubmit} isLoading={true} />);
    const submitBtn = screen.getByRole('button', { name: /Action en cours/i });
    expect(submitBtn.hasAttribute('disabled')).toBe(true);
  });

  it('affiche des erreurs de validation pour les champs vides', async () => {
    render(<Form onSubmit={mockSubmit} isLoading={false} />);

    const submitBtn = screen.getByRole('button', {
      name: /Générer \(⌘ \+ Entrée\)/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/La description doit faire au moins 10 caractères/i)
      ).toBeDefined();
      expect(
        screen.getByText(/Le brief doit faire au moins 5 caractères/i)
      ).toBeDefined();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('soumet le formulaire avec des données valides', async () => {
    render(<Form onSubmit={mockSubmit} isLoading={false} />);

    const descInput = screen.getByLabelText(/Identité & Contexte/i);
    const briefInput = screen.getByLabelText(/Brief de Publication/i);

    fireEvent.change(descInput, {
      target: { value: 'Une entreprise valide et très intéressante.' },
    });
    fireEvent.change(briefInput, {
      target: { value: 'Un brief très clair et concis.' },
    });

    const submitBtn = screen.getByRole('button', {
      name: /Générer \(⌘ \+ Entrée\)/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
      expect(mockSubmit.mock.calls[0][0]).toMatchObject({
        mode: 'generate',
        description: 'Une entreprise valide et très intéressante.',
        brief: 'Un brief très clair et concis.',
        tone: 'Professionnel',
      });
    });
  });

  it('permet de changer de ton via les boutons', async () => {
    render(<Form onSubmit={mockSubmit} isLoading={false} />);

    const creativeBtn = screen.getByRole('radio', { name: /Créatif/i });
    fireEvent.click(creativeBtn);

    expect(creativeBtn.getAttribute('aria-checked')).toBe('true');
  });
});
