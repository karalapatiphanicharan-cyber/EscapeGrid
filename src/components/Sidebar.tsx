import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    if (saved !== null) return JSON.parse(saved);
    return window.innerWidth < 1024;
  });

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  return (
    <aside
      className={clsx(
        'relative h-full flex flex-col border-r border-cyan-500/10 bg-slate-950/30 backdrop-blur-sm transition-all duration-300 ease-in-out z-30',
        isCollapsed ? 'w-16' : 'w-full lg:w-80'
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-900 border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 transition-colors z-40 hidden lg:flex"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={clsx(
        'flex-1 flex flex-col gap-6 p-6 overflow-y-auto overflow-x-hidden transition-opacity duration-300',
        isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}>
        {children}
      </div>

      {isCollapsed && (
        <div className="absolute inset-0 flex flex-col items-center py-8 gap-8 text-cyan-500/40 lg:flex hidden">
           <Menu size={20} className="cursor-pointer hover:text-cyan-400" onClick={() => setIsCollapsed(false)} />
           <div className="w-px h-full bg-gradient-to-b from-cyan-500/20 via-transparent to-transparent" />
        </div>
      )}

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden absolute left-4 -top-12 p-2 text-cyan-400 z-50"
      >
        <Menu size={24} />
      </button>
    </aside>
  );
};

export default Sidebar;
