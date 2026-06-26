import React from 'react';
import { Coins, Zap } from 'lucide-react';
import CollapsibleCard from './CollapsibleCard';

interface EnergyCacheCardProps {
  collected: number;
  total: number;
  score: number;
}

const EnergyCacheCard: React.FC<EnergyCacheCardProps> = ({ collected, total, score }) => {
  return (
    <CollapsibleCard id="energy-cache" title="Energy Cache" icon={<Coins size={14} />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Collection Progress</span>
             <span className="text-xl font-black font-mono text-amber-400">
               {collected} <span className="text-slate-600 text-xs font-bold">/ {total}</span>
             </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            <Coins size={20} className={collected === total ? "animate-bounce" : ""} />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/30">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
               <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Neural Credit</span>
               <span className="text-2xl font-black font-mono text-cyan-400 tracking-tighter">
                 {score.toLocaleString()}
               </span>
            </div>
            <Zap size={16} className="text-cyan-500/50" />
          </div>

          <div className="mt-4 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000 ease-out"
              style={{ width: `${(collected / (total || 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default EnergyCacheCard;
