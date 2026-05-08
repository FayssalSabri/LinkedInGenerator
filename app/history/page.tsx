'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import LinkedInPost from '@/components/LinkedInPost';

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

import { BespokeIcons } from '@/components/BespokeIcons';

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

const getToneIcon = (tone: string) => {
  const Icon = BespokeIcons[tone as keyof typeof BespokeIcons] || BespokeIcons[tone.charAt(0).toUpperCase() + tone.slice(1) as keyof typeof BespokeIcons];
  // Map specific tones to BespokeIcons
  if (tone === 'Professionnel') return <BespokeIcons.Pro />;
  if (tone === 'Chaleureux') return <BespokeIcons.Warm />;
  if (tone === 'Expert') return <BespokeIcons.Expert />;
  if (tone === 'Dynamique') return <BespokeIcons.Dynamic />;
  if (tone === 'Créatif') return <BespokeIcons.Creative />;
  return null;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<LocalHistoryItem[]>([]);
  const [selected, setSelected] = useState<LocalHistoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredHistory = history.filter(item =>
    item.params.brief.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.publication.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (<div className="h-screen bg-[#191A1A] font-sans text-[#E8E8E8] overflow-hidden flex flex-col relative">
    {/* Minimalist Header */}
    <nav className="relative z-50 bg-[#191A1A]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 h-14 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-all">
            <Image 
              src="/logo.svg" 
              alt="Forge Studio" 
              fill 
              className="object-contain"
            />
          </div>
          <span className="font-semibold text-sm tracking-tight text-white/90">Forge Studio</span>
        </Link>
        <div className="h-4 w-[1px] bg-white/10" />
        <div className="flex items-center gap-2">
          <Link href="/" className="px-2.5 py-0.5 rounded text-[11px] font-medium text-slate-400 hover:text-white transition-colors">Studio</Link>
          <Link href="/history" className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-white/5 text-white">History</Link>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Archive_Vault Secured</span>
      </div>
    </nav>

    <main className="flex-1 flex overflow-hidden w-full max-w-[1440px] mx-auto">
      {/* Thread Sidebar */}
      <div className="w-[360px] border-r border-white/5 flex flex-col bg-[#191A1A]">
        <div className="p-6 border-b border-white/5">
          <div className="relative">
            <BespokeIcons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher dans les archives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-sm text-white focus:border-[#1FB8CD]/50 outline-none transition-all placeholder:text-slate-600 font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1.5">
          <AnimatePresence mode="popLayout">
            {filteredHistory.map((item) => (
              <motion.button
                key={item.id}
                layout
                onClick={() => setSelected(item)}
                className={`w-full text-left p-4 rounded-xl transition-all group relative border ${selected?.id === item.id
                    ? 'bg-white/10 text-white border-white/10'
                    : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
                  }`}
              >
                <h4 className={`text-[14px] font-semibold truncate mb-1.5 ${selected?.id === item.id ? 'text-white' : 'text-slate-200'}`}>
                  {item.params.brief}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
                  <span className="text-[#1FB8CD]">{item.params.tone}</span>
                  <span>•</span>
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={clearHistory}
            className="w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            Clear Library
          </button>
        </div>
      </div>

      {/* Content Viewer */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#191A1A]">
        <div className="max-w-[760px] mx-auto py-12 px-8">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#1FB8CD]">
                    <BespokeIcons.Dashboard className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Archive_Details</span>
                  </div>
                  <h2 className="text-3xl font-medium tracking-tight text-white">{selected.params.brief}</h2>
                  <div className="flex items-center gap-4 text-slate-500 text-xs">
                    <span>{selected.params.tone}</span>
                    <span>•</span>
                    <span>{new Date(selected.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <LinkedInPost content={selected.publication} />
                </div>

                {selected.note && (
                  <div className="space-y-4 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[#1FB8CD]">
                      <BespokeIcons.Sparkles className="w-4 h-4" />
                      <h4 className="text-xs font-bold uppercase tracking-widest">Insights</h4>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl p-6 text-sm text-slate-400 leading-relaxed italic">
                      "{selected.note}"
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                <BespokeIcons.Database className="w-12 h-12 mb-4" />
                <p className="text-sm font-medium tracking-wide">Sélectionnez une archive pour l'inspecter</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>

    <footer className="py-3 px-6 border-t border-white/5 text-[10px] text-slate-500 flex justify-between items-center bg-[#191A1A]">
      <span>&copy; 2026 Forge Studio • Search_Mode v2.4</span>
    </footer>
  </div>
  );
}
