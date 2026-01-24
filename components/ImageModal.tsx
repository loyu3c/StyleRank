import React from 'react';
import { Participant } from '../types';
import { X, Vote, Trophy, User } from 'lucide-react';

interface ImageModalProps {
    participant: Participant | null;
    onClose: () => void;
    onVote?: (id: string) => void;
    hasVoted?: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({ participant, onClose, onVote, hasVoted }) => {
    if (!participant) return null;

    const handleVoteClick = () => {
        if (onVote) {
            if (window.confirm(`確定要投給 NO.${participant.entryNumber} ${participant.name} 嗎？\n\n⚠️ 注意：每人僅限投一票，送出後無法修改！`)) {
                onVote(participant.id);
                onClose(); // 投票後關閉視窗，也可選擇不關閉
            }
        }
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

                {/* Close Button (Mobile: Top Right, Desktop: Outside or Top Right) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Image Section */}
                <div className="w-full md:w-3/5 bg-black flex items-center justify-center bg-slate-900/50">
                    <img
                        src={participant.photoUrl}
                        alt={participant.name}
                        className="max-h-[50vh] md:max-h-[80vh] w-auto object-contain"
                    />
                </div>

                {/* Info Section */}
                <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between bg-[#0a0f1a]">
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

                            <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-800 space-y-2">
                                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                    <User size={16} /> 目前票數
                                </div>
                                <p className="text-2xl font-bold text-white">
                                    {participant.votes} <span className="text-sm text-slate-500 font-normal">票</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800">
                        {onVote ? (
                            <button
                                onClick={handleVoteClick}
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
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
