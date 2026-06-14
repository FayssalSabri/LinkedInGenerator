'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[Next.js Global Error]', error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[var(--color-bg)] px-4 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
        <svg
          className="h-8 w-8 text-red-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
        Quelque chose s&apos;est mal passé !
      </h2>
      <p className="mx-auto mb-8 max-w-md text-slate-500 dark:text-slate-400">
        Nous avons rencontré un problème lors du chargement de cette page.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[var(--color-accent-hover)]"
      >
        Réessayer
      </button>
    </div>
  );
}
