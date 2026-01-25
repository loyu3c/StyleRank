import React, { useState } from 'react';
import { Participant, ActivityConfig } from '../types';
import { Trophy, RefreshCcw, PlayCircle, UserPlus, Fingerprint, Lock, Unlock, Settings2, LogOut, Gift, Sparkles, X } from 'lucide-react';
import { dataService } from '../services/dataService';
import confetti from 'canvas-confetti';

interface AdminViewProps {
  participants: Participant[];
  config: ActivityConfig;
  onUpdateConfig: (config: ActivityConfig) => void;
  onReset: () => void;
  onSimulateParticipant: () => void;
  onSimulateVotes: () => void;
  onLogout: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ participants, config, onUpdateConfig, onReset, onSimulateParticipant, onSimulateVotes, onLogout }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings2 className="text-cyan-400" />
            活動後台控制中心
          </h2>
          <p className="text-slate-400">管理活動狀態、參賽資料與投票權限</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all font-bold border border-slate-700"
        >
          <LogOut size={18} />
          安全登出
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Control */}
        <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">活動狀態開關</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
              <div>
                <p className="text-white font-bold">照片上傳登記</p>
                <p className="text-slate-500 text-xs">關閉後參加者將無法上傳照片</p>
              </div>
              <button
                onClick={() => onUpdateConfig({ ...config, isRegistrationOpen: !config.isRegistrationOpen })}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${config.isRegistrationOpen ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}
              >
                {config.isRegistrationOpen ? <Unlock size={18} /> : <Lock size={18} />}
                {config.isRegistrationOpen ? '開啟中' : '已關閉'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
              <div>
                <p className="text-white font-bold">開放記名投票</p>
                <p className="text-slate-500 text-xs">關閉後將無法進行投票</p>
              </div>
              <button
                onClick={() => onUpdateConfig({ ...config, isVotingOpen: !config.isVotingOpen })}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${config.isVotingOpen ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}
              >
                {config.isVotingOpen ? <Unlock size={18} /> : <Lock size={18} />}
                {config.isVotingOpen ? '投票中' : '已截止'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
              <div>
                <p className="text-white font-bold">公布投票結果</p>
                <p className="text-slate-500 text-xs">開啟後照片牆將顯示每個人票數</p>
              </div>
              <button
                onClick={() => onUpdateConfig({ ...config, isResultsRevealed: !config.isResultsRevealed })}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${config.isResultsRevealed ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-400'
                  }`}
              >
                {config.isResultsRevealed ? '已公布' : '隱藏中'}
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-rose-500/5 p-6 rounded-3xl border border-rose-500/20 space-y-4">
          <h3 className="text-xl font-bold text-rose-500 flex items-center gap-2">危險區域</h3>
          <p className="text-slate-400 text-sm">重置將永久刪除所有參賽照片與投票數據，請謹慎操作。</p>
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold transition-all"
          >
            <RefreshCcw size={20} />
            重置並清空所有資料
          </button>
        </div>
      </div>

      {/* Tools Section */}
      <div className="bg-amber-500/5 border border-amber-500/20 p-8 rounded-3xl space-y-6">
        <div className="flex items-center gap-2 text-amber-400">
          <PlayCircle size={24} />
          <h3 className="text-xl font-bold text-amber-500">工具箱</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <LuckyDrawButton config={config} onUpdateConfig={onUpdateConfig} />

          <button onClick={onSimulateParticipant} className="flex items-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-slate-700 active:scale-95">
            <UserPlus size={20} /> 模擬新增一位參加者
          </button>

          <button
            onClick={onSimulateVotes}
            disabled={participants.length === 0}
            className="flex items-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-slate-700 disabled:opacity-50 active:scale-95"
          >
            <Fingerprint size={20} /> 隨機產生 5 張選票
          </button>
        </div>
      </div>

      <div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700 text-center">
        <p className="text-slate-500">目前共有 <span className="text-white font-bold">{participants.length}</span> 位參加者，總票數 <span className="text-white font-bold">{participants.reduce((a, b) => a + b.votes, 0)}</span> 票</p>
      </div>
    </div>
  );
};

interface LuckyDrawButtonProps {
  config: ActivityConfig;
  onUpdateConfig: (config: ActivityConfig) => void;
}

const LuckyDrawButton: React.FC<LuckyDrawButtonProps> = ({ config, onUpdateConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<{ empId: string, name: string } | null>(config.luckyDrawWinner || null);

  // Sync with global config
  React.useEffect(() => {
    if (config.luckyDrawWinner) {
      setWinner(config.luckyDrawWinner);
    } else {
      setWinner(null);
    }
  }, [config.luckyDrawWinner]);

  const handleDraw = async () => {
    setIsDrawing(true);
    setWinner(null);
    try {
      const votes = await dataService.getAllVotes();
      if (votes.length === 0) {
        alert("目前沒有投票資料可供抽獎！");
        setIsDrawing(false);
        return;
      }

      // Shuffle animation effect
      let count = 0;
      const interval = setInterval(() => {
        count++;
        if (count > 20) {
          clearInterval(interval);
          // Pick winner
          const randomVote = votes[Math.floor(Math.random() * votes.length)];
          const winnerData = { empId: randomVote.empId, name: randomVote.name };
          setWinner(winnerData);

          // Save to global config
          onUpdateConfig({ ...config, luckyDrawWinner: winnerData });

          setIsDrawing(false);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }, 100);

    } catch (e) {
      console.error(e);
      alert("抽獎失敗");
      setIsDrawing(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95"
      >
        <Gift size={20} /> 參加獎抽獎
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-pink-500/50 p-8 shadow-2xl flex flex-col items-center text-center space-y-8 animate-in zoom-in-95">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
              <X size={24} />
            </button>

            <div className="space-y-2">
              <div className="inline-flex p-4 bg-pink-500/20 rounded-full text-pink-500 mb-2">
                <Gift size={48} />
              </div>
              <h3 className="text-3xl font-bold text-white">投票參加獎</h3>
              <p className="text-slate-400">從所有投票紀錄中抽出一位幸運兒</p>
            </div>

            {winner ? (
              <div className="w-full p-6 bg-gradient-to-br from-pink-500/20 to-rose-600/20 border border-pink-500/50 rounded-2xl animate-in zoom-in duration-500">
                <p className="text-pink-400 text-sm font-bold uppercase tracking-widest mb-2">WINNER</p>
                <h4 className="text-4xl font-black text-white mb-2">{winner.name}</h4>
                <p className="text-xl text-white/80 font-mono">{winner.empId}</p>
              </div>
            ) : isDrawing ? (
              <div className="w-full p-8 flex items-center justify-center">
                <Sparkles className="animate-spin text-pink-500" size={48} />
              </div>
            ) : (
              <div className="w-full h-24 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl text-slate-600 font-bold">
                誰是幸運兒？
              </div>
            )}

            <button
              onClick={handleDraw}
              disabled={isDrawing}
              className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-xl text-xl shadow-lg shadow-pink-500/20 active:scale-95 disabled:opacity-50 transition-all"
            >
              {isDrawing ? '抽獎中...' : winner ? '再抽一位' : '開始抽獎'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminView;
