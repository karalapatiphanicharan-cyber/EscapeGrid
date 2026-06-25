import React from 'react';

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  return (
    <aside className="w-full lg:w-80 flex flex-col gap-6 p-6 border-r border-cyan-500/10 bg-slate-950/30 backdrop-blur-sm overflow-y-auto">
      {children}
    </aside>
  );
};

export default Sidebar;
