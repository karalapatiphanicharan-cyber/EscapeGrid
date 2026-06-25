import React from 'react';
import { Difficulty, EnemyType } from '../game/types';
import { formatTime } from '../utils/helpers';
import Button from './Button';
import { Skull, RefreshCw, PlusCircle, AlertTriangle } from 'lucide-react';

interface GameOverModalProps {
  time: number;
  moves: number;
  difficulty: Difficulty;
  capturedBy?: EnemyType;
  onRestart: () => void;
  onNewMaze: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  time,
  moves,
  difficulty,
  capturedBy,
  onRestart,
  onNewMaze,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-500">
      <div className="w-full max-w-md p-10 rounded-[2.5rem] bg-slate-900 border-2 border-red-500/30 shadow-[0_0_80px_rgba(239,68,68,0.25)] relative overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Decor */}
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <Skull className="w-32 h-32 text-red-500 rotate-12" />
        </div>

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="p-6 bg-slate-950 rounded-[2rem] mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)] group">
            <AlertTriangle className="w-16 h-16 text-red-500 group-hover:scale-110 transition-transform duration-500" />
          </div>

          <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">
            Mission Failed
          </h2>
          <p className="text-red-500/50 font-mono text-xs uppercase tracking-[0.2em] mb-10">
            Security System Intercepted Your Escape
          </p>

          {capturedBy && (
              <div className="mb-8 px-6 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">
                    Eliminated by {capturedBy} drone
                  </span>
              </div>
          )}

          <div className="grid grid-cols-2 gap-6 w-full mb-12">
            <div className="p-6 rounded-3xl bg-slate-800/30 border border-slate-700/50">
              <span className="block text-[10px] font-mono text-slate-500 uppercase mb-2 tracking-widest">Uptime</span>
              <span className="text-3xl font-black font-mono text-red-400 tracking-tight">{formatTime(time)}</span>
            </div>
            <div className="p-6 rounded-3xl bg-slate-800/30 border border-slate-700/50">
              <span className="block text-[10px] font-mono text-slate-500 uppercase mb-2 tracking-widest">Actions</span>
              <span className="text-3xl font-black font-mono text-slate-300 tracking-tight">{moves}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <Button onClick={onRestart} variant="secondary" className="w-full py-5 text-xl rounded-2xl bg-red-600 hover:bg-red-500 border-red-400 shadow-red-500/20">
              <RefreshCw className="w-6 h-6 mr-3" />
              Retry Mission
            </Button>
            <Button onClick={onNewMaze} variant="outline" className="w-full py-4 rounded-2xl border-slate-700 text-slate-400 hover:text-white">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Simulation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
