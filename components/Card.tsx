
import React from 'react';
import { Participant } from '../types';
import { Heart, Sparkles, User, Hash } from 'lucide-react';

interface CardProps {
  participant: Participant;
  onVote?: (id: string) => void;
  showVotes?: boolean;
  hasVoted?: boolean;
  isVoting?: boolean;
}

// 使用 React.memo 確保只有當該參加者的資料改變時才重新渲染，這對 100 人規模非常重要
const Card: React.FC<CardProps> = React.memo(({ participant, onVote, showVotes, hasVoted, isVoting }) => {
  return (
    <div className="bg-slate-800/80 rounded-xl overflow-hidden shadow-lg border border-slate-700/50 transition-all hover:border-amber-500/30 h-full flex flex-col group relative">
      <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
        {/* Entry Number Badge - 更加醒目以便在 100 人中識別 */}
        <div className="absolute top-2 left-2 z-20 bg-amber-500 text-black px-2.5 py-1 rounded-lg font-display text-base font-bold flex items-center gap-0.5 shadow-xl border border-amber-400">
          <Hash size={14} />
          {String(participant.entryNumber).padStart(3, '0')}
        </div>

        <img 
          src={participant.photoUrl} 
          alt={participant.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          loading="lazy" 
        />
        
        {showVotes && (
          <div className="absolute top-2 right-2 z-20 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-rose-500/30 shadow-lg">
            <Heart size={14} className="text-rose-500 fill-rose-500" />
            <span className="font-bold text-white text-sm">{participant.votes}</span>
          </div>
        )}
      </div>
      
      <div className="p-3 space-y-1 bg-gradient-to-b from-slate-800 to-slate-900 flex-1">
        <div className="flex items-center gap-1.5 text-white">
          <User size={14} className="text-amber-400 shrink-0" />
          <h3 className="font-bold truncate text-sm md:text-base">{participant.name}</h3>
        </div>
        <p className="text-slate-400 text-[10px] md:text-xs truncate flex items-center gap-1">
          <Sparkles size={10} className="text-amber-500/70 shrink-0" />
          {participant.theme}
        </p>
        
        {isVoting && (
          <div className="pt-2">
            {!hasVoted ? (
              <button 
                onClick={() => onVote?.(participant.id)} 
                className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Heart size={12} />
                投他一票
              </button>
            ) : (
              <div className="w-full py-2.5 bg-slate-700/50 text-slate-500 font-bold rounded-xl text-center text-xs border border-slate-700">
                已投票
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default Card;
