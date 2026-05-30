'use client';

import { Copy, Check } from 'lucide-react';
import { useClipboard } from '@/hooks/useClipboard';

interface CopyButtonProps {
  text: string;
  className?: string;
}

/**
 * Reusable copy-to-clipboard button with visual feedback.
 * Uses the useClipboard hook to eliminate duplication.
 */
export default function CopyButton({ text, className = '' }: CopyButtonProps) {
  const { copied, copy } = useClipboard();

  return (
    <button
      onClick={() => copy(text)}
      className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-lg transition-all duration-500 ${
        copied
          ? 'bg-green-500 text-white'
          : 'border border-black/5 bg-black/5 text-slate-500 backdrop-blur-md hover:bg-[var(--color-accent)] hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-white/50'
      } ${className}`}
      title="Copier le texte"
      aria-label={copied ? 'Texte copié' : 'Copier le texte'}
    >
      {copied ? (
        <Check className="h-5 w-5" strokeWidth={3} />
      ) : (
        <Copy className="h-5 w-5" />
      )}
    </button>
  );
}
