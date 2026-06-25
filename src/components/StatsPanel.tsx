import React from 'react';
import { Difficulty, BestTime } from '../game/types';
import { formatTime } from '../utils/helpers';
import { Timer, Footprints, Trophy } from 'lucide-react';

interface StatsPanelProps {
  time: number;
  moves: number;
  difficulty: Difficulty;
  bestTime?: BestTime;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ time, moves, difficulty, bestTime }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <StatCard
        label="Time Elapsed"
        value={formatTime(time)}
        icon={<Timer className="w-5 h-5 text-cyan-400" />}
        color="text-cyan-400"
        subValue="MM:SS"
      />
      <StatCard
        label="Total Moves"
        value={moves.toString()}
        icon={<Footprints className="w-5 h-5 text-purple-400" />}
        color="text-purple-400"
        subValue="Actions"
      />

      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 shadow-xl backdrop-blur-md relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase mb-4 tracking-[0.2em]">
          <Trophy className="w-3 h-3" />
          <span>Record ({difficulty})</span>
        </div>
        {bestTime ? (
          <div className="flex justify-between items-end relative z-10">
            <span className="text-2xl font-black font-mono text-cyan-100 tracking-tight">{formatTime(bestTime.time)}</span>
            <span className="text-[10px] font-mono text-slate-500 pb-1">{bestTime.moves} MV</span>
          </div>
        ) : (
          <span className="text-xs font-mono text-slate-600 italic text-center block py-2 border border-dashed border-slate-800 rounded-lg">
            No data logged
          </span>
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  subValue: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, subValue }) => (
  <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex flex-col gap-3 shadow-xl backdrop-blur-md relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 group-hover:border-cyan-500/30 transition-colors">
          {icon}
        </div>
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em]">{label}</span>
      </div>
      <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">{subValue}</span>
    </div>
    <span className={`text-3xl font-black font-mono tracking-tighter ${color}`}>{value}</span>
  </div>
);

export default StatsPanel;
