import React from 'react';
import { Terminal } from 'lucide-react';

const GameHeader: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-6 border-b border-cyan-500/20 bg-slate-950/50 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
          <Terminal className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            ESCAPE GRID
          </h1>
          <p className="text-xs font-mono text-cyan-500/60 uppercase tracking-[0.2em]">Neural Link Established</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-6 font-mono text-[10px] text-cyan-500/40">
        <div className="flex flex-col items-end">
          <span>SYSTEM_STATUS</span>
          <span className="text-green-500">OPTIMAL</span>
        </div>
        <div className="flex flex-col items-end">
          <span>ENCRYPTION</span>
          <span className="text-cyan-500">AES-256</span>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
