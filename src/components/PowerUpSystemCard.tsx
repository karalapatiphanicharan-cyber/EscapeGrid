import React from 'react';
import { Zap, Power, PowerOff } from 'lucide-react';
import CollapsibleCard from './CollapsibleCard';

interface PowerUpSystemCardProps {
  enabled: boolean;
  onToggle: () => void;
}

const PowerUpSystemCard: React.FC<PowerUpSystemCardProps> = ({ enabled, onToggle }) => {
  return (
    <CollapsibleCard id="power-up-system" title="Power-Up System" icon={<Zap size={14} />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Combat Support</span>
             <span className={`text-sm font-black font-mono uppercase ${enabled ? 'text-cyan-400' : 'text-slate-600'}`}>
               {enabled ? 'Enabled' : 'Disabled'}
             </span>
          </div>
          <div className="flex gap-2 relative z-10">
            <button
                onClick={(e) => { e.stopPropagation(); !enabled && onToggle(); }}
                className={`px-3 py-1 text-[10px] font-bold rounded border transition-all ${
                    enabled
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-600 hover:text-slate-400'
                }`}
            >
                ON
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); enabled && onToggle(); }}
                className={`px-3 py-1 text-[10px] font-bold rounded border transition-all ${
                    !enabled
                    ? 'bg-slate-700 border-slate-600 text-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-600 hover:text-slate-400'
                }`}
            >
                OFF
            </button>
          </div>
        </div>

        {!enabled && (
            <div className="pt-4 border-t border-slate-800/30">
                <p className="text-[10px] text-slate-500 italic leading-relaxed">
                    Standard operational parameters only. Raw skill required.
                </p>
            </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

export default PowerUpSystemCard;
