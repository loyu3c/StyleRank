
import React from 'react';
import { Participant, ActivityConfig } from '../types';
import { Trophy, RefreshCcw, PlayCircle, UserPlus, Fingerprint, Lock, Unlock, Settings2 } from 'lucide-react';

interface AdminViewProps {
  participants: Participant[];
  config: ActivityConfig;
  onUpdateConfig: (config: ActivityConfig) => void;
  onReset: () => void;
  onSimulateParticipant: () => void;
  onSimulateVotes: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ participants, config, onUpdateConfig, onReset, onSimulateParticipant, onSimulateVotes }) => {
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                  config.isRegistrationOpen ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {config.isRegistrationOpen ? <Unlock size={18} /> : <Lock size={18} />}
                {config.isRegistrationOpen ? '開啟中' : '已關閉'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
              <div>
                <p className="text-white font-bold">公布投票結果</p>
                <p className="text-slate-500 text-xs">開啟後照片牆將顯示每個人票數</p>
              </div>
              <button 
                onClick={() => onUpdateConfig({ ...config, isResultsRevealed: !config.isResultsRevealed })}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                  config.isResultsRevealed ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-400'
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

      {/* Simulation Tools */}
      <div className="bg-amber-500/5 border border-amber-500/20 p-8 rounded-3xl space-y-6">
        <div className="flex items-center gap-2 text-amber-400">
          <PlayCircle size={24} />
          <h3 className="text-xl font-bold text-amber-500">Demo 模擬工具</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <button onClick={onSimulateParticipant} className="flex items-center gap-2 px-6 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95">
            <UserPlus size={20} /> 模擬新增一位參加者
          </button>
          <button 
            onClick={onSimulateVotes} 
            disabled={participants.length === 0}
            className="flex items-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all disabled:bg-slate-700 disabled:text-slate-500 active:scale-95"
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

export default AdminView;
