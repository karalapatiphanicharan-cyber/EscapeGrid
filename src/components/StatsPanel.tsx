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
    <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
      <StatCard
        label="Time Elapsed"
        value={formatTime(time)}
        icon={<Timer className="w-4 h-4" />}
        color="text-cyan-400"
      />
      <StatCard
        label="Total Moves"
        value={moves.toString()}
        icon={<Footprints className="w-4 h-4" />}
        color="text-purple-400"
      />
      <div className="col-span-2 lg:col-span-1 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase mb-3">
          <Trophy className="w-3 h-3" />
          <span>Personal Best ({difficulty})</span>
        </div>
        {bestTime ? (
          <div className="flex justify-between items-end">
            <span className="text-xl font-bold font-mono text-cyan-100">{formatTime(bestTime.time)}</span>
            <span className="text-[10px] font-mono text-slate-500">{bestTime.moves} moves</span>
          </div>
        ) : (
          <span className="text-xs font-mono text-slate-600 italic text-center block py-1">
            No records found
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
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => (
  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1">
    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase">
      {icon}
      <span>{label}</span>
    </div>
    <span className={`text-2xl font-bold font-mono ${color}`}>{value}</span>
  </div>
);

export default StatsPanel;
