'use client';

import { SignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function SignInPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';
  // Use a default before mounting to avoid hydration mismatch
  const logoUrl = mounted && isDark ? '/logo_no_bg.gif' : '/logo-white.gif';

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[var(--color-bg)]">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-[var(--color-accent)]/5 absolute -left-32 top-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-[var(--color-accent)]/3 absolute -right-32 bottom-1/4 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="relative z-10 w-full max-w-[400px] px-4 sm:px-0"
      >
        <div className="w-full overflow-hidden rounded-3xl border border-slate-200/50 bg-white shadow-xl dark:border-white/[0.05] dark:bg-[#1A1D27]">
          {/* Custom Logo that won't be frozen by Clerk's image optimization */}
          <div className="flex w-full justify-center pt-10 pb-2">
            <img
              src={logoUrl}
              alt="Forge Studio"
              className="h-16 w-16 object-contain"
            />
          </div>

          <SignIn
            appearance={{
              elements: {
                logoBox: 'hidden',
                rootBox: 'w-full',
                cardBox: 'shadow-none border-none',
                card: 'bg-transparent shadow-none border-none rounded-none m-0 pt-0',
                headerTitle: 'text-slate-900 dark:text-white',
                headerSubtitle: 'text-slate-500 dark:text-slate-400',
                socialButtonsBlockButton:
                  'border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5',
                formFieldLabel: 'text-slate-700 dark:text-slate-300',
                formFieldInput:
                  'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl',
                formButtonPrimary:
                  'bg-[#E8445A] hover:bg-[#D63D50] text-white rounded-xl font-semibold',
                footerActionLink: 'text-[#E8445A] hover:text-[#D63D50]',
                dividerLine: 'bg-slate-200 dark:bg-white/10',
                dividerText: 'text-slate-400 dark:text-slate-500',
              },
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
