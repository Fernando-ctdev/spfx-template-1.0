module.exports = `
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { SidebarProvider } from '../contexts/SidebarContext';

export const Layout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 transition-colors duration-200 flex">
        <aside className="fixed md:sticky top-0 left-0 h-screen z-40 hidden md:block">
          <Sidebar />
        </aside>
        <main className="flex-1 md:ml-64 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
`;
