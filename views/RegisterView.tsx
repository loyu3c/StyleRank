
import React, { useState, useRef } from 'react';
import { Participant } from '../types';
import { compressImage } from '../services/imageUtils';
import { Camera, Upload, Loader2, X, Sparkles, Lock } from 'lucide-react';

interface RegisterViewProps {
  onRegister: (p: Participant) => Promise<void>;
  onCancel: () => void;
  // Fix Error in App.tsx on line 111: Property 'isOpen' does not exist on type 'IntrinsicAttributes & RegisterViewProps'
  isOpen: boolean;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, onCancel, isOpen }) => {
  const [name, setName] = useState('');
  const [empId, setEmpId] = useState('');
  const [theme, setTheme] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setPhoto(compressed);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !empId || !theme || !photo || !isOpen) {
      setError(isOpen ? '請填寫完整資訊並上傳照片' : '目前非報名時間');
      return;
    }

    try {
      setIsProcessing(true);
      const newParticipant: Participant = {
        id: crypto.randomUUID(),
        name,
        empId,
        theme,
        photoUrl: photo,
        timestamp: Date.now(),
        entryNumber: 0,
        votes: 0
      };
      await onRegister(newParticipant);
    } catch (err) {
      console.error(err);
      setError('上傳發生錯誤，請稍後再試');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-400" />
          <h2 className="text-2xl font-bold text-white">參加大PK</h2>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div onClick={() => isOpen && fileInputRef.current?.click()} className={`relative aspect-[3/4] rounded-3xl overflow-hidden border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer ${photo ? 'border-transparent' : 'border-slate-700 bg-slate-800/30 hover:border-amber-500/50'} ${!isOpen ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {photo ? (
            <>
              <img src={photo} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <p className="text-white font-bold flex items-center gap-2">
                  <Camera size={20} /> 重拍一張
                </p>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4 px-6">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto text-amber-400">
                <Camera size={32} />
              </div>
              <div>
                <p className="text-white font-bold">{isOpen ? '點擊上傳或拍照' : '報名已截止'}</p>
                <p className="text-slate-500 text-sm">{isOpen ? '請拍攝您的全身精美造型' : '感謝您的關注'}</p>
              </div>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" capture="environment" className="hidden" />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-slate-400 text-sm font-medium ml-1">參賽大名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="請輸入姓名"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={!isOpen}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 text-sm font-medium ml-1">員工編號</label>
            <input
              type="text"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              placeholder="請輸入員編"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={!isOpen}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 text-sm font-medium ml-1">服裝主題說明</label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="例如：優雅紳士、華麗禮服"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={!isOpen}
            />
          </div>
        </div>

        {error && <p className="text-rose-500 text-sm text-center font-medium bg-rose-500/10 py-3 rounded-xl">{error}</p>}

        <button
          type="submit"
          disabled={isProcessing || !photo || !name || !empId || !theme || !isOpen}
          className={`w-full py-4 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all shadow-xl ${isProcessing || !photo || !name || !empId || !theme || !isOpen ? 'bg-slate-700 cursor-not-allowed text-slate-500' : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/20 active:scale-95'}`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              圖片處理中...
            </>
          ) : !isOpen ? (
            <>
              <Lock size={20} />
              報名已截止
            </>
          ) : (
            <>
              <Upload size={20} />
              送出照片至展示牆
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterView;
