'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import LinkedInPost from '@/components/LinkedInPost';
import { BespokeIcons } from '@/components/BespokeIcons';
import { PenSquare, History, Search, Copy, Check } from 'lucide-react';

interface LocalHistoryItem {
  id: string;
  timestamp: number;
  params: {
    description: string;
    brief: string;
    tone: string;
  };
  publication: string;
  note: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<LocalHistoryItem[]>([]);
  const [selected, setSelected] = useState<LocalHistoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (selected) {
      await navigator.clipboard.writeText(selected.publication);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('linkedin_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const clearHistory = () => {
    if (confirm('Voulez-vous vraiment effacer tout l\'historique ?')) {
      localStorage.removeItem('linkedin_history');
      setHistory([]);
      setSelected(null);
    }
  };

  // Reset copied state when selection changes
  useEffect(() => {
    setCopied(false);
  }, [selected]);

  const filteredHistory = history.filter(item =>
    item.params.brief.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.publication.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-screen bg-[#191A1A] font-sans text-[#E8E8E8] overflow-hidden flex flex-col relative">
      {/* Navigation Bar - Matches Studio exactly */}
      <nav className="flex-shrink-0 h-16 border-b border-white/[0.03] bg-[#191A1A] z-50 flex items-center justify-between px-8 lg:px-16">
        <div className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-all">
            <img 
              src="/logo.svg" 
              alt="Forge Studio" 
              className="w-full h-full object-contain p-1.5"
            />
          </div>
          <span className="font-semibold text-sm tracking-tight text-white/90">Forge Studio</span>
        </div>
        <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.05]">
          <Link href="/" className="nav-item !px-5 !py-1.5 nav-item-inactive !rounded-lg text-xs">
            <PenSquare className="w-3.5 h-3.5" />
            <span>Forge</span>
          </Link>
          <Link href="/history" className="nav-item !px-5 !py-1.5 nav-item-active !rounded-lg text-xs">
            <History className="w-3.5 h-3.5" />
            <span>Library</span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden w-full max-w-[1600px] mx-auto">
        {/* Thread Sidebar - Extremely Minimalist */}
        <div className="w-[340px] flex flex-col bg-transparent mr-16">
          <div className="pt-16 pb-10 px-8">
            <h2 className="text-3xl font-bold text-white mb-10 tracking-tight">Library</h2>
            <div className="relative group">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#1FB8CD] transition-colors" />
              <input
                type="text"
                placeholder="Search archives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 py-3 bg-white/[0.02] border-b border-white/10 text-[14px] text-white focus:border-[#1FB8CD]/60 outline-none transition-all placeholder:text-slate-500 font-medium"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1 pb-10">
            <AnimatePresence mode="popLayout">
              {filteredHistory.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-center opacity-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Empty</p>
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <motion.button
                    key={item.id}
                    layout
                    onClick={() => setSelected(item)}
                    className={`w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 group relative ${selected?.id === item.id
                        ? 'bg-white/[0.04] text-white'
                        : 'text-slate-600 hover:text-slate-400 hover:bg-white/[0.02]'
                      }`}
                  >
                    {selected?.id === item.id && (
                      <motion.div 
                        layoutId="active-dot"
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#1FB8CD] rounded-full shadow-[0_0_10px_#1FB8CD]"
                      />
                    )}
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${selected?.id === item.id ? 'text-[#1FB8CD]' : 'text-slate-700'}`}>
                        {item.params.tone}
                      </span>
                      <span className="text-[9px] font-bold tabular-nums opacity-20">
                        {new Date(item.timestamp).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <h4 className={`text-[15px] font-medium line-clamp-1 transition-colors ${selected?.id === item.id ? 'text-white' : 'text-slate-500'}`}>
                      {item.params.brief}
                    </h4>
                  </motion.button>
                ))
              )}
            </AnimatePresence>
          </div>

          {history.length > 0 && (
            <div className="p-8 pb-12">
              <button
                onClick={clearHistory}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400/30 hover:text-red-400 transition-all"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Content Viewer - Fixed & Centered for maximum comfort */}
        <div className="flex-1 overflow-hidden flex flex-col items-center justify-center">
          <div className="w-full max-w-[1200px] px-12 overflow-y-auto custom-scrollbar max-h-screen py-12">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, scale: 0.98, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 120 }}
                  className="space-y-16"
                >
                  {/* Header with Title */}
                  <div className="pb-12 border-b border-white/[0.04]">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 text-[#1FB8CD]">
                        <div className="w-2 h-2 rounded-full bg-[#1FB8CD] shadow-[0_0_12px_#1FB8CD]"></div>
                        <span className="text-[11px] font-black uppercase tracking-[0.25em]">Détails de l'archive</span>
                      </div>
                      <h2 className="text-5xl font-extrabold tracking-tight text-white leading-[1.1]">{selected.params.brief}</h2>
                      <div className="flex items-center gap-8 text-slate-500 text-[11px] font-black uppercase tracking-[0.15em]">
                        <div className="flex items-center gap-2 text-[#1FB8CD]">
                          <div className="w-4 h-4 bg-[#1FB8CD]/10 rounded flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-[#1FB8CD] rounded-full"></div>
                          </div>
                          {selected.params.tone}
                        </div>
                        <span className="opacity-20">/</span>
                        <span>{new Date(selected.timestamp).toLocaleString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-16 items-start pt-16">
                    {/* Publication on the left with its own Copy button inside */}
                    <div className="w-full lg:w-[550px] flex-shrink-0 relative group">
                      <div className="absolute right-6 top-6 z-20">
                        <button
                          onClick={handleCopy}
                          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 shadow-lg ${
                            copied 
                              ? 'bg-green-500 text-white' 
                              : 'bg-white/10 text-white/50 hover:bg-[#1FB8CD] hover:text-white backdrop-blur-md border border-white/10'
                          }`}
                          title="Copier le texte"
                        >
                          {copied ? <Check className="w-5 h-5" strokeWidth={3} /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                      <LinkedInPost content={selected.publication} />
                    </div>

                    {/* Note on the right */}
                    {selected.note && (
                      <div className="flex-1 space-y-8 lg:pt-16">
                        <div className="flex items-center gap-3 text-slate-500">
                          <div className="w-6 h-6 bg-white/5 rounded-lg flex items-center justify-center text-[#1FB8CD]">
                            <BespokeIcons.Sparkles className="w-4 h-4" />
                          </div>
                          <h4 className="text-[11px] font-black uppercase tracking-[0.25em]">Note Stratégique</h4>
                        </div>
                        <div className="bg-white/[0.01] border border-white/[0.04] rounded-[2.5rem] p-12 text-[20px] text-slate-400 leading-relaxed italic font-serif relative group">
                          <span className="absolute top-6 left-8 text-6xl text-white/[0.03] font-serif select-none">“</span>
                          <span className="relative z-10 block">
                            {selected.note}
                          </span>
                          <span className="absolute bottom-4 right-8 text-6xl text-white/[0.03] font-serif select-none">”</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center opacity-30"
                >
                  <div className="mb-8">
                    <svg className="w-12 h-12 animate-spin-slow text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 translate-x-[0.2em]">
                    Sélectionnez une archive...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
