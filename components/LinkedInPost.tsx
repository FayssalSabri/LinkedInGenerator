'use client';

import { motion } from 'framer-motion';
import { ThumbsUp, MessageSquare, Repeat2, Send, Globe2 } from 'lucide-react';
import Image from 'next/image';
import Typewriter from './Typewriter';
import { RichTextEditor } from './RichTextEditor';

interface LinkedInPostProps {
  content: string;
  shouldStream?: boolean;
}

/**
 * Realistic LinkedIn post mockup component.
 * Displays generated content with authentic LinkedIn UI elements.
 */
export default function LinkedInPost({
  content,
  shouldStream = false,
}: LinkedInPostProps) {
  return (
    <div className="group relative mx-auto w-full max-w-[550px] overflow-hidden rounded-xl border border-slate-200 bg-[var(--color-bg)] text-left shadow-sm dark:border-white/5 dark:shadow-none">
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between p-4">
          <div className="flex gap-3">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-white/5">
              <Image
                src="/avatar.png"
                alt="Photo de profil"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h4 className="text-[13px] font-semibold leading-tight text-slate-900 dark:text-white">
                Sarah Martin
              </h4>
              <div className="mt-0.5 flex flex-wrap items-center gap-1">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Consultante en Stratégie Digitale &amp; IA
                </p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  •
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Maintenant
                </span>
                <Globe2 className="ml-0.5 h-2.5 w-2.5 text-slate-500 dark:text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          <div className="min-h-[60px] text-[14px] leading-relaxed text-slate-800 dark:text-slate-300">
            {shouldStream ? (
              <div className="whitespace-pre-wrap">
                <Typewriter key={content} text={content} speed={8} />
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="ml-1 inline-block h-4 w-1 bg-[var(--color-accent)] align-middle"
                />
              </div>
            ) : (
              <RichTextEditor content={content} editable={true} />
            )}
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2 dark:border-white/5">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1">
              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-[var(--color-bg)] bg-[#0A66C2]">
                <ThumbsUp className="h-2 w-2 fill-white text-white" />
              </div>
              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-[var(--color-bg)] bg-[#DF704D]">
                <div className="flex h-2 w-2 items-center justify-center text-[6px] text-white">
                  ❤️
                </div>
              </div>
            </div>
            <span className="cursor-pointer text-[11px] font-medium text-slate-400 hover:text-[#70B5F9]">
              Vous et 42 autres
            </span>
          </div>
          <div className="cursor-pointer text-[11px] text-slate-500 hover:text-[#70B5F9]">
            12 commentaires • 5 partages
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex border-t border-slate-200 px-1 py-1 dark:border-white/5">
          <PostAction
            icon={<ThumbsUp className="h-4 w-4 fill-current" />}
            label="J'aime"
            active
          />
          <PostAction
            icon={<MessageSquare className="h-4 w-4" />}
            label="Commenter"
          />
          <PostAction
            icon={<Repeat2 className="h-4 w-4" />}
            label="Republier"
          />
          <PostAction icon={<Send className="h-4 w-4" />} label="Envoyer" />
        </div>
      </div>
    </div>
  );
}

function PostAction({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-[13px] font-semibold transition-colors hover:bg-slate-100 dark:hover:bg-white/5 ${active ? 'text-[#0A66C2] dark:text-[#70B5F9]' : 'text-slate-600 dark:text-slate-400'}`}
      aria-label={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
