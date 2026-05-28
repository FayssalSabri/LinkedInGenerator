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
      className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 shadow-lg ${
        copied
          ? 'bg-green-500 text-white'
          : 'bg-black/5 dark:bg-white/10 text-slate-500 dark:text-white/50 hover:bg-[var(--color-accent)] hover:text-white backdrop-blur-md border border-black/5 dark:border-white/10'
      } ${className}`}
      title="Copier le texte"
      aria-label={copied ? 'Texte copié' : 'Copier le texte'}
    >
      {copied ? <Check className="w-5 h-5" strokeWidth={3} /> : <Copy className="w-5 h-5" />}
    </button>
  );
}
