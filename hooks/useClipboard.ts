'use client';

import { useState, useCallback } from 'react';

/**
 * Custom hook for clipboard operations with visual feedback.
 * Eliminates copy-paste duplication across components.
 * @param timeout - Duration in ms to show the "copied" state (default 2000ms)
 */
export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
      } catch {
        console.error('[useClipboard] Échec de la copie');
      }
    },
    [timeout]
  );

  return { copied, copy };
}
