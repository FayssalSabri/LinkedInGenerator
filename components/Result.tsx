'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LinkedInPost from './LinkedInPost';
import { BespokeIcons } from '@/components/BespokeIcons';

interface ResultProps {
  publication?: string;
  note?: string;
  isLoading: boolean;
  isCached?: boolean;
}

export default function Result({ publication, note, isLoading, isCached }: ResultProps) {
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Typing effect logic
  useEffect(() => {
    if (publication && !isLoading) {
      setIsTyping(true);
      setDisplayedText('');
      const words = publication.split(' ');
      let currentIdx = 0;
      
      const interval = setInterval(() => {
        if (currentIdx < words.length) {
          const nextWord = words[currentIdx];
          if (nextWord !== undefined) {
            setDisplayedText((prev) => prev + (currentIdx === 0 ? '' : ' ') + nextWord);
          }
          currentIdx++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [publication, isLoading]);

  const handleCopy = async () => {
    if (publication) {
      await navigator.clipboard.writeText(publication);
      setCopied(true);
      setShowToast(true);
      setTimeout(() => {
        setCopied(false);
        setShowToast(false);
      }, 2000);
    }
  };

  const charCount = publication?.length || 0;

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-[#1FB8CD]/30 border-t-[#1FB8CD] animate-spin" />
              <h3 className="text-sm font-semibold text-white tracking-tight">Composition en cours...</h3>
            </div>
            <div className="space-y-3">
              <div className="h-4 w-full skeleton-shimmer bg-white/5" />
              <div className="h-4 w-[90%] skeleton-shimmer bg-white/5" />
              <div className="h-4 w-[95%] skeleton-shimmer bg-white/5" />
            </div>
          </div>
        ) : publication ? (
          <div className="space-y-10">
            {/* Answer Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1FB8CD]/10 flex items-center justify-center text-[#1FB8CD]">
                  <BespokeIcons.Dashboard className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight">Publication suggérée</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors"
                >
                  {copied ? <BespokeIcons.Check className="w-3.5 h-3.5 text-emerald-400" /> : <BespokeIcons.Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copié' : 'Copier'}
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="prose prose-invert max-w-none">
              <div className="bg-[#202222] border border-white/5 rounded-2xl p-6 shadow-sm">
                <LinkedInPost content={displayedText} isTyping={isTyping} />
              </div>
            </div>

            {/* Strategy Insights (Like Perplexity Sources) */}
            {note && (
              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-[#1FB8CD]">
                  <BespokeIcons.Sparkles className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-widest">Insights Stratégiques</h4>
                </div>
                <div className="grid gap-4">
                  <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-sm text-slate-400 leading-relaxed italic">
                    "{note}"
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
