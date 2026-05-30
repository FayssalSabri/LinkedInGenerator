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
export default function Navbar({
  isAnimating = false,
}: {
  isAnimating?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav
      className="z-50 flex h-16 flex-shrink-0 items-center justify-between border-b border-white/[0.03] bg-[var(--color-bg)] px-6 sm:px-8 lg:px-16"
      role="navigation"
      aria-label="Navigation principale"
    >
      <Link
        href="/"
        className="group flex items-center gap-4"
        aria-label="Accueil Forge Studio"
      >
        <div
          className={`relative flex h-14 w-14 items-center justify-center overflow-hidden transition-all ${isAnimating ? 'animate-leap text-[var(--color-accent)]' : 'group-hover:scale-105'}`}
        >
          <img
            src="/logo-white.gif"
            alt="Forge Studio"
            className="h-full w-full object-contain dark:hidden"
          />
          <img
            src="/logo_no_bg.gif"
            alt="Forge Studio"
            className="hidden h-full w-full object-contain dark:block"
          />
        </div>
        <span className="hidden text-xl font-semibold tracking-tight text-slate-900 dark:text-white/90 sm:inline">
          Forge Studio
        </span>
      </Link>

      <div className="flex items-center gap-3">
        {/* Navigation tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-black/5 bg-black/5 p-1 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <Link
            href="/"
            className={`nav-item !rounded-lg !px-4 !py-1.5 text-xs sm:!px-5 ${
              pathname === '/' ? 'nav-item-active' : 'nav-item-inactive'
            }`}
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            <PenSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Atelier</span>
          </Link>
          <Link
            href="/history"
            className={`nav-item !rounded-lg !px-4 !py-1.5 text-xs sm:!px-5 ${
              pathname === '/history' ? 'nav-item-active' : 'nav-item-inactive'
            }`}
            aria-current={pathname === '/history' ? 'page' : undefined}
          >
            <History className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Bibliothèque</span>
          </Link>
          <div className="ml-2 border-l border-black/10 pl-2 dark:border-white/[0.05]">
            <ThemeToggle />
          </div>
        </div>

        {/* User Auth Section */}
        <div className="ml-2 flex items-center gap-2">
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    'w-9 h-9 ring-2 ring-[var(--color-accent)]/20 hover:ring-[var(--color-accent)]/40 transition-all rounded-full',
                  userButtonPopoverCard:
                    'bg-white dark:bg-[#1A1D27] border border-slate-200 dark:border-white/[0.05] shadow-2xl rounded-2xl',
                },
              }}
            />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition-all hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10">
                Se connecter
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[var(--color-accent-glow)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)] active:scale-95">
                S&apos;inscrire
              </button>
            </SignUpButton>
          </Show>
        </div>
      </div>
    </nav>
  );
}
