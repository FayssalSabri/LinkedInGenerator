'use client';

import { SignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export default function SignInPage() {
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
        className="relative z-10 flex flex-col items-center gap-8"
      >
        {/* Logo + Brand */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden">
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
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Forge Studio
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Connectez-vous pour accéder à votre atelier
            </p>
          </div>
        </div>

        <SignIn
          appearance={{
            elements: {
              logoBox: 'hidden',
              rootBox: 'w-full',
              cardBox:
                'shadow-xl border border-slate-200/50 dark:border-white/[0.05] rounded-3xl',
              card: 'bg-white dark:bg-[#1A1D27] rounded-3xl',
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
      </motion.div>
    </div>
  );
}
