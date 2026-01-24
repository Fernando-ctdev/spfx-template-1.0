module.exports = `
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white transition-colors duration-200 flex">
      <aside className="w-64 flex-shrink-0 hidden md:block h-screen sticky top-0">
        <Sidebar />
      </aside>
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
`;
