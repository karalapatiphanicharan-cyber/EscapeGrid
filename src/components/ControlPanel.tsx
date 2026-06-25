import React from 'react';
import { Difficulty } from '../game/types';
import { DIFFICULTIES } from '../game/constants';
import Button from './Button';
import { RefreshCw, Play, Settings2 } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-500/60 uppercase tracking-wider">
          <Settings2 className="w-3 h-3" />
          <span>Difficulty Level</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(DIFFICULTIES) as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => onDifficultyChange(diff)}
              className={`
                px-3 py-2 rounded text-xs font-mono border transition-all duration-300
                ${
                  currentDifficulty === diff
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                    : 'bg-slate-900/40 border-slate-700 text-slate-500 hover:border-cyan-500/50 hover:text-cyan-500/70'
                }
              `}
            >
              {DIFFICULTIES[diff].label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button onClick={onNewMaze} variant="primary" className="w-full">
          <Play className="w-4 h-4 mr-2" />
          Generate New
        </Button>
        <Button onClick={onRestart} variant="secondary" className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Restart Level
        </Button>
      </div>

      <div className="p-4 rounded-lg bg-cyan-950/20 border border-cyan-500/10">
        <h3 className="text-[10px] font-mono text-cyan-500/40 uppercase mb-2">Controls</h3>
        <ul className="text-[10px] font-mono text-slate-400 space-y-1">
          <li>• ARROW KEYS or WASD to move</li>
          <li>• Reach the purple exit point</li>
        </ul>
      </div>
    </div>
  );
};

export default ControlPanel;
