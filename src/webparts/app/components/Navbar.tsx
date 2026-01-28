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
              
              <div className="h-8 w-px bg-white/20" />
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    <User size={18} />
                    <span className="text-sm font-medium">Perfil</span>
                    <ChevronDown 
                      size={14} 
                      className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  
                  {isUserMenuOpen && (
                    <>
                      <div
                        onClick={() => setIsUserMenuOpen(false)}
                        className="fixed inset-0 z-40"
                        aria-hidden="true"
                      />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl shadow-black/20 border border-gray-200 overflow-hidden z-50 animate-fade-in">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">Bem-vindo</p>
                          <p className="text-xs text-gray-500">usuario@exemplo.com</p>
                        </div>
                        <div className="py-1">
                          <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            Meu Perfil
                          </button>
                          <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            Configurações
                          </button>
                          <div className="h-px bg-gray-100 my-1" />
                          <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors">
                            Sair
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-gradient-to-b from-blue-600 to-purple-600 border-t border-white/10 shadow-2xl shadow-black/20 z-40 animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`
                      block px-4 py-3 rounded-lg text-base font-medium
                      transition-all duration-200 ease-out
                      ${active 
                        ? 'bg-white/20 text-white shadow-lg shadow-white/10 backdrop-blur-sm' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1'
                      }
                      focus:outline-none focus:ring-2 focus:ring-white/30
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.title}</span>
                      {active && <ChevronDown size={16} className="opacity-70" />}
                    </div>
                  </NavLink>
                );
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10">
                <User size={20} className="text-white/70" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Bem-vindo</p>
                  <p className="text-xs text-blue-100/70">usuario@exemplo.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
