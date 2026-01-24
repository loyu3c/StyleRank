import React, { useEffect, useState, useMemo } from 'react';
import { Participant } from '../types';
import { Trophy, Crown, Medal, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultsViewProps {
  participants: Participant[];
  onFinishReveal?: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ participants, onFinishReveal }) => {
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const [showWinner, setShowWinner] = useState(false);

  // Sort participants by votes descending
  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => b.votes - a.votes);
  }, [participants]);

  const top3 = sortedParticipants.slice(0, 3);
  const winner = top3[0];

  useEffect(() => {
    // Stage 1: Counting down / Dramatic pause
    const timer1 = setTimeout(() => {
      setRevealedIndex(2); // Reveal 3rd place
    }, 1000);

    const timer2 = setTimeout(() => {
      setRevealedIndex(1); // Reveal 2nd place
    }, 2500);

    const timer3 = setTimeout(() => {
      setRevealedIndex(0); // Reveal 1st place
    }, 4500);

    const timer4 = setTimeout(() => {
      setShowWinner(true);
      if (onFinishReveal) onFinishReveal();

      // Fire confetti immediately when winner is revealed
      const end = Date.now() + 3000;
      const colors = ['#fbbf24', '#f59e0b', '#dc2626', '#ffffff'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

    }, 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]";
      case 1: return "text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.4)]";
      case 2: return "text-amber-700 drop-shadow-[0_0_10px_rgba(180,83,9,0.4)]";
      default: return "text-slate-500";
    }
  };

  const getRankLabel = (index: number) => {
    switch (index) {
      case 0: return "CHAMPION";
      case 1: return "2ND PLACE";
      case 2: return "3RD PLACE";
      default: return "";
    }
  };

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="p-4 bg-slate-800 rounded-full text-slate-500">
          <Trophy size={48} />
        </div>
        <p className="text-slate-400 text-lg">目前還沒有任何比賽數據...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 relative">
      {/* Background Effects */}
      <div className={`fixed inset-0 z-0 transition-opacity duration-1000 pointer-events-none ${showWinner ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-900/50 to-slate-900"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 blur-[120px] rounded-full animate-pulse"></div>
      </div>

      <div className="text-center space-y-4 mb-16 relative z-10">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-amber-300 to-amber-600 rounded-2xl shadow-lg shadow-amber-500/20 mb-4 animate-bounce">
          <Trophy size={40} className="text-white fill-white" />
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 tracking-tight drop-shadow-sm">
          榮耀時刻
        </h2>
        <p className="text-amber-200/60 font-medium tracking-[0.2em] uppercase text-sm md:text-base">
          THE MOMENT OF GLORY
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-end justify-center relative z-10 min-h-[500px]">
        {/* 2nd Place */}
        {top3[1] && (
          <div className={`order-2 md:order-1 transition-all duration-1000 transform ${revealedIndex >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <div className="flex flex-col items-center">
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-slate-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-300 shadow-2xl overflow-hidden">
                  <img src={top3[1].photoUrl} alt={top3[1].name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-300 px-4 py-1 rounded-full border border-slate-600 font-bold text-sm shadow-lg whitespace-nowrap">
                  {top3[1].votes} 票
                </div>
              </div>
              <div className="text-center space-y-1">
                <Medal className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <h3 className="text-2xl font-bold text-white">{top3[1].name}</h3>
                <p className="text-slate-400 text-sm font-medium">{top3[1].theme}</p>
                <p className="text-slate-500 text-xs font-black tracking-widest mt-2">SILVER WINNER</p>
              </div>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {top3[0] && (
          <div className={`order-1 md:order-2 -mt-12 md:-mt-24 transition-all duration-1000 delay-300 transform ${revealedIndex >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                <Crown className={`w-16 h-16 text-yellow-400 fill-yellow-400 absolute -top-12 left-1/2 -translate-x-1/2 drop-shadow-lg z-20 animate-bounce ${showWinner ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`} />
                <div className={`absolute inset-0 bg-gradient-to-tr from-amber-300 to-yellow-600 rounded-full blur-2xl opacity-40 animate-pulse ${showWinner ? 'opacity-60' : 'opacity-0'}`}></div>
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.3)] overflow-hidden ring-4 ring-orange-500/30">
                  <img src={top3[0].photoUrl} alt={top3[0].name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-2 rounded-full border border-amber-400 font-black text-2xl shadow-xl whitespace-nowrap z-20">
                  {top3[0].votes} 票
                </div>
              </div>

              <div className={`text-center space-y-2 transition-all duration-1000 ${showWinner ? 'transform scale-110' : ''}`}>
                <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 drop-shadow-md">{top3[0].name}</h3>
                <p className="text-amber-400 text-lg font-bold">{top3[0].theme}</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Sparkles className="text-yellow-400 w-5 h-5 animate-spin-slow" />
                  <p className="text-yellow-500 text-sm font-black tracking-[0.3em]">CHAMPION</p>
                  <Sparkles className="text-yellow-400 w-5 h-5 animate-spin-slow" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <div className={`order-3 md:order-3 transition-all duration-1000 transform ${revealedIndex >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <div className="flex flex-col items-center">
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-amber-700 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-amber-700 shadow-2xl overflow-hidden">
                  <img src={top3[2].photoUrl} alt={top3[2].name} className="w-full h-full object-cover grayscale-[0.2]" />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-300 px-4 py-1 rounded-full border border-slate-600 font-bold text-sm shadow-lg whitespace-nowrap">
                  {top3[2].votes} 票
                </div>
              </div>
              <div className="text-center space-y-1">
                <Medal className="w-8 h-8 mx-auto text-amber-700 mb-2" />
                <h3 className="text-2xl font-bold text-white">{top3[2].name}</h3>
                <p className="text-slate-400 text-sm font-medium">{top3[2].theme}</p>
                <p className="text-slate-500 text-xs font-black tracking-widest mt-2">BRONZE WINNER</p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ResultsView;
