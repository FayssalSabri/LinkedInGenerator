'use client';

import { SignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--color-bg)] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[var(--color-accent)]/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        {/* Logo + Brand */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
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
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Forge Studio
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Connectez-vous pour accéder à votre atelier
            </p>
          </div>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full',
              cardBox: 'shadow-xl border border-slate-200/50 dark:border-white/[0.05] rounded-3xl',
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
