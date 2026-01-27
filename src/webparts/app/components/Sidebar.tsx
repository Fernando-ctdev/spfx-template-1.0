import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../config/navigation';
import { ChevronRight, Menu, X, Zap, ChevronsLeft } from 'lucide-react';
import { AppButton } from '../../../core/ui';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const onLinkClick = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isSelected = (path: string) => {
    const currentPath = location.pathname === '/' ? 'home' : location.pathname.replace('/', '');
    const itemPath = path === '/' ? 'home' : path.replace('/', '');
    return currentPath === itemPath;
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const navItems = NAV_ITEMS.map((item) => {
    const Icon = item.icon;
    const selected = isSelected(item.path);
    
    return (
      <div key={item.path} className="relative">
        {selected && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-40 -z-10" />
        )}
        
        <AppButton
          variant={selected ? 'primary' : 'default'}
          onClick={() => onLinkClick(item.path)}
          fullWidth
          style={{
            height: '48px',
            justifyContent: 'flex-start',
            gap: '12px',
            background: selected 
              ? 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))' 
              : 'transparent',
            color: selected ? 'white' : 'rgb(55, 65, 81)',
            boxShadow: selected ? '0 10px 15px -3px rgba(37, 99, 235, 0.3)' : 'none',
            transition: 'all 0.3s ease-out',
          }}
          className={`
            ${!selected ? 'hover:bg-gray-100' : ''}
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <div className={`
            flex items-center gap-3 w-full
            ${isCollapsed ? 'justify-center' : ''}
          `}>
            {Icon ? (
              <div className={`
                flex items-center justify-center w-9 h-9 rounded-lg
                transition-all duration-300
                ${selected 
                  ? 'bg-white/20 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                <Icon size={18} strokeWidth={2.5} />
              </div>
            ) : null}
            
            {!isCollapsed && (
              <>
                <span className="font-semibold text-sm tracking-wide flex-1 text-left">
                  {item.title}
                </span>
                
                {selected && (
                  <ChevronRight size={16} />
                )}
              </>
            )}
          </div>
        </AppButton>
      </div>
    );
  });

  return (
    <>
      <AppButton
        onClick={toggleMobile}
        variant="primary"
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 50,
          padding: '12px',
          borderRadius: '12px',
          background: 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))',
          color: 'white',
          boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.3)',
          transition: 'all 0.3s',
          display: 'none',
        }}
        className="md:hidden"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </AppButton>

      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen z-40
          bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-72'}
        `}
      >
        <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white">
          {/* Header */}
          <div className="h-20 flex items-center justify-between px-5 border-b border-gray-200 bg-white sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 cursor-pointer">
                <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              
              <div className={`
                flex flex-col min-w-0 transition-all duration-300
                ${isCollapsed ? 'md:opacity-0 md:overflow-hidden md:w-0' : ''}
              `}>
                <span className="text-base font-bold text-gray-900 tracking-tight leading-tight truncate">
                  SPFx Enterprise
                </span>
                <span className="text-xs tracking-wide font-medium text-gray-500 truncate">
                  Template v1.0.0
                </span>
              </div>
            </div>
            
            <AppButton
              onClick={toggleCollapse}
              variant="default"
              style={{
                width: '36px',
                height: '36px',
                minWidth: '36px',
                padding: '0',
                display: 'none',
                borderRadius: '8px',
                background: 'rgb(243, 244, 246)',
                color: 'rgb(75, 85, 99)',
                transition: 'all 0.3s',
                transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
              className="md:flex items-center justify-center"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronsLeft size={16} />
            </AppButton>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <nav className="space-y-2">
              {navItems}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-200 bg-white">
            <div className={`
              flex items-center gap-3 transition-all duration-300
              ${isCollapsed ? 'md:justify-center' : ''}
            `}>
              <div className="relative flex items-center justify-center w-2.5 h-2.5">
                <div className="absolute w-full h-full rounded-full bg-green-400 animate-ping opacity-75" />
                <div className="relative w-full h-full rounded-full bg-green-500 shadow-lg shadow-green-400/60" />
              </div>
              
              <span className={`
                text-sm font-semibold text-gray-700 tracking-wide
                transition-all duration-300
                ${isCollapsed ? 'md:opacity-0 md:w-0 md:overflow-hidden' : ''}
              `}>
                Sistema Online
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 animate-in fade-in duration-300"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;