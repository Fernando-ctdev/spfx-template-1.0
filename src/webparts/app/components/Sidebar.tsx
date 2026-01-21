import * as React from 'react';
import { Nav, INavLink, INavStyles, INavLinkGroup } from '@fluentui/react/lib/Nav';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../config/navigation';

// Estilos de Reset para o Fluent UI Nav
// A estilização real é delegada ao Tailwind via classes CSS injetadas
const navStyles: Partial<INavStyles> = {
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
    selectors: {
      ':after': { display: 'none' }, 
      ':hover': { background: 'transparent' }, 
      '.ms-Nav-compositeLink:hover &': { background: 'transparent' },
      '.ms-Nav-compositeLink.is-selected &': { background: 'transparent' }
    }
  },
  linkText: {
    margin: 0
  },
  chevronButton: {
    height: '36px',
    lineHeight: '36px',
    color: 'inherit',
    selectors: {
      ':hover': { background: 'transparent', color: 'inherit' }
    }
  },
  groupContent: {
    marginBottom: '12px'
  }
};

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const groups: INavLinkGroup[] = React.useMemo(() => {
    return [{
      links: NAV_ITEMS.map(item => ({
        name: item.title,
        url: `#${item.path}`, 
        key: item.path === '/' ? 'home' : item.path.replace('/', ''),
        data: { 
          iconComponent: item.icon,
          originalPath: item.path 
        }
      }))
    }];
  }, []);

  const onLinkClick = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    
    if (item?.data?.originalPath) {
      navigate(item.data.originalPath);
    } else if (item?.url) {
      const path = item.url.replace(/^#/, '');
      navigate(path);
    }
  };

  const onRenderLink = (link: INavLink): JSX.Element => {
    const Icon = link.data?.iconComponent;
    const isSelected = link.key === (location.pathname === '/' ? 'home' : location.pathname.replace('/', ''));

    return (
      <div className="flex items-center gap-3">
        {Icon ? (
          <Icon 
            size={16} 
            className={isSelected ? "text-white" : "text-white/70 group-hover:text-white transition-colors duration-200"} 
          />
        ) : null}
        <span className="text-[13px]">{link.name}</span>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-brand-start to-brand-end border-r border-white/10 text-white/80 font-sans selection:bg-white/30">
      {/* Header */}
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

      {/* Navigation Area */}
      <div className="flex-1 py-4 px-2 overflow-y-auto custom-scrollbar">
        {/* Wrapper para injetar estilos Tailwind nos elementos internos do Fluent UI */}
        <div className="
          [&_.ms-Nav-compositeLink]:mb-1
          [&_.ms-Nav-link]:transition-all [&_.ms-Nav-link]:duration-150 [&_.ms-Nav-link]:rounded-md 
          [&_.ms-Nav-link]:text-white/70 [&_.ms-Nav-link:hover]:bg-white/10 [&_.ms-Nav-link:hover]:text-white
          [&_.is-selected_.ms-Nav-link]:bg-white/20 [&_.is-selected_.ms-Nav-link]:text-white
          [&_.is-selected_.ms-Nav-link]:font-semibold [&_.is-selected_.ms-Nav-link]:shadow-sm
          [&_.ms-Nav-linkText]:text-[13px]
        ">
          <Nav
            onLinkClick={onLinkClick}
            onRenderLink={onRenderLink}
            selectedKey={location.pathname === '/' ? 'home' : location.pathname.replace('/', '')}
            styles={navStyles}
            groups={groups}
          />
        </div>
      </div>

    </div>
  );
};
