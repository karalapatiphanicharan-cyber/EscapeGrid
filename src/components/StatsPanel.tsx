import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Difficulty, BestTime } from '../game/types';
import { formatTime } from '../utils/helpers';
import { Timer, Footprints, Trophy, Eye, EyeOff, Pause, Play } from 'lucide-react';
import CollapsibleCard from './CollapsibleCard';

interface StatsPanelProps {
  time: number;
  moves: number;
  difficulty: Difficulty;
  bestTime?: BestTime;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ time, moves, difficulty, bestTime }) => {
  const [showTimer, setShowTimer] = useState(() => {
    const saved = localStorage.getItem('stats_show_timer');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [pauseTimerUpdate, setPauseTimerUpdate] = useState(() => {
    const saved = localStorage.getItem('stats_pause_timer');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [displayTime, setDisplayTime] = useState(time);

  useEffect(() => {
    localStorage.setItem('stats_show_timer', JSON.stringify(showTimer));
  }, [showTimer]);

  useEffect(() => {
    localStorage.setItem('stats_pause_timer', JSON.stringify(pauseTimerUpdate));
  }, [pauseTimerUpdate]);

  useEffect(() => {
    if (!pauseTimerUpdate) {
      setDisplayTime(time);
    }
  }, [time, pauseTimerUpdate]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <CollapsibleCard id="timer" title="Time Elapsed" icon={<Timer size={14} />}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
             <span className={clsx(
               "text-3xl font-black font-mono tracking-tighter transition-all duration-300",
               !showTimer ? "blur-md opacity-20" : "text-cyan-400"
             )}>
               {formatTime(displayTime)}
             </span>
             <div className="flex gap-2">
               <button
                 onClick={() => setShowTimer(!showTimer)}
                 className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-500 hover:text-cyan-400 transition-colors"
                 title={showTimer ? "Hide Timer" : "Show Timer"}
               >
                 {showTimer ? <EyeOff size={14} /> : <Eye size={14} />}
               </button>
               <button
                 onClick={() => setPauseTimerUpdate(!pauseTimerUpdate)}
                 className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-500 hover:text-cyan-400 transition-colors"
                 title={pauseTimerUpdate ? "Resume Display" : "Pause Display"}
               >
                 {pauseTimerUpdate ? <Play size={14} /> : <Pause size={14} />}
               </button>
             </div>
          </div>
          <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Neural Sync: Active</span>
        </div>
      </CollapsibleCard>

      <CollapsibleCard id="moves" title="Total Moves" icon={<Footprints size={14} />}>
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-black font-mono tracking-tighter text-purple-400">{moves}</span>
          <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Recorded Actions</span>
        </div>
      </CollapsibleCard>

      <CollapsibleCard id="record" title={`Record (${difficulty})`} icon={<Trophy size={14} />}>
        {bestTime ? (
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Fastest Time</span>
                <span className="text-2xl font-black font-mono text-cyan-100 tracking-tight">{formatTime(bestTime.time)}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Efficiency</span>
                <span className="text-lg font-bold font-mono text-slate-400">{bestTime.moves} MV</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/30">
               <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">
                 Last Sync: {new Date(bestTime.date).toLocaleDateString()}
               </span>
            </div>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center gap-2 border border-dashed border-slate-800 rounded-2xl opacity-50">
            <Trophy size={20} className="text-slate-700" />
            <span className="text-[10px] font-mono text-slate-600 italic">No Data Logged</span>
          </div>
        )}
      </CollapsibleCard>
    </div>
  );
};

export default StatsPanel;
