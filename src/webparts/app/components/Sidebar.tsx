import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../config/navigation';
import { makeStyles } from '@fluentui/react-components';

const useNavStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
  },
  link: {
    height: '36px',
    lineHeight: '36px',
    paddingLeft: '16px',
    background: 'transparent',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 150ms ease',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.1)',
    },
  },
  linkSelected: {
    background: 'rgba(255, 255, 255, 0.2)',
    fontWeight: '600',
  },
  linkText: {
    margin: 0,
    fontSize: '13px',
  },
  groupContent: {
    marginBottom: '12px',
  },
});

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useNavStyles();

  const onLinkClick = (path: string) => {
    navigate(path);
  };

  const isSelected = (path: string) => {
    const currentPath = location.pathname === '/' ? 'home' : location.pathname.replace('/', '');
    const itemPath = path === '/' ? 'home' : path.replace('/', '');
    return currentPath === itemPath;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-brand-start to-brand-end border-r border-white/10 text-white/80 font-sans selection:bg-white/30">
      <div className="h-16 flex items-center px-4 border-b border-white/10 bg-black/10 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center shadow-lg shadow-black/10 group-hover:bg-white/30 transition-colors backdrop-blur-md">
            <span className="font-bold text-white text-sm tracking-wide">🤖</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-tight leading-tight">
              Portal
            </span>
            <span className="text-[11px] tracking-wider font-medium text-blue-100/70">
              Workspace
            </span>
          </div>
        </div>
      </div>

      <div className={classes.groupContent}>
        <nav className={classes.root}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const selected = isSelected(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => onLinkClick(item.path)}
                className={`${classes.link} ${selected ? classes.linkSelected : ''}`}
              >
                {Icon ? (
                  <Icon 
                    size={16} 
                    className={selected ? "text-white" : "text-white/70 group-hover:text-white transition-colors duration-200"} 
                  />
                ) : null}
                <span className={classes.linkText}>{item.title}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
