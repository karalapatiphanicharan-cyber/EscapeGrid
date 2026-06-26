import React from 'react';
import { Cloud, AlertTriangle } from 'lucide-react';
import CollapsibleCard from './CollapsibleCard';

interface FogOfWarCardProps {
  enabled: boolean;
  onToggle: () => void;
  difficulty: string;
}

const FogOfWarCard: React.FC<FogOfWarCardProps> = ({ enabled, onToggle, difficulty }) => {
  const isHard = difficulty === 'hard';

  return (
    <CollapsibleCard id="fog-of-war" title="Fog of War" icon={<Cloud size={14} />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Visual Obstruction</span>
             <span className={`text-sm font-black font-mono uppercase ${enabled && !isHard ? 'text-purple-400' : 'text-slate-600'}`}>
               {isHard ? 'Disabled' : (enabled ? 'Enabled' : 'Disabled')}
             </span>
          </div>
          <div className="flex gap-2 relative z-10">
            <button
                disabled={isHard}
                onClick={(e) => { e.stopPropagation(); !enabled && onToggle(); }}
                className={`px-3 py-1 text-[10px] font-bold rounded border transition-all ${
                    enabled && !isHard
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-600 hover:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed'
                }`}
            >
                ON
            </button>
            <button
                disabled={isHard}
                onClick={(e) => { e.stopPropagation(); enabled && onToggle(); }}
                className={`px-3 py-1 text-[10px] font-bold rounded border transition-all ${
                    !enabled || isHard
                    ? 'bg-slate-700 border-slate-600 text-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-600 hover:text-slate-400'
                }`}
            >
                OFF
            </button>
          </div>
        </div>

        {isHard ? (
            <div className="pt-4 border-t border-slate-800/30 flex gap-2 items-start">
                <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 italic leading-relaxed">
                    Fog of War is available only in Easy and Medium modes. Hard protocol exceeds sensory limits.
                </p>
            </div>
        ) : !enabled && (
            <div className="pt-4 border-t border-slate-800/30">
                <p className="text-[10px] text-slate-500 italic leading-relaxed">
                    Full visibility authorized. Local mapping active.
                </p>
            </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

export default FogOfWarCard;
