'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.03] transition-colors hover:bg-white/[0.08]"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-slate-900 transition-all dark:-rotate-90 dark:scale-0 dark:text-white" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 text-slate-900 transition-all dark:rotate-0 dark:scale-100 dark:text-white" />
    </button>
  );
}
