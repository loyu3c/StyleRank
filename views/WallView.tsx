import React, { useState, useMemo } from 'react';
import { Participant } from '../types';
import Card from '../components/Card';
import ImageModal from '../components/ImageModal';
import { LayoutGrid, Users, Trophy, Heart } from 'lucide-react';

interface WallViewProps {
  participants: Participant[];
  showVotes?: boolean;
  onVote?: (id: string) => void;
  hasVoted?: boolean;
}

const WallView: React.FC<WallViewProps> = ({ participants, showVotes = false, onVote, hasVoted }) => {
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  // 計算總票數
  const totalVotes = useMemo(() =>
    participants.reduce((acc, p) => acc + p.votes, 0),
    [participants]
  );

  // Memoize the sorted and duplicated list to prevent unnecessary re-renders during animation
  const displayParticipants = useMemo(() => {
    const sorted = [...participants].sort((a, b) => b.timestamp - a.timestamp);
    // Duplicate the list twice (original + clone) for a seamless infinite loop
    if (sorted.length > 8) {
      return [...sorted, ...sorted];
    }
    return sorted;
  }, [participants]);

  // Dynamic duration: keep vertical scrolling speed consistent regardless of participant count
  const animationDuration = useMemo(() => {
    const baseSpeed = 4; // seconds per participant row
    const cols = 4; // average columns
    const rows = Math.ceil(participants.length / cols);
    return Math.max(rows * baseSpeed, 20);
  }, [participants.length]);

  const isScrolling = participants.length > 10;

  return (
    <>
      <div className="h-[calc(100vh-140px)] flex flex-col space-y-4 md:space-y-6 overflow-hidden">
        {/* Wall Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 shrink-0 px-2">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400">
                <Trophy size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">大PK 實況牆</h2>
            </div>
            <p className="text-slate-400 text-xs md:text-sm font-medium">礁溪老爺大酒店 2026 造型PK賽現況</p>
          </div>

          <div className="flex items-center gap-3">
            {/* 參賽選手統計 */}
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/40 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
              <Users size={20} className="text-amber-400" />
              <div className="flex flex-col">
                <span className="text-white text-xl font-bold leading-none">{participants.length}</span>
                <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">選手</span>
              </div>
            </div>

            {/* 總投票數統計 */}
            <div className="flex items-center gap-3 px-4 py-2 bg-rose-500/10 rounded-2xl border border-rose-500/20 backdrop-blur-sm">
              <Heart size={20} className="text-rose-500 fill-rose-500/20" />
              <div className="flex flex-col">
                <span className="text-white text-xl font-bold leading-none">{totalVotes}</span>
                <span className="text-rose-500/70 text-[9px] font-black uppercase tracking-widest">總票數</span>
              </div>
            </div>

            {isScrolling && (
              <div className="hidden lg:flex items-center gap-2 ml-2 px-3 py-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <div className="relative">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping absolute inset-0" />
                  <div className="w-2 h-2 bg-emerald-500 rounded-full relative" />
                </div>
                <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Live</span>
              </div>
            )}
          </div>
        </div>

        {participants.length > 0 ? (
          <div className="relative flex-1 overflow-hidden rounded-3xl bg-slate-900/20 border border-slate-800/50">
            {/* Scrollable Container */}
            <div
              className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4 p-2 md:p-4 will-change-transform ${isScrolling ? 'animate-wall-crawl' : ''}`}
              style={{
                animationDuration: `${animationDuration}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite'
              }}
            >
              {displayParticipants.map((p, index) => (
                <div
                  key={`${p.id}-${index}`}
                  className="transform-gpu transition-transform duration-300 hover:scale-[1.02] hover:z-10 cursor-pointer"
                  onClick={() => setSelectedParticipant(p)}
                >
                  <Card participant={p} showVotes={showVotes} />
                </div>
              ))}
            </div>

            {/* Depth Overlays */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a0f1a] via-[#0a0f1a]/60 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/60 to-transparent z-10 pointer-events-none" />

            {/* Edge Glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent z-20" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent z-20" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 bg-slate-800/10 rounded-3xl border-2 border-dashed border-slate-800/50 m-2">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full" />
              <div className="relative w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-700 border border-slate-700">
                <LayoutGrid size={48} />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-white text-xl font-bold">虛位以待，首位參賽者在哪裡？</p>
              <p className="text-slate-500 max-w-xs mx-auto">掃描首頁 QR Code 即可立即上傳您的造型，並在展示牆上閃耀！</p>
            </div>
          </div>
        )}

        {/* Fluid Animation Keyframes */}
        <style>{`
          @keyframes wall-crawl {
            0% {
              transform: translate3d(0, 0, 0);
            }
            100% {
              transform: translate3d(0, -50%, 0);
            }
          }
          .animate-wall-crawl {
            animation-name: wall-crawl;
          }
          .animate-wall-crawl:hover {
            animation-play-state: paused;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-wall-crawl {
              animation: none;
              overflow-y: auto;
            }
          }
        `}</style>
      </div>

      <ImageModal
        participant={selectedParticipant}
        onClose={() => setSelectedParticipant(null)}
        onVote={onVote}
        hasVoted={hasVoted}
      />
    </>
  );
};

export default WallView;
