import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../config/navigation';
import { Menu, X, User, ChevronDown, Zap } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/' && location.pathname === '/');
  };

  const navItems = NAV_ITEMS.map((item) => {
    const active = isActive(item.path);
    
    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={() => setIsOpen(false)}
        className={`
          relative px-5 py-2.5 rounded-full text-sm font-medium
          transition-all duration-200 ease-out
          ${active 
            ? 'bg-white/20 text-white shadow-lg shadow-white/10 backdrop-blur-sm' 
            : 'text-white/80 hover:bg-white/10 hover:text-white hover:scale-105'
          }
          focus:outline-none focus:ring-2 focus:ring-white/30
        `}
      >
        {active && (
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse" />
        )}
        <span className="relative">{item.title}</span>
      </NavLink>
    );
  });

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-lg shadow-black/10 border border-white/10">
              <Zap className="w-6 h-6 text-yellow-300" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white tracking-tight leading-none">
                  SPFx Enterprise App
                </h1>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-1">
                {navItems}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
