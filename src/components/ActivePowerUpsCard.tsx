import React from 'react';
import { Shield, Snowflake, Zap, Activity } from 'lucide-react';
import { ActivePowerUp } from '../game/types';
import { POWER_UP_CONFIG } from '../game/constants';
import CollapsibleCard from './CollapsibleCard';

interface ActivePowerUpsCardProps {
  activePowerUps: ActivePowerUp[];
}

const ActivePowerUpsCard: React.FC<ActivePowerUpsCardProps> = ({ activePowerUps }) => {
  const renderIcon = (type: string) => {
    switch (type) {
      case 'shield': return <Shield size={16} className="text-blue-500" />;
      case 'freeze': return <Snowflake size={16} className="text-cyan-500" />;
      case 'speed': return <Zap size={16} className="text-yellow-400" />;
      default: return null;
    }
  };

  return (
    <CollapsibleCard id="active-power-ups" title="Active Power-Ups" icon={<Activity size={14} />}>
      <div className="space-y-4">
        {activePowerUps.length > 0 ? (
          activePowerUps.map((ap) => {
            const config = POWER_UP_CONFIG[ap.type];
            const remaining = ap.endTime === Infinity ? null : Math.max(0, (ap.endTime - Date.now()) / 1000);

            return (
              <div key={ap.type} className="flex items-center justify-between p-2 rounded bg-slate-950/50 border border-slate-800/50">
                <div className="flex items-center gap-3">
                  {renderIcon(ap.type)}
                  <span className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">{config.label}</span>
                </div>
                {remaining !== null && (
                  <span className="text-xs font-black font-mono text-cyan-400">{remaining.toFixed(1)}S</span>
                )}
                {remaining === null && (
                  <span className="text-[10px] font-black font-mono text-blue-400 uppercase tracking-tighter">READY</span>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-4 flex flex-col items-center gap-2 border border-dashed border-slate-800 rounded-xl opacity-40">
            <span className="text-[10px] font-mono text-slate-500 italic">No Active Protocols</span>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

export default ActivePowerUpsCard;
