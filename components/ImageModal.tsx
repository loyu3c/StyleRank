import React, { useState, useEffect } from 'react';
import { Participant } from '../types';
import { X, Vote, Trophy, User } from 'lucide-react';

interface ImageModalProps {
    participant: Participant | null;
    onClose: () => void;
    onVote?: (id: string, voterInfo?: { empId: string, name: string }) => void;
    hasVoted?: boolean;
    showVotes?: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({ participant, onClose, onVote, hasVoted, showVotes = false }) => {
    const [empId, setEmpId] = useState('');
    const [name, setName] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!participant) {
            setShowForm(false);
            setEmpId('');
            setName('');
            setError('');
        }
    }, [participant]);

    if (!participant) return null;

    const handleInitialVoteClick = () => {
        if (!hasVoted && onVote) {
            setShowForm(true);
        }
    };

    const handleConfirmVote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!empId.trim() || !name.trim()) {
            setError('請填寫完整資訊以參加抽獎');
            return;
        }

        if (onVote) {
            onVote(participant.id, { empId, name });
            onClose();
        }
    };

    // Mask employee ID input but keep value
    const handleEmpIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmpId(e.target.value);
        setError('');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl max-h-full bg-[#0a0f1a] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-800 animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Image Section */}
                <div className="w-full md:w-3/5 bg-black flex items-center justify-center bg-slate-900/50 relative">
                    <img
                        src={participant.photoUrl}
                        alt={participant.name}
                        className="max-h-[40vh] md:max-h-[80vh] w-auto object-contain"
                    />
                </div>

                {/* Info Section */}
                <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between bg-[#0a0f1a] overflow-y-auto max-h-[50vh] md:max-h-full">
                    {!showForm ? (
                        <>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
                                        <span className="text-amber-400 font-bold text-sm tracking-wider">NO.{participant.entryNumber}</span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white">{participant.name}</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-800 space-y-2">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                            <Trophy size={16} /> 造型主題
                                        </div>
                                        <p className="text-slate-200 leading-relaxed">
                                            {participant.theme}
                                        </p>
                                    </div>

                                    {showVotes && (
                                        <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-800 space-y-2">
                                            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                                <User size={16} /> 目前票數
                                            </div>
                                            <p className="text-2xl font-bold text-white">
                                                {participant.votes} <span className="text-sm text-slate-500 font-normal">票</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-800">
                                {onVote ? (
                                    <button
                                        onClick={handleInitialVoteClick}
                                        disabled={hasVoted}
                                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${hasVoted
                                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/20 active:scale-95'
                                            }`}
                                    >
                                        {hasVoted ? (
                                            <>已完成投票</>
                                        ) : (
                                            <>
                                                <Vote size={24} /> 投給我一票
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <p className="text-center text-slate-500 text-sm">
                                        請前往「投票」分頁進行投票
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">填寫抽獎資訊</h3>
                                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white text-sm">
                                    返回
                                </button>
                            </div>

                            <form onSubmit={handleConfirmVote} className="space-y-6 flex-1">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-300">員工編號 (必須)</label>
                                        <input
                                            type="text"
                                            value={empId}
                                            onChange={handleEmpIdChange}
                                            placeholder="請輸入工號..."
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-300">真實姓名 (必須)</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => {
                                                setName(e.target.value);
                                                setError('');
                                            }}
                                            placeholder="請輸入姓名..."
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        />
                                    </div>
                                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                        <p className="text-xs text-amber-400 leading-relaxed">
                                            ⚠️ 此資訊僅用於投票抽獎核對，請務必填寫正確資訊以確保獲獎權益。
                                        </p>
                                    </div>
                                    {error && <p className="text-rose-500 text-sm font-bold">{error}</p>}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 mt-auto bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl text-lg shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Vote size={20} /> 確認投票
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
