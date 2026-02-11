
import React from 'react';
import { ViewType, ActivityConfig } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { Camera, Vote, LayoutGrid, Monitor, Star, Lock } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: ViewType) => void;
  config: ActivityConfig;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, config }) => {
  const currentUrl = window.location.href;

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <Star className="text-amber-400 fill-amber-400 w-12 h-12 animate-bounce" />
        </div>
        <h2 className="text-4xl md:text-6xl font-display text-white tracking-widest leading-tight">
          2026 歡樂蹦迪爺總會<br />最佳造型獎大PK
        </h2>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          展現您的非凡風格！掃描 QR Code 參加造型大賽，或為您支持的佳麗與帥哥投下一票！
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-8 border border-slate-700 flex flex-col items-center space-y-6">
          <div className="p-4 bg-amber-500/20 rounded-2xl text-amber-400 relative">
            <Camera size={40} />
            {!config.isRegistrationOpen && <Lock size={20} className="absolute -bottom-1 -right-1 text-rose-500" />}
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">上傳我的造型</h3>
            <p className="text-slate-400 text-sm">拍攝全身照，填寫大名與主題</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-xl shadow-amber-500/10">
            <QRCodeSVG value={currentUrl} size={180} />
          </div>
          <button
            disabled={!config.isRegistrationOpen}
            onClick={() => onNavigate(ViewType.REGISTER)}
            className={`w-full py-4 font-bold rounded-2xl transition-all ${config.isRegistrationOpen
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
          >
            {config.isRegistrationOpen ? '立即上傳' : '上傳已截止'}
          </button>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-8 border border-slate-700 flex flex-col items-center space-y-6">
          <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400">
            <Vote size={40} />
            {!config.isVotingOpen && <Lock size={20} className="absolute -bottom-1 -right-1 text-rose-500" />}
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">投票支持</h3>
            <p className="text-slate-400 text-sm">選出您心中第一名造型</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-xl shadow-blue-500/10">
            <QRCodeSVG value={currentUrl} size={180} />
          </div>
          <button
            disabled={!config.isVotingOpen}
            onClick={() => onNavigate(ViewType.VOTE)}
            className={`w-full py-4 font-bold rounded-2xl transition-all ${config.isVotingOpen
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
          >
            {config.isVotingOpen ? '我要投票' : '投票已截止'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
