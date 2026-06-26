import React from 'react';
import { Coins, Power, PowerOff } from 'lucide-react';
import CollapsibleCard from './CollapsibleCard';

interface CoinSystemCardProps {
  enabled: boolean;
  onToggle: () => void;
}

const CoinSystemCard: React.FC<CoinSystemCardProps> = ({ enabled, onToggle }) => {
  return (
    <CollapsibleCard id="coin-system" title="Coin System" icon={<Coins size={14} />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Energy Harvest</span>
             <span className={`text-sm font-black font-mono uppercase ${enabled ? 'text-amber-400' : 'text-slate-600'}`}>
               {enabled ? 'Enabled' : 'Disabled'}
             </span>
          </div>
          <div className="flex gap-2 relative z-10">
            <button
                onClick={(e) => { e.stopPropagation(); !enabled && onToggle(); }}
                className={`px-3 py-1 text-[10px] font-bold rounded border transition-all ${
                    enabled
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
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
                    Classic extraction protocol active. Focus on reaching the exit node.
                </p>
            </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

export default CoinSystemCard;
