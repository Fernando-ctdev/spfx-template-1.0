import * as React from 'react';
import { Nav, INavLink, INavStyles, INavLinkGroup } from '@fluentui/react/lib/Nav';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../config/navigation';

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
      '.ms-Nav-compositeLink:hover &': { 
         color: '#ffffff'
      },
      // Estilo para o item selecionado (movido de linkIsSelected que não existe na tipagem)
      '&.is-selected': {
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#ffffff',
        selectors: {
          ':after': {
            borderLeftColor: '#ffffff'
          },
          ':hover': {
              backgroundColor: 'rgba(255,255,255,0.25)',
              color: '#ffffff'
          }
        }
      }
    }
  },
  linkText: {
    color: 'inherit'
  },
  // groupHeader removido pois não existe na interface INavStyles
  // groupHeader: {
  //   color: '#ffffff'
  // },
  chevronButton: {
    color: 'rgba(255,255,255,0.7)',
    selectors: {
        ':hover': {
            color: '#ffffff',
            backgroundColor: 'transparent'
        }
    }
  }
};

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Converte os itens de navegação do config para o formato do Fluent UI
  const groups: INavLinkGroup[] = React.useMemo(() => {
    return [
      {
        links: NAV_ITEMS.map(item => ({
          name: item.title,
          url: item.path,
          key: item.path === '/' ? 'home' : item.path.replace('/', ''),
          iconProps: {
            iconName: 'Page' // Fallback genérico para manter compatibilidade com Fluent sem quebrar tipagem
          },
          // Hack para passar o componente Lucide via data se quisermos renderizar customizado depois
          data: { iconComponent: item.icon }
        }))
      }
    ];
  }, []);

  const onLinkClick = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
    ev?.preventDefault();
    if (item && item.url) {
      navigate(item.url);
    }
  };

  // Renderização customizada para suportar ícones Lucide dentro do Nav do Fluent UI
  // OBS: onRenderLinkPrefix não existe no Nav do Fluent UI 8. Removido para corrigir erro de build.
  // Se quiser usar ícones customizados, deve-se usar onRenderLink.
  /*
  const onRenderLinkPrefix = (link: INavLink): JSX.Element | null => {
    if (link.data && link.data.iconComponent) {
      const Icon = link.data.iconComponent;
      return <Icon size={20} className="mr-3" />;
    }
    return null;
  };
  */

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
          // onRenderLinkPrefix={onRenderLinkPrefix}
        />
      </div>
    </div>
  );
};
