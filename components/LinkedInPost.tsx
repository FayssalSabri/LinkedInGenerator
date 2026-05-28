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
export default function LinkedInPost({ content, shouldStream = false }: LinkedInPostProps) {
  return (
    <div className="bg-[var(--color-bg)] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden max-w-[550px] mx-auto w-full text-left relative group shadow-sm dark:shadow-none">
      <div className="relative">
        {/* Header */}
        <div className="p-4 flex items-start justify-between">
          <div className="flex gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-slate-200 dark:border-white/5">
              <Image
                src="/avatar.png"
                alt="Photo de profil"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white leading-tight">Sarah Martin</h4>
              <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                <p className="text-[11px] text-slate-500">Consultante en Stratégie Digitale &amp; IA</p>
                <span className="text-[11px] text-slate-600">•</span>
                <span className="text-[11px] text-slate-600">Maintenant</span>
                <Globe2 className="w-2.5 h-2.5 text-slate-600 ml-0.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          <div className="text-[14px] text-slate-800 dark:text-slate-300 leading-relaxed min-h-[60px]">
            {shouldStream ? (
              <div className="whitespace-pre-wrap">
                <Typewriter text={content} speed={8} />
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-1 h-4 ml-1 bg-[var(--color-accent)] align-middle"
                />
              </div>
            ) : (
              <RichTextEditor content={content} editable={true} />
            )}
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="px-4 py-2 flex items-center justify-between border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1">
              <div className="w-4 h-4 rounded-full bg-[#0A66C2] flex items-center justify-center border border-[var(--color-bg)]">
                <ThumbsUp className="w-2 h-2 text-white fill-white" />
              </div>
              <div className="w-4 h-4 rounded-full bg-[#DF704D] flex items-center justify-center border border-[var(--color-bg)]">
                <div className="w-2 h-2 text-white flex items-center justify-center text-[6px]">❤️</div>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 hover:text-[#70B5F9] cursor-pointer font-medium">
              Vous et 42 autres
            </span>
          </div>
          <div className="text-[11px] text-slate-500 hover:text-[#70B5F9] cursor-pointer">
            12 commentaires • 5 partages
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex px-1 py-1 border-t border-slate-200 dark:border-white/5">
          <PostAction icon={<ThumbsUp className="w-4 h-4 fill-current" />} label="J'aime" active />
          <PostAction icon={<MessageSquare className="w-4 h-4" />} label="Commenter" />
          <PostAction icon={<Repeat2 className="w-4 h-4" />} label="Republier" />
          <PostAction icon={<Send className="w-4 h-4" />} label="Envoyer" />
        </div>
      </div>
    </div>
  );
}

function PostAction({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-semibold text-[13px] ${active ? 'text-[#0A66C2] dark:text-[#70B5F9]' : 'text-slate-600 dark:text-slate-400'}`}
      aria-label={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
