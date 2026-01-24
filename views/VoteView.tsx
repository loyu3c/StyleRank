
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';
import Card from '../components/Card';
import { Vote, CheckCircle2, Search, Hash } from 'lucide-react';

interface VoteViewProps {
  participants: Participant[];
  onVote: (id: string) => void;
  hasVoted: boolean;
}

const VoteView: React.FC<VoteViewProps> = ({ participants, onVote, hasVoted }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParticipants = useMemo(() => {
    return participants.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.entryNumber.toString().includes(searchTerm) ||
      p.theme.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.entryNumber - b.entryNumber);
  }, [participants, searchTerm]);

  const handleConfirmVote = (id: string) => {
    const participant = participants.find(p => p.id === id);
    if (participant) {
      if (window.confirm(`確定要投給「${participant.name}」嗎？\n(每人僅限投一票，送出後無法修改)`)) {
        onVote(id);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="text-center space-y-3 py-4">
        <div className="inline-flex p-3 bg-amber-500/20 rounded-2xl text-amber-400 mb-1">
          <Vote size={32} />
        </div>
        <h2 className="text-3xl font-bold text-white">最佳造型獎投票</h2>
        <p className="text-slate-400 max-w-lg mx-auto text-sm">
          請選擇您心目中最完美的造型 (共 {participants.length} 位選手)
        </p>
      </div>

      {/* 搜尋列 - 處理大規模資料必備 */}
      <div className="sticky top-20 z-40 px-4 md:px-0">
        <div className="max-w-md mx-auto relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-400 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="搜尋姓名或編號..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-2xl"
          />
        </div>
      </div>

      {hasVoted && (
        <div className="max-w-md mx-auto bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4 animate-in zoom-in duration-300">
          <CheckCircle2 size={24} className="text-emerald-500" />
          <p className="text-emerald-400 font-bold text-sm">投票成功！感謝您的參與。</p>
        </div>
      )}

      {filteredParticipants.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 px-2 md:px-0">
          {filteredParticipants.map((p) => (
            <Card 
              key={p.id} 
              participant={p} 
              onVote={handleConfirmVote} 
              hasVoted={hasVoted} 
              isVoting 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-slate-700 mx-4">
          <p className="text-slate-500">找不到符合 "{searchTerm}" 的參加者。</p>
        </div>
      )}
    </div>
  );
};

export default VoteView;
