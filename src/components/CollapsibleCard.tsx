import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';

interface CollapsibleCardProps {
  title: string;
  id: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  title,
  id,
  children,
  icon,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem(`card_expanded_${id}`);
    if (saved !== null) return JSON.parse(saved);
    return defaultExpanded;
  });

  useEffect(() => {
    localStorage.setItem(`card_expanded_${id}`, JSON.stringify(isExpanded));
  }, [isExpanded, id]);

  return (
    <div id={id} className="w-full rounded-2xl bg-slate-900/40 border border-slate-800/60 shadow-xl backdrop-blur-md overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-cyan-400 group-hover:scale-110 transition-transform">{icon}</div>}
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em]">{title}</span>
        </div>
        <div className="text-slate-600 group-hover:text-cyan-400 transition-colors">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      <div
        className={clsx(
          'transition-all duration-300 ease-in-out overflow-hidden',
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-4 pt-0 border-t border-slate-800/30 mt-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleCard;
