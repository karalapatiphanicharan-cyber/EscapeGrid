import React from 'react';
import { Difficulty } from '../game/types';
import { formatTime } from '../utils/helpers';
import Button from './Button';
import { Trophy, ArrowRight, RefreshCw, Star } from 'lucide-react';

interface VictoryModalProps {
  time: number;
  moves: number;
  difficulty: Difficulty;
  score?: number;
  coinsCollected?: number;
  totalCoins?: number;
  coinsEnabled?: boolean;
  onRestart: () => void;
  onNewMaze: () => void;
}

const VictoryModal: React.FC<VictoryModalProps> = ({
  time,
  moves,
  difficulty,
  score,
  coinsCollected,
  totalCoins,
  coinsEnabled = true,
  onRestart,
  onNewMaze,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-500">
      <div className="w-full max-w-md p-10 rounded-[2.5rem] bg-slate-900 border-2 border-cyan-500/30 shadow-[0_0_80px_rgba(34,211,238,0.25)] relative overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Decor */}
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <Star className="w-32 h-32 text-cyan-400 rotate-12" />
        </div>

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="p-6 bg-slate-950 rounded-[2rem] mb-8 border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.15)] group">
            <Trophy className="w-16 h-16 text-cyan-400 group-hover:scale-110 transition-transform duration-500" />
          </div>

          <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">
            Simulation Cleared
          </h2>
          <p className="text-cyan-500/50 font-mono text-xs uppercase tracking-[0.4em] mb-10">
            System Authorization Approved
          </p>

          <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <div className="p-4 rounded-3xl bg-slate-800/30 border border-slate-700/50 group hover:border-cyan-500/30 transition-colors">
              <span className="block text-[8px] font-mono text-slate-500 uppercase mb-1 tracking-widest">Duration</span>
              <span className="text-2xl font-black font-mono text-cyan-400 tracking-tight">{formatTime(time)}</span>
            </div>
            <div className="p-4 rounded-3xl bg-slate-800/30 border border-slate-700/50 group hover:border-purple-500/30 transition-colors">
              <span className="block text-[8px] font-mono text-slate-500 uppercase mb-1 tracking-widest">Accuracy</span>
              <span className="text-2xl font-black font-mono text-purple-400 tracking-tight">{moves}</span>
            </div>
            {coinsEnabled && score !== undefined && (
              <div className="p-4 rounded-3xl bg-slate-800/30 border border-slate-700/50 group hover:border-amber-500/30 transition-colors col-span-2">
                <div className="flex justify-between items-center px-2">
                  <div className="text-left">
                    <span className="block text-[8px] font-mono text-slate-500 uppercase mb-1 tracking-widest">Credits</span>
                    <span className="text-3xl font-black font-mono text-amber-400 tracking-tight">{score.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] font-mono text-slate-500 uppercase mb-1 tracking-widest">Energy</span>
                    <span className="text-xl font-black font-mono text-slate-300 tracking-tight">{coinsCollected} / {totalCoins}</span>
                  </div>
                </div>
                {coinsCollected === totalCoins && totalCoins !== 0 && (
                   <div className="mt-2 text-[8px] font-mono text-amber-500 uppercase tracking-[0.3em] font-bold">
                     ● FULL_EXTRACTION_BONUS_APPLIED ●
                   </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 w-full">
            <Button onClick={onNewMaze} variant="primary" className="w-full py-5 text-xl rounded-2xl shadow-cyan-500/20">
              <ArrowRight className="w-6 h-6 mr-3" />
              Next Protocol
            </Button>
            <Button onClick={onRestart} variant="outline" className="w-full py-4 rounded-2xl border-slate-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Restart Node
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictoryModal;
