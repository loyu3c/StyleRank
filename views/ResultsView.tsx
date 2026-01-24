
import React, { useState, useEffect } from 'react';
import { Participant } from '../types';
import { Trophy, Medal, Star, Sparkles, RefreshCw } from 'lucide-react';

interface ResultsViewProps {
  participants: Participant[];
  onFinishReveal: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ participants, onFinishReveal }) => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealIndex, setRevealIndex] = useState(0);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [showWinners, setShowWinners] = useState(false);

  const startReveal = () => {
    if (participants.length === 0) return;
    setIsRevealing(true);
    setShowWinners(false);
    
    // Simulate randomization
    let count = 0;
    const interval = setInterval(() => {
      setRevealIndex(Math.floor(Math.random() * participants.length));
      count++;
      if (count > 40) {
        clearInterval(interval);
        const sorted = [...participants].sort((a, b) => b.votes - a.votes).slice(0, 3);
        setWinners(sorted);
        setIsRevealing(false);
        setShowWinners(true);
        onFinishReveal();
      }
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto min-h-[70vh] flex flex-col items-center justify-center space-y-12">
      {!isRevealing && !showWinners ? (
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="relative inline-block">
            <Trophy size={120} className="text-amber-500 animate-bounce" />
            <Sparkles className="absolute -top-4 -right-4 text-white animate-pulse" />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-display text-white tracking-widest">開票大典即將開始</h2>
            <p className="text-slate-400 text-xl">準備好見證 2026 最佳造型得主了嗎？</p>
          </div>
          <button 
            onClick={startReveal}
            className="px-12 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-2xl rounded-3xl shadow-2xl shadow-amber-500/20 hover:scale-105 transition-all"
          >
            開始揭曉得票
          </button>
        </div>
      ) : isRevealing ? (
        <div className="w-full max-w-lg space-y-8 text-center">
          <div className="aspect-square w-full rounded-3xl overflow-hidden border-8 border-amber-500/30 bg-slate-800 shadow-2xl">
            <img 
              src={participants[revealIndex].photoUrl} 
              className="w-full h-full object-cover"
              alt="revealing"
            />
          </div>
          <h3 className="text-4xl font-bold text-white animate-pulse">
            計算中... {participants[revealIndex].name}
          </h3>
          <RefreshCw className="mx-auto text-amber-500 animate-spin" size={48} />
        </div>
      ) : (
        <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="text-center">
             <h2 className="text-6xl font-display text-amber-400 tracking-tighter mb-2">得獎名單公佈</h2>
             <div className="h-1 w-40 bg-amber-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {/* 2nd Place */}
            {winners[1] && (
              <WinnerCard participant={winners[1]} rank={2} color="text-slate-300" medal={<Medal className="text-slate-300" />} />
            )}
            {/* 1st Place */}
            {winners[0] && (
              <WinnerCard participant={winners[0]} rank={1} color="text-yellow-400" medal={<Trophy className="text-yellow-400" />} highlight />
            )}
            {/* 3rd Place */}
            {winners[2] && (
              <WinnerCard participant={winners[2]} rank={3} color="text-orange-600" medal={<Medal className="text-orange-600" />} />
            )}
          </div>

          <div className="text-center pt-8">
            <button 
              onClick={() => setShowWinners(false)}
              className="px-8 py-3 text-slate-500 hover:text-white transition-colors"
            >
              重新進行開票
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const WinnerCard = ({ participant, rank, color, medal, highlight = false }: any) => (
  <div className={`flex flex-col items-center space-y-4 animate-in zoom-in duration-1000 delay-${rank * 300}`}>
    <div className={`relative ${highlight ? 'w-full' : 'w-4/5'}`}>
      <div className={`aspect-square rounded-full overflow-hidden border-8 shadow-2xl ${highlight ? 'border-yellow-500/50' : 'border-slate-800'}`}>
        <img src={participant.photoUrl} className="w-full h-full object-cover" />
      </div>
      <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center font-display text-3xl font-bold shadow-lg ${
        rank === 1 ? 'bg-yellow-500 text-black' : 
        rank === 2 ? 'bg-slate-300 text-black' : 'bg-orange-700 text-white'
      }`}>
        {rank}
      </div>
    </div>
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        {medal}
        <h4 className={`text-2xl font-bold ${color}`}>{participant.name}</h4>
      </div>
      <p className="text-slate-400 font-medium mb-2">{participant.theme}</p>
      <div className="inline-block px-4 py-1 bg-white/5 rounded-full border border-white/10">
        <span className="text-white font-bold">{participant.votes}</span>
        <span className="text-slate-500 text-xs ml-1 uppercase font-bold tracking-tighter">選票</span>
      </div>
    </div>
  </div>
);

export default ResultsView;
