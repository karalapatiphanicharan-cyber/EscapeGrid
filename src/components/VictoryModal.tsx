import React from 'react';
import { Difficulty } from '../game/types';
import { formatTime } from '../utils/helpers';
import Button from './Button';
import { Trophy, ArrowRight, RefreshCw } from 'lucide-react';

interface VictoryModalProps {
  time: number;
  moves: number;
  difficulty: Difficulty;
  onRestart: () => void;
  onNewMaze: () => void;
}

const VictoryModal: React.FC<VictoryModalProps> = ({
  time,
  moves,
  difficulty,
  onRestart,
  onNewMaze,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.2)] animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="p-4 bg-cyan-500/20 rounded-full mb-6 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <Trophy className="w-12 h-12 text-cyan-400" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">GRID ESCAPED</h2>
          <p className="text-cyan-500/60 font-mono text-xs uppercase tracking-[0.2em] mb-8">
            Node Clearance Verified
          </p>

          <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <span className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Time</span>
              <span className="text-2xl font-bold font-mono text-cyan-400">{formatTime(time)}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <span className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Moves</span>
              <span className="text-2xl font-bold font-mono text-purple-400">{moves}</span>
            </div>
          </div>

          <div className="space-y-3 w-full">
            <Button onClick={onNewMaze} variant="primary" className="w-full py-4 text-lg">
              <ArrowRight className="w-5 h-5 mr-2" />
              Next Simulation
            </Button>
            <Button onClick={onRestart} variant="secondary" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Grid
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictoryModal;
