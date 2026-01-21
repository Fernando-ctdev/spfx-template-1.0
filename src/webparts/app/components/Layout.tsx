import * as React from 'react';
import { Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
      <main className="w-full px-4 py-8">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
