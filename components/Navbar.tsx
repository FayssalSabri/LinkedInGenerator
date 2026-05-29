'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PenSquare, History } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { UserButton, SignInButton, SignUpButton, Show } from '@clerk/nextjs';

/**
 * Shared navigation bar component.
 * Uses pathname to determine active state — eliminates duplication
 * between page.tsx and history/page.tsx.
 */
export default function Navbar({ isAnimating = false }: { isAnimating?: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      className="flex-shrink-0 h-16 border-b border-white/[0.03] bg-[var(--color-bg)] z-50 flex items-center justify-between px-6 sm:px-8 lg:px-16"
      role="navigation"
      aria-label="Navigation principale"
    >
      <Link href="/" className="flex items-center gap-4 group" aria-label="Accueil Forge Studio">
        <div className={`relative w-14 h-14 flex items-center justify-center overflow-hidden transition-all ${isAnimating ? 'animate-leap text-[var(--color-accent)]' : 'group-hover:scale-105'}`}>
          <img
            src="/logo-white.gif"
            alt="Forge Studio"
            className="w-full h-full object-contain dark:hidden"
          />
          <img
            src="/logo_no_bg.gif"
            alt="Forge Studio"
            className="w-full h-full object-contain hidden dark:block"
          />
        </div>
        <span className="font-semibold text-xl tracking-tight text-slate-900 dark:text-white/90 hidden sm:inline">
          Forge Studio
        </span>
      </Link>

      <div className="flex items-center gap-3">
        {/* Navigation tabs */}
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

        {/* User Auth Section */}
        <div className="flex items-center gap-2 ml-2">
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9 ring-2 ring-[var(--color-accent)]/20 hover:ring-[var(--color-accent)]/40 transition-all rounded-full',
                  userButtonPopoverCard: 'bg-white dark:bg-[#1A1D27] border border-slate-200 dark:border-white/[0.05] shadow-2xl rounded-2xl',
                },
              }}
            />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10">
                Se connecter
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-accent)] text-white text-xs font-bold hover:bg-[var(--color-accent-hover)] transition-all shadow-lg shadow-[var(--color-accent-glow)] hover:scale-[1.02] active:scale-95">
                S'inscrire
              </button>
            </SignUpButton>
          </Show>
        </div>
      </div>
    </nav>
  );
}
