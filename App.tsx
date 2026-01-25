import React, { useState, useEffect, useCallback } from 'react';
import { ViewType, Participant, ActivityConfig } from './types';
import HomeView from './views/HomeView';
import RegisterView from './views/RegisterView';
import WallView from './views/WallView';
import VoteView from './views/VoteView';
import AdminView from './views/AdminView';
import ResultsView from './views/ResultsView';
import LoginModal from './components/LoginModal';
import { LayoutGrid, Camera, Vote, BarChart3, Home, Star, Settings } from 'lucide-react';
import { dataService } from './services/dataService';
import confetti from 'canvas-confetti';

const VOTE_STATUS_KEY = 'hotel_royal_awards_voted_2026';
const ADMIN_AUTH_KEY = 'hotel_royal_admin_auth_2026';
const LAST_RESET_KEY = 'hotel_royal_last_reset_2026';
const ADMIN_PASSWORD = '6696378611';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.HOME);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [config, setConfig] = useState<ActivityConfig>({
    isRegistrationOpen: true,
    isVotingOpen: true,
    isResultsRevealed: false
  });

  // Admin Auth States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingView, setPendingView] = useState<ViewType | null>(null);

  // 監聽 Firebase 資料
  useEffect(() => {
    // 1. 監聽參賽者
    const unsubscribeParticipants = dataService.listenToParticipants((data) => {
      setParticipants(data);
    });

    // 2. 監聽全域設定
    const unsubscribeConfig = dataService.listenToConfig((data) => {
      setConfig(data);

      // Check for global reset
      if (data.lastResetTimestamp) {
        const localLastReset = localStorage.getItem(LAST_RESET_KEY);
        // If server reset time is newer than local, clear local vote status
        if (!localLastReset || Number(localLastReset) < data.lastResetTimestamp) {
          localStorage.removeItem(VOTE_STATUS_KEY);
          localStorage.setItem(LAST_RESET_KEY, String(data.lastResetTimestamp));
          setHasVoted(false);
          // alert('活動已重置，您可以重新投票！'); // Optional: notify user
        }
      }
    });

    // 3. 檢查本機是否投過票 (投票狀態仍維持在本機，避免重複投票)
    // Note: This logic now runs after reset check to ensure we don't restore old state inappropriately
    const voted = localStorage.getItem(VOTE_STATUS_KEY);
    if (voted) setHasVoted(true);

    // 4. 檢查管理員登入狀態
    const adminAuth = localStorage.getItem(ADMIN_AUTH_KEY);
    if (adminAuth === 'true') setIsAdminLoggedIn(true);

    return () => {
      unsubscribeParticipants();
      unsubscribeConfig();
    };
  }, []);

  const handleRegister = useCallback(async (newParticipant: Participant) => {
    if (!config.isRegistrationOpen) return;
    try {
      // 这里的 newParticipant.photoUrl 其實是 base64，我們需要傳給 dataService 處理上傳
      const { name, empId, theme, photoUrl } = newParticipant;
      if (!photoUrl) return;

      // 顯示 loading 或提示 (這裏簡單用 alert，實際上 RegisterView 應該還有 loading state)
      // 注意：這裡直接 await，RegisterView 沒有傳遞這 promise，但沒關係，這會觸發 Firestore 更新
      await dataService.addParticipant({ name, empId, theme }, photoUrl);

      setCurrentView(ViewType.WALL);
      alert('報名成功！照片已上傳至展示牆。');
    } catch (e) {
      console.error(e);
      alert('上傳失敗，請稍後再試。');
    }
  }, [config.isRegistrationOpen]);

  const handleVote = useCallback(async (participantId: string, voterInfo?: { empId: string, name: string }) => {
    if (hasVoted) return;
    if (!config.isVotingOpen) {
      alert('投票已截止！');
      return;
    }
    try {
      await dataService.voteForParticipant(participantId, voterInfo);
      setHasVoted(true);
      localStorage.setItem(VOTE_STATUS_KEY, 'true');
    } catch (e) {
      console.error(e);
      alert('投票失敗');
    }
  }, [hasVoted]);

  const resetData = async () => {
    if (window.confirm('確定要清除所有雲端資料與投票嗎？此操作不可逆！\n注意：這也會清除所有使用者的投票狀態。')) {
      await dataService.resetAllData();
      // 本機狀態也要清除，方便測試
      localStorage.removeItem(VOTE_STATUS_KEY);
      setHasVoted(false);
    }
  };


  const updateConfig = async (newConfig: ActivityConfig) => {
    await dataService.updateConfig(newConfig);
  };

  // 模擬功能 (保留但改寫為寫入 Firebase)
  const simulateParticipant = async () => {
    alert("模擬功能需配合真實圖片上傳邏輯，目前停用。");
  };

  const simulateVotes = async (count: number = 5) => {
    if (participants.length === 0) return;
    // 隨機投 5 票
    for (let i = 0; i < count; i++) {
      const randomP = participants[Math.floor(Math.random() * participants.length)];
      await dataService.voteForParticipant(randomP.id);
    }
  };

  // 處理導航切換 (含權限驗證)
  const handleNavigate = (view: ViewType) => {
    if (view === ViewType.ADMIN) {
      if (isAdminLoggedIn) {
        setCurrentView(view);
      } else {
        setPendingView(view);
        setIsLoginModalOpen(true);
      }
    } else {
      setCurrentView(view);
    }
  };

  const handleLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      if (pendingView) {
        setCurrentView(pendingView);
        setPendingView(null);
      }
      return true;
    }
    return false;
  };

  // 模擬新增參加者
  const handleSimulateParticipant = async () => {
    // Random fake image
    const getRandomImage = () => {
      const id = Math.floor(Math.random() * 1000);
      return `https://picsum.photos/seed/${id}/600/800`;
    };

    const mock: Participant = {
      id: crypto.randomUUID(),
      name: `參賽者 ${Math.floor(Math.random() * 1000)}`,
      empId: `EMP${Math.floor(Math.random() * 10000)}`,
      theme: '風格主題測試',
      photoUrl: getRandomImage(),
      timestamp: Date.now(),
      votes: 0,
      entryNumber: 0
    };

    try {
      // 使用 addMockParticipant 以跳過圖片上傳流程
      await dataService.addMockParticipant(mock, mock.photoUrl);
      alert("模擬新增成功！");
    } catch (e) {
      console.error(e);
      alert("模擬新增失敗");
    }
  };

  // 模擬投票
  const handleSimulateVotes = async () => {
    if (participants.length === 0) return;
    try {
      for (let i = 0; i < 5; i++) {
        const randomP = participants[Math.floor(Math.random() * participants.length)];
        await dataService.voteForParticipant(randomP.id, {
          empId: `BOT${Math.floor(Math.random() * 9999)}`,
          name: '機器人'
        });
      }
    } catch (e) {
      console.error(e);
      alert("模擬投票失敗");
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setCurrentView(ViewType.HOME);
    alert('已安全登出');
  };

  const fireConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewType.HOME: return <HomeView onNavigate={handleNavigate} config={config} />;
      case ViewType.REGISTER: return <RegisterView onRegister={handleRegister} onCancel={() => handleNavigate(ViewType.HOME)} isOpen={config.isRegistrationOpen} />;
      case ViewType.WALL: return <WallView participants={participants} showVotes={config.isResultsRevealed} onVote={handleVote} hasVoted={hasVoted} />;
      case ViewType.VOTE: return <VoteView participants={participants} onVote={handleVote} hasVoted={hasVoted} />;
      case ViewType.ADMIN: return (
        <AdminView
          participants={participants}
          onReset={resetData}
          onSimulateParticipant={simulateParticipant}
          onSimulateVotes={() => simulateVotes(5)}
          config={config}
          onUpdateConfig={updateConfig}
          onLogout={handleLogout}
        />
      );
      case ViewType.RESULTS: return (
        <ResultsView
          participants={participants}
          config={config}
          onFinishReveal={() => {
            updateConfig({ ...config, isResultsRevealed: true });
            fireConfetti();
          }}
          isAdminLoggedIn={isAdminLoggedIn}
        />
      );
      default: return <HomeView onNavigate={handleNavigate} config={config} />;
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
          <NavItem active={currentView === ViewType.HOME} onClick={() => handleNavigate(ViewType.HOME)} icon={<Home size={18} />} label="首頁" />
          <NavItem active={currentView === ViewType.WALL} onClick={() => handleNavigate(ViewType.WALL)} icon={<LayoutGrid size={18} />} label="照片牆" />
          <NavItem active={currentView === ViewType.RESULTS} onClick={() => handleNavigate(ViewType.RESULTS)} icon={<TrophyIcon size={18} />} label="開票盛典" />
          <NavItem active={currentView === ViewType.ADMIN} onClick={() => handleNavigate(ViewType.ADMIN)} icon={<Settings size={18} />} label="後台管理" />
        </nav>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 py-8">
        {renderView()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 flex items-center justify-around px-4 z-50 md:hidden">
        <button onClick={() => handleNavigate(ViewType.HOME)} className={`flex flex-col items-center gap-1 ${currentView === ViewType.HOME ? 'text-amber-400' : 'text-slate-500'}`}>
          <Home size={22} /><span className="text-[10px] font-bold">首頁</span>
        </button>
        <button onClick={() => handleNavigate(ViewType.WALL)} className={`flex flex-col items-center gap-1 ${currentView === ViewType.WALL ? 'text-amber-400' : 'text-slate-500'}`}>
          <LayoutGrid size={22} /><span className="text-[10px] font-bold">照片牆</span>
        </button>
        <button onClick={() => config.isRegistrationOpen ? handleNavigate(ViewType.REGISTER) : alert('上傳已截止')} className="flex flex-col items-center -mt-8">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-[#0a0f1a] ${config.isRegistrationOpen ? 'bg-gradient-to-tr from-amber-400 to-orange-600 shadow-amber-500/30' : 'bg-slate-700 shadow-none'}`}>
            <Camera size={26} className="text-white" />
          </div>
          <span className={`text-[10px] font-bold mt-1 ${config.isRegistrationOpen ? 'text-amber-400' : 'text-slate-500'}`}>參加</span>
        </button>
        <button onClick={() => handleNavigate(ViewType.VOTE)} className={`flex flex-col items-center gap-1 ${currentView === ViewType.VOTE ? 'text-amber-400' : 'text-slate-500'}`}>
          <Vote size={22} /><span className="text-[10px] font-bold">投票</span>
        </button>
        <button onClick={() => handleNavigate(ViewType.RESULTS)} className={`flex flex-col items-center gap-1 ${currentView === ViewType.RESULTS ? 'text-amber-400' : 'text-slate-500'}`}>
          <BarChart3 size={22} /><span className="text-[10px] font-bold">開票</span>
        </button>
      </nav>

      {/* Admin Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onLogin={handleLogin}
        onClose={() => setIsLoginModalOpen(false)}
      />
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
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export default App;
