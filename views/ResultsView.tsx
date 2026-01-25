
import React, { useEffect, useState, useMemo } from 'react';
import { Participant, ActivityConfig } from '../types';
import { Trophy, Crown, Medal, Star, Sparkles, RefreshCw, Lock, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultsViewProps {
  participants: Participant[];
  onFinishReveal: () => void;
  isAdminLoggedIn?: boolean;
  config: ActivityConfig;
}

const ResultsView: React.FC<ResultsViewProps> = ({ participants, onFinishReveal, isAdminLoggedIn = false, config }) => {
  const [isRevealing, setIsRevealing] = useState(false);
  // revealStep: 0=Hidden, 1=3rd, 2=2nd, 3=1st(Champion)
  const [revealStep, setRevealStep] = useState(0);
  const [showWinners, setShowWinners] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [showLuckyWinner, setShowLuckyWinner] = useState(false);

  // 如果已公布，自動開始播放動畫 (使用快速進場或直接顯示)
  useEffect(() => {
    if (config.isResultsRevealed && !animationStarted) {
      setAnimationStarted(true);
      runMedalAnimation();
    }
  }, [config.isResultsRevealed]);

  // Sort participants by votes descending
  const top3 = useMemo(() => {
    return [...participants].sort((a, b) => b.votes - a.votes).slice(0, 3);
  }, [participants]);

  const startReveal = () => {
    // Strict Guard
    if (!isAdminLoggedIn) {
      alert("僅限管理員可執行開票！");
      return;
    }
    if (config.isRegistrationOpen) {
      alert("請先關閉「照片上傳登記」才可開票！");
      return;
    }
    if (config.isVotingOpen) {
      alert("請先關閉「記名投票」才可開票！");
      return;
    }

    if (participants.length === 0) return;

    setIsRevealing(true);
    setAnimationStarted(true);

    // Simulate randomization / Calculation phase
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count > 30) {
        clearInterval(interval);
        setIsRevealing(false);
        runMedalAnimation();
        // Immediately trigger the "revealed" state for the system
        onFinishReveal();
      }
    }, 100);
  };

  const runMedalAnimation = () => {
    // Reset states for replay
    setRevealStep(0);
    setShowWinners(false);
    setShowLuckyWinner(false);

    // Start Sequence
    setTimeout(() => {
      setShowWinners(true);
    }, 100);

    // Stage 1: Reveal 3rd place (Step 1)
    setTimeout(() => setRevealStep(1), 1000);

    // Stage 2: Reveal 2nd place (Step 2)
    setTimeout(() => setRevealStep(2), 3000);

    // Stage 3: Reveal 1st place (Step 3)
    setTimeout(() => {
      setRevealStep(3);

      // Fire confetti
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
    }, 5000);

    // Stage 4: Reveal Lucky Winner (if exists)
    if (config.luckyDrawWinner) {
      setTimeout(() => {
        setShowLuckyWinner(true);
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.8 },
          colors: ['#ec4899', '#f43f5e']
        });
      }, 8000);
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

  // Initial State: "Start Reveal" Button (Only if NOT already revealed and NOT animation started)
  if (!animationStarted && !config.isResultsRevealed) {
    const canReveal = isAdminLoggedIn && !config.isRegistrationOpen && !config.isVotingOpen;

    return (
      <div className="max-w-4xl mx-auto min-h-[70vh] flex flex-col items-center justify-center space-y-12">
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="relative inline-block">
            <Trophy size={120} className="text-amber-500 animate-bounce" />
            <Sparkles className="absolute -top-4 -right-4 text-white animate-pulse" />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-display text-white tracking-widest">開票大典即將開始</h2>
            <p className="text-slate-400 text-xl">準備好見證 2026 最佳造型得主了嗎？</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={startReveal}
              disabled={!canReveal}
              className={`px-12 py-5 font-bold text-2xl rounded-3xl shadow-2xl transition-all flex items-center gap-3 ${canReveal
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/20 hover:scale-105'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
            >
              {!canReveal && <Lock size={24} />}
              開始揭曉得票
            </button>
            {!canReveal && (
              <div className="flex flex-col items-center gap-1 text-sm text-slate-500">
                <p>需滿足以下條件才可開票：</p>
                <div className="flex gap-4">
                  <span className={isAdminLoggedIn ? "text-emerald-500" : "text-rose-500"}>
                    {isAdminLoggedIn ? "✓ 管理員已登入" : "✗ 管理員未登入"}
                  </span>
                  <span className={!config.isRegistrationOpen ? "text-emerald-500" : "text-rose-500"}>
                    {!config.isRegistrationOpen ? "✓ 報名已截止" : "✗ 報名開放中"}
                  </span>
                  <span className={!config.isVotingOpen ? "text-emerald-500" : "text-rose-500"}>
                    {!config.isVotingOpen ? "✓ 投票已截止" : "✗ 投票開放中"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-40 relative min-h-[80vh] flex flex-col justify-center">
      {/* Computing Animation */}
      {isRevealing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <h3 className="text-4xl font-bold text-white animate-pulse mb-8">
            票數統計中...
          </h3>
          <RefreshCw className="text-amber-500 animate-spin" size={64} />
        </div>
      )}

      {/* Background Effects */}
      <div className={`fixed inset-0 z-0 transition-opacity duration-1000 pointer-events-none ${revealStep >= 3 ? 'opacity-100' : 'opacity-0'} `}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-900/50 to-slate-900"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 blur-[120px] rounded-full animate-pulse"></div>
      </div>

      <div className={`text-center space-y-4 mb-24 relative z-10 transition-opacity duration-1000 ${showWinners ? 'opacity-100' : 'opacity-0'} `}>
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-amber-300 to-amber-600 rounded-2xl shadow-lg shadow-amber-500/20 mb-4 animate-bounce">
          <Trophy size={40} className="text-white fill-white" />
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 tracking-tight drop-shadow-sm">
          榮耀時刻
        </h2>
      </div>

      {showWinners && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4 items-end justify-center relative z-10 min-h-[500px]">
          {/* 2nd Place */}
          {top3[1] && (
            <div className={`order-2 md:order-1 transition-all duration-1000 transform ${revealStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} `}>
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
            <div className={`order-1 md:order-2 -mt-12 md:-mt-24 transition-all duration-1000 delay-300 transform ${revealStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} `}>
              <div className="flex flex-col items-center">
                <div className="relative mb-8">
                  <Crown className={`w-16 h-16 text-yellow-400 fill-yellow-400 absolute -top-12 left-1/2 -translate-x-1/2 drop-shadow-lg z-20 animate-bounce ${revealStep >= 3 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`} />
                  <div className={`absolute inset-0 bg-gradient-to-tr from-amber-300 to-yellow-600 rounded-full blur-2xl opacity-40 animate-pulse ${revealStep >= 3 ? 'opacity-60' : 'opacity-0'} `}></div>
                  <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.3)] overflow-hidden ring-4 ring-orange-500/30">
                    <img src={top3[0].photoUrl} alt={top3[0].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-2 rounded-full border border-amber-400 font-black text-2xl shadow-xl whitespace-nowrap z-20">
                    {top3[0].votes} 票
                  </div>
                </div>

                <div className={`text-center space-y-2 transition-all duration-1000 ${revealStep >= 3 ? 'transform scale-110' : ''} `}>
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
            <div className={`order-3 md:order-3 transition-all duration-1000 transform ${revealStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} `}>
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
      )}

      {/* Lucky Draw Winner Section */}
      {showLuckyWinner && config.luckyDrawWinner && (
        <div className="mt-20 animate-in zoom-in slide-in-from-bottom-10 duration-1000">
          <div className="max-w-md mx-auto relative p-[2px] rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse">
            <div className="bg-[#0a0f1a] rounded-[22px] p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>

              <div className="inline-flex p-3 bg-pink-500/10 rounded-full text-pink-500 mb-4 animate-bounce">
                <Gift size={32} />
              </div>

              <h3 className="text-pink-400 font-bold tracking-widest text-sm uppercase mb-2">LUCKY DRAW WINNER</h3>
              <h4 className="text-3xl font-black text-white mb-2">{config.luckyDrawWinner.name}</h4>
              <p className="text-slate-400 font-mono text-lg">{config.luckyDrawWinner.empId}</p>

              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-500/20 blur-3xl rounded-full"></div>
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsView;
