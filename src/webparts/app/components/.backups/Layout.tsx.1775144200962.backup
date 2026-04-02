import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { SidebarProvider, useSidebar } from '../contexts/SidebarContext';

const LayoutContent: React.FC = () => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-200 flex">
      <Sidebar />
      <main 
        className={`flex-1 md:transition-all md:duration-300 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto ${
          isCollapsed ? 'md:pl-20' : 'md:pl-72'
        }`}
      >
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export const Layout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};