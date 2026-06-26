import React from 'react';
import { clsx } from 'clsx';
import { Difficulty } from '../game/types';
import { DIFFICULTIES } from '../game/constants';
import Button from './Button';
import { RefreshCw, Play, Settings2, HelpCircle } from 'lucide-react';
import CollapsibleCard from './CollapsibleCard';

interface ControlPanelProps {
  currentDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onRestart: () => void;
  onNewMaze: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  currentDifficulty,
  onDifficultyChange,
  onRestart,
  onNewMaze,
}) => {
  return (
    <div className="space-y-4">
      <CollapsibleCard id="difficulty" title="System Difficulty" icon={<Settings2 size={14} />}>
        <div className="grid grid-cols-1 gap-3">
          {(Object.keys(DIFFICULTIES) as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => onDifficultyChange(diff)}
              className={clsx(
                'h-14 w-full rounded-xl text-sm font-black font-mono border transition-all duration-300 uppercase tracking-widest',
                currentDifficulty === diff
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-cyan-500/40 hover:text-cyan-500/60'
              )}
            >
              {DIFFICULTIES[diff].label}
            </button>
          ))}
        </div>
      </CollapsibleCard>

      <div className="flex flex-col gap-3">
        <Button onClick={onNewMaze} variant="primary" className="w-full h-14">
          <Play className="w-5 h-5 mr-3" />
          Initialize Grid
        </Button>
        <Button onClick={onRestart} variant="outline" className="w-full h-12 border-slate-800 text-slate-400 hover:text-cyan-400">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reroute Path
        </Button>
      </div>

      <CollapsibleCard id="controls" title="Link Controls" icon={<HelpCircle size={14} />} defaultExpanded={false}>
        <ul className="text-[10px] font-mono text-slate-400 space-y-3 p-2">
          <li className="flex items-center gap-3">
            <span className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-cyan-500">WASD</span>
            <span className="text-slate-500 uppercase tracking-tight">Movement</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-cyan-500">ARROWS</span>
            <span className="text-slate-500 uppercase tracking-tight">Movement</span>
          </li>
          <li className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
             <span className="text-slate-500 uppercase tracking-tight italic">Extraction Point</span>
          </li>
        </ul>
      </CollapsibleCard>
    </div>
  );
};

export default ControlPanel;
