import React from 'react';
import { Enemy, EnemyType } from '../game/types';
import { Activity, Shield, Radar, Power, PowerOff } from 'lucide-react';
import CollapsibleCard from './CollapsibleCard';

interface EnemyStatusCardProps {
  enemies: Enemy[];
  enabled: boolean;
  onToggle: () => void;
}

const EnemyStatusCard: React.FC<EnemyStatusCardProps> = ({ enemies, enabled, onToggle }) => {
  return (
    <CollapsibleCard id="enemy-system" title="Security Drones" icon={<Radar size={14} />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Defense Grid</span>
             <span className={`text-sm font-black font-mono uppercase ${enabled ? 'text-green-400' : 'text-slate-600'}`}>
               {enabled ? 'Active' : 'Offline'}
             </span>
          </div>
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg border transition-all duration-300 ${
              enabled
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-slate-900 border-slate-800 text-slate-600'
            }`}
          >
            {enabled ? <Power size={14} /> : <PowerOff size={14} />}
          </button>
        </div>

        {enabled && enemies.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-800/30">
            {enemies.map((enemy, idx) => (
              <div key={enemy.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: enemy.color }} />
                    <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest">
                      {enemy.type} Unit-{idx + 1}
                    </span>
                  </div>
                  <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                      enemy.state === 'pursuing' ? 'text-red-400 border-red-500/30 bg-red-500/5' :
                      enemy.state === 'tracking' ? 'text-orange-400 border-orange-500/30 bg-orange-500/5' :
                      'text-cyan-400 border-cyan-500/30 bg-cyan-500/5'
                  }`}>
                    {enemy.state}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-950/50 p-1.5 rounded border border-slate-800/50 flex flex-col">
                        <span className="text-[6px] text-slate-600 uppercase">Movement</span>
                        <span className="text-[8px] text-slate-400 font-mono uppercase">{enemy.mode}</span>
                    </div>
                    <div className="bg-slate-950/50 p-1.5 rounded border border-slate-800/50 flex flex-col">
                        <span className="text-[6px] text-slate-600 uppercase">Velocity</span>
                        <span className="text-[8px] text-slate-400 font-mono uppercase">
                            {enemy.speed < 500 ? 'High' : enemy.speed < 700 ? 'Med' : 'Low'}
                        </span>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {enabled && enemies.length === 0 && (
            <div className="py-4 text-center border border-dashed border-slate-800 rounded-xl">
                <span className="text-[8px] font-mono text-slate-600 uppercase italic">Calibrating...</span>
            </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

export default EnemyStatusCard;
