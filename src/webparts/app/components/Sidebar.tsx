import * as React from 'react';
import { Nav, INavLink, INavStyles, INavLinkGroup } from '@fluentui/react/lib/Nav';
import { useLocation, useNavigate } from 'react-router-dom';

// Estilos customizados para o Nav do Fluent UI se adaptar ao fundo escuro/gradiente
const navStyles: Partial<INavStyles> = {
  root: {
    width: 250,
    height: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto',
    backgroundColor: 'transparent'
  },
  link: {
    color: 'rgba(255,255,255,0.7)',
    selectors: {
      ':hover': {
        backgroundColor: 'rgba(255,255,255,0.1)',
        color: '#ffffff'
      },
      '.ms-Nav-compositeLink:hover &': { // Garante hover correto no ícone
         color: '#ffffff'
      }
    }
  },
  linkText: {
    color: 'inherit'
  },
  groupHeader: {
    color: '#ffffff'
  },
  chevronButton: {
    color: 'rgba(255,255,255,0.7)',
    selectors: {
        ':hover': {
            color: '#ffffff',
            backgroundColor: 'transparent'
        }
    }
  },
  // Estilo para o item selecionado
  linkIsSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#ffffff',
    selectors: {
      ':after': {
        borderLeftColor: '#ffffff' // Barra lateral indicadora
      },
      ':hover': {
          backgroundColor: 'rgba(255,255,255,0.25)',
          color: '#ffffff'
      }
    }
  }
};

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const groups: INavLinkGroup[] = [
    {
      links: [
        {
          name: 'Dashboard',
          url: '/',
          key: 'home',
          icon: 'Home',
        },
        {
          name: 'Relatórios',
          url: '/reports',
          key: 'reports',
          icon: 'PieDouble',
        },
        {
          name: 'Configurações',
          url: '/settings',
          key: 'settings',
          icon: 'Settings',
        },
      ],
    },
  ];

  const onLinkClick = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
    ev?.preventDefault();
    if (item && item.url) {
      navigate(item.url);
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-blue-600 to-purple-700 text-white shadow-xl">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <span className="font-bold text-lg">CP</span>
        </div>
        <span className="text-xl font-bold tracking-tight">CorpPortal</span>
      </div>
      <div className="py-4">
        <Nav
          onLinkClick={onLinkClick}
          selectedKey={location.pathname === '/' ? 'home' : location.pathname.replace('/', '')}
          ariaLabel="Navegação lateral"
          styles={navStyles}
          groups={groups}
        />
      </div>
    </div>
  );
};
