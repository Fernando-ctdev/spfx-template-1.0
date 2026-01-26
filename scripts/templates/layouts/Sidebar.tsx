module.exports = `
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../config/navigation';
import { Home, ChevronRight, Menu, X } from 'lucide-react';

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
      <button
        key={item.path}
        onClick={() => onLinkClick(item.path)}
        className={\`
          w-full flex items-center gap-3 px-4 py-3 rounded-lg
          transition-all duration-200 ease-out
          \${selected 
            ? 'bg-white/20 text-white shadow-lg shadow-white/10 backdrop-blur-sm' 
            : 'text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1'
          }
          focus:outline-none focus:ring-2 focus:ring-white/30
        \`}
      >
        {Icon ? (
          <Icon 
            size={18} 
            className={\`transition-colors duration-200 \${selected ? 'text-white' : 'text-white/70'}\`}
          />
        ) : null}
        <span className="font-medium text-sm tracking-wide">
          {item.title}
        </span>
        {selected && <ChevronRight size={16} className="ml-auto opacity-70" />}
      </button>
    );
  });

  return (
    <>
      <button
        onClick={toggleMobile}
        className={\`
          md:hidden fixed top-4 left-4 z-50 p-3 rounded-lg
          bg-gradient-to-r from-blue-600 to-purple-600
          text-white shadow-lg shadow-blue-500/30
          hover:from-blue-700 hover:to-purple-700
          transition-all duration-200
        \`}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={\`
          fixed md:sticky top-0 left-0 h-screen z-40
          bg-gradient-to-b from-blue-600 to-purple-600
          border-r border-white/10
          transition-all duration-300 ease-in-out
          \${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 md:translate-x-0'}
          \${isCollapsed ? 'md:w-20' : 'md:w-64'}
        \`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 bg-black/10 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-lg shadow-black/10 backdrop-blur-md flex-shrink-0">
                <span className="font-bold text-white text-base">🤖</span>
              </div>
              <div className={\`
                flex flex-col min-w-0 transition-all duration-300
                \${isCollapsed ? 'md:opacity-0 md:overflow-hidden' : ''}
              \`}>
                <span className="text-sm font-bold text-white tracking-tight leading-tight truncate">
                  SPFx Enterprise
                </span>
                <span className="text-[11px] tracking-wider font-medium text-blue-100/70 truncate">
                  Template
                </span>
              </div>
            </div>
            <button
              onClick={toggleCollapse}
              className="
                hidden md:flex items-center justify-center
                w-8 h-8 rounded-lg bg-white/10
                text-white/70 hover:bg-white/20 hover:text-white
                transition-all duration-200
              "
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronRight size={16} className={isCollapsed ? '-rotate-180' : 'transition-transform duration-300'} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <nav className="space-y-1">
              {navItems}
            </nav>
          </div>

          <div className="p-4 border-t border-white/10 bg-black/10 backdrop-blur-sm">
            <div className={\`
              flex items-center gap-3 text-white/60 text-xs
              transition-all duration-300
              \${isCollapsed ? 'md:justify-center md:opacity-0' : ''}
            \`}>
              <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50 animate-pulse" />
              <span className="font-medium tracking-wide">Online</span>
            </div>
          </div>
        </div>
      </aside>

      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
`;
