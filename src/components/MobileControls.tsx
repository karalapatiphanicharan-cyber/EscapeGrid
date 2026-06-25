import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface MobileControlsProps {
  onMove: (direction: string) => void;
}

const MobileControls: React.FC<MobileControlsProps> = ({ onMove }) => {
  return (
    <div className="lg:hidden grid grid-cols-3 gap-2 w-48 mx-auto mt-8">
      <div />
      <ControlButton icon={<ChevronUp />} onClick={() => onMove('w')} />
      <div />
      <ControlButton icon={<ChevronLeft />} onClick={() => onMove('a')} />
      <ControlButton icon={<ChevronDown />} onClick={() => onMove('s')} />
      <ControlButton icon={<ChevronRight />} onClick={() => onMove('d')} />
    </div>
  );
};

interface ControlButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
}

const ControlButton: React.FC<ControlButtonProps> = ({ icon, onClick }) => (
  <button
    onClick={onClick}
    className="w-14 h-14 flex items-center justify-center bg-slate-800 border border-cyan-500/30 rounded-xl text-cyan-400 active:bg-cyan-500/20 active:scale-95 transition-all shadow-[0_0_10px_rgba(34,211,238,0.1)]"
  >
    {icon}
  </button>
);

export default MobileControls;
