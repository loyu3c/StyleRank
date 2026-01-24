import React, { useState, useEffect } from 'react';
import { Lock, LogIn, X } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onLogin: (password: string) => boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLogin, onClose }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [animateError, setAnimateError] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPassword('');
            setError('');
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onLogin(password)) {
            onClose();
        } else {
            setError('密碼錯誤，請重新輸入');
            setAnimateError(true);
            setTimeout(() => setAnimateError(false), 500);
            setPassword('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center space-y-6">
                    <div className={`p-4 bg-slate-800 rounded-full text-amber-500 mb-2 ${animateError ? 'animate-bounce text-rose-500 bg-rose-500/10' : ''}`}>
                        <Lock size={32} />
                    </div>

                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold text-white">後台管理登入</h3>
                        <p className="text-slate-400 text-sm">請輸入管理員密碼以繼續</p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <div className="space-y-2">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="輸入密碼..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-center text-lg tracking-widest"
                                autoFocus
                            />
                            {error && <p className="text-rose-500 text-xs text-center font-bold animate-in fade-in slide-in-from-top-1">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                        >
                            <LogIn size={20} />
                            登入系統
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
