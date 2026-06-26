import React from 'react';
import { Bot, Lightbulb, Map, Power, PowerOff } from 'lucide-react';
import CollapsibleCard from './CollapsibleCard';

interface AIAssistCardProps {
  enabled: boolean;
  onToggle: () => void;
  onRequestHint: () => void;
  onRequestFullPath: () => void;
  isGameActive: boolean;
  hasActivePath: boolean;
}

const AIAssistCard: React.FC<AIAssistCardProps> = ({
  enabled,
  onToggle,
  onRequestHint,
  onRequestFullPath,
  isGameActive,
  hasActivePath
}) => {
  return (
    <CollapsibleCard id="ai-assist" title="AI Assist" icon={<Bot size={14} />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Neural Guidance</span>
             <span className={`text-sm font-black font-mono uppercase ${enabled ? 'text-green-400' : 'text-slate-600'}`}>
               {enabled ? 'Active' : 'Offline'}
             </span>
          </div>
          <div className="flex gap-2 relative z-10">
            <button
                onClick={(e) => { e.stopPropagation(); !enabled && onToggle(); }}
                className={`px-3 py-1 text-[10px] font-bold rounded border transition-all ${
                    enabled
                    ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
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

        {enabled ? (
            <div className="grid grid-cols-1 gap-2 pt-4 border-t border-slate-800/30">
                <button
                    disabled={!isGameActive || hasActivePath}
                    onClick={onRequestHint}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                    <Lightbulb size={14} className="group-hover:animate-pulse" />
                    SHOW HINT
                </button>
                <button
                    disabled={!isGameActive || hasActivePath}
                    onClick={onRequestFullPath}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-400 hover:text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                    <Map size={14} className="group-hover:animate-pulse" />
                    SHOW FULL PATH
                </button>
            </div>
        ) : (
            <div className="pt-4 border-t border-slate-800/30">
                <p className="text-[10px] text-slate-500 italic leading-relaxed">
                    Guidance protocols suspended. Navigate the grid using local sensors.
                </p>
            </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

export default AIAssistCard;
