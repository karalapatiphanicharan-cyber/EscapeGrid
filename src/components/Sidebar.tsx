import React from 'react';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  children: React.ReactNode;
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ children, isCollapsed, onToggle }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => onToggle(true)}
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl border-r border-cyan-500/20 transition-all duration-300 ease-in-out lg:relative lg:bg-slate-950/30 lg:backdrop-blur-sm lg:border-cyan-500/10 lg:z-30 lg:h-full',
          isCollapsed
            ? '-translate-x-full lg:translate-x-0 lg:w-16'
            : 'w-[85%] sm:w-80 translate-x-0 lg:w-80'
        )}
      >
        {/* Mobile Header in Sidebar */}
        <div className="flex items-center justify-between p-6 lg:hidden border-b border-cyan-500/10">
          <span className="text-cyan-400 font-bold tracking-tighter uppercase text-sm">Operations Panel</span>
          <button onClick={() => onToggle(true)} className="text-slate-400 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        {/* Desktop Toggle Handle */}
        <button
          onClick={() => onToggle(!isCollapsed)}
          className="absolute -right-3 top-24 w-6 h-6 bg-slate-900 border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 transition-colors z-40 hidden lg:flex"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className={clsx(
          'flex-1 flex flex-col gap-6 p-6 overflow-y-auto overflow-x-hidden transition-opacity duration-300',
          isCollapsed ? 'lg:opacity-0 lg:pointer-events-none' : 'opacity-100'
        )}>
          {children}
        </div>

        {/* Desktop Collapsed View Icons */}
        {isCollapsed && (
          <div className="absolute inset-0 flex flex-col items-center py-8 gap-8 text-cyan-500/40 lg:flex hidden pointer-events-none">
             <Menu size={20} className="mt-16" />
             <div className="w-px h-full bg-gradient-to-b from-cyan-500/20 via-transparent to-transparent" />
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
