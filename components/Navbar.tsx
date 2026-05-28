'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PenSquare, History } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

/**
 * Shared navigation bar component.
 * Uses pathname to determine active state — eliminates duplication
 * between page.tsx and history/page.tsx.
 */
export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="flex-shrink-0 h-16 border-b border-white/[0.03] bg-[var(--color-bg)] z-50 flex items-center justify-between px-6 sm:px-8 lg:px-16"
      role="navigation"
      aria-label="Navigation principale"
    >
      <Link href="/" className="flex items-center gap-3 group" aria-label="Accueil Forge Studio">
        <div className="relative w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-all">
          <img
            src="/logo.svg"
            alt="Forge Studio"
            className="w-full h-full object-contain p-1.5"
          />
        </div>
        <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-white/90 hidden sm:inline">
          Forge Studio
        </span>
      </Link>

      <div className="flex items-center gap-1 bg-black/5 dark:bg-white/[0.03] p-1 rounded-xl border border-black/5 dark:border-white/[0.05]">
        <Link
          href="/"
          className={`nav-item !px-4 sm:!px-5 !py-1.5 !rounded-lg text-xs ${
            pathname === '/' ? 'nav-item-active' : 'nav-item-inactive'
          }`}
          aria-current={pathname === '/' ? 'page' : undefined}
        >
          <PenSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Atelier</span>
        </Link>
        <Link
          href="/history"
          className={`nav-item !px-4 sm:!px-5 !py-1.5 !rounded-lg text-xs ${
            pathname === '/history' ? 'nav-item-active' : 'nav-item-inactive'
          }`}
          aria-current={pathname === '/history' ? 'page' : undefined}
        >
          <History className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bibliothèque</span>
        </Link>
        <div className="ml-2 pl-2 border-l border-black/10 dark:border-white/[0.05]">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
