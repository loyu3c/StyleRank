
import React, { useState, useEffect, useCallback } from 'react';
import { ViewType, Participant, ActivityConfig } from './types';
import HomeView from './views/HomeView';
import RegisterView from './views/RegisterView';
import WallView from './views/WallView';
import VoteView from './views/VoteView';
import AdminView from './views/AdminView';
import ResultsView from './views/ResultsView';
import { LayoutGrid, Camera, Vote, BarChart3, Home, Star, Settings } from 'lucide-react';

const STORAGE_KEY = 'hotel_royal_awards_participants_2026';
const VOTE_STATUS_KEY = 'hotel_royal_awards_voted_2026';
const CONFIG_KEY = 'hotel_royal_awards_config_2026';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.HOME);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [config, setConfig] = useState<ActivityConfig>({
    isRegistrationOpen: true,
    isResultsRevealed: false
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setParticipants(JSON.parse(saved));
    
    const voted = localStorage.getItem(VOTE_STATUS_KEY);
    if (voted) setHasVoted(true);

    const savedConfig = localStorage.getItem(CONFIG_KEY);
    if (savedConfig) setConfig(JSON.parse(savedConfig));

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) setParticipants(JSON.parse(e.newValue));
      if (e.key === VOTE_STATUS_KEY) setHasVoted(!!e.newValue);
      if (e.key === CONFIG_KEY && e.newValue) setConfig(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveParticipants = (newParticipants: Participant[]) => {
    setParticipants(newParticipants);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newParticipants));
  };

  const saveConfig = (newConfig: ActivityConfig) => {
    setConfig(newConfig);
    localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
  };

  const handleRegister = useCallback((newParticipant: Participant) => {
    if (!config.isRegistrationOpen) return;
    const entryNumber = participants.length + 1;
    const updated = [...participants, { ...newParticipant, entryNumber }];
    saveParticipants(updated);
    setCurrentView(ViewType.WALL);
  }, [participants, config.isRegistrationOpen]);

  const handleVote = useCallback((participantId: string) => {
    if (hasVoted) return;
    const updated = participants.map(p => 
      p.id === participantId ? { ...p, votes: p.votes + 1 } : p
    );
    saveParticipants(updated);
    setHasVoted(true);
    localStorage.setItem(VOTE_STATUS_KEY, 'true');
  }, [participants, hasVoted]);

  const resetData = () => {
    if (window.confirm('確定要清除所有參賽資料與投票嗎？')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VOTE_STATUS_KEY);
      setParticipants([]);
      setHasVoted(false);
      saveConfig({ isRegistrationOpen: true, isResultsRevealed: false });
    }
  };

  const simulateParticipant = () => {
    const names = ["林大華", "陳美玲", "張小明", "李國強", "王曉芬", "周杰克", "蔡依林"];
    const themes = ["奢華晚宴風", "礁溪文青感", "熱帶夏威夷", "未來科技感", "和風浴衣", "復古爵士", "森林系精靈"];
    const randomId = crypto.randomUUID();
    const newP: Participant = {
      id: randomId,
      name: names[Math.floor(Math.random() * names.length)] + (participants.length + 1),
      theme: themes[Math.floor(Math.random() * themes.length)],
      photoUrl: `https://picsum.photos/seed/${randomId}/600/600`,
      timestamp: Date.now(),
      votes: Math.floor(Math.random() * 5),
      entryNumber: participants.length + 1
    };
    saveParticipants([...participants, newP]);
  };

  const simulateVotes = (count: number = 5) => {
    if (participants.length === 0) return;
    let updated = [...participants];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * updated.length);
      updated[randomIndex] = { ...updated[randomIndex], votes: updated[randomIndex].votes + 1 };
    }
    saveParticipants(updated);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewType.HOME: return <HomeView onNavigate={setCurrentView} config={config} />;
      case ViewType.REGISTER: return <RegisterView onRegister={handleRegister} onCancel={() => setCurrentView(ViewType.HOME)} isOpen={config.isRegistrationOpen} />;
      case ViewType.WALL: return <WallView participants={participants} showVotes={config.isResultsRevealed} />;
      case ViewType.VOTE: return <VoteView participants={participants} onVote={handleVote} hasVoted={hasVoted} />;
      case ViewType.ADMIN: return (
        <AdminView 
          participants={participants} 
          onReset={resetData} 
          onSimulateParticipant={simulateParticipant}
          onSimulateVotes={() => simulateVotes(5)}
          config={config}
          onUpdateConfig={saveConfig}
        />
      );
      case ViewType.RESULTS: return <ResultsView participants={participants} onFinishReveal={() => saveConfig({ ...config, isResultsRevealed: true })} />;
      default: return <HomeView onNavigate={setCurrentView} config={config} />;
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 bg-[#0a0f1a]">
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0f172a]/90 backdrop-blur-lg border-b border-slate-800 z-50 hidden md:flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <Star className="text-amber-400 fill-amber-400 w-6 h-6" />
          <h1 className="font-display text-2xl tracking-widest text-white">2026 礁溪老爺大酒店</h1>
        </div>
        <nav className="flex items-center gap-2">
          <NavItem active={currentView === ViewType.HOME} onClick={() => setCurrentView(ViewType.HOME)} icon={<Home size={18}/>} label="首頁" />
          <NavItem active={currentView === ViewType.WALL} onClick={() => setCurrentView(ViewType.WALL)} icon={<LayoutGrid size={18}/>} label="照片牆" />
          <NavItem active={currentView === ViewType.RESULTS} onClick={() => setCurrentView(ViewType.RESULTS)} icon={<TrophyIcon size={18}/>} label="開票盛典" />
          <NavItem active={currentView === ViewType.ADMIN} onClick={() => setCurrentView(ViewType.ADMIN)} icon={<Settings size={18}/>} label="後台管理" />
        </nav>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 py-8">
        {renderView()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 flex items-center justify-around px-4 z-50 md:hidden">
        <button onClick={() => setCurrentView(ViewType.HOME)} className={`flex flex-col items-center gap-1 ${currentView === ViewType.HOME ? 'text-amber-400' : 'text-slate-500'}`}>
          <Home size={22} /><span className="text-[10px] font-bold">首頁</span>
        </button>
        <button onClick={() => setCurrentView(ViewType.WALL)} className={`flex flex-col items-center gap-1 ${currentView === ViewType.WALL ? 'text-amber-400' : 'text-slate-500'}`}>
          <LayoutGrid size={22} /><span className="text-[10px] font-bold">照片牆</span>
        </button>
        <button onClick={() => config.isRegistrationOpen ? setCurrentView(ViewType.REGISTER) : alert('上傳已截止')} className="flex flex-col items-center -mt-8">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-[#0a0f1a] ${config.isRegistrationOpen ? 'bg-gradient-to-tr from-amber-400 to-orange-600 shadow-amber-500/30' : 'bg-slate-700 shadow-none'}`}>
            <Camera size={26} className="text-white" />
          </div>
          <span className={`text-[10px] font-bold mt-1 ${config.isRegistrationOpen ? 'text-amber-400' : 'text-slate-500'}`}>參加</span>
        </button>
        <button onClick={() => setCurrentView(ViewType.VOTE)} className={`flex flex-col items-center gap-1 ${currentView === ViewType.VOTE ? 'text-amber-400' : 'text-slate-500'}`}>
          <Vote size={22} /><span className="text-[10px] font-bold">投票</span>
        </button>
        <button onClick={() => setCurrentView(ViewType.RESULTS)} className={`flex flex-col items-center gap-1 ${currentView === ViewType.RESULTS ? 'text-amber-400' : 'text-slate-500'}`}>
          <BarChart3 size={22} /><span className="text-[10px] font-bold">開票</span>
        </button>
      </nav>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${active ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-400 hover:text-white'}`}>
    {icon}<span className="font-bold text-xs">{label}</span>
  </button>
);

const TrophyIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

export default App;
