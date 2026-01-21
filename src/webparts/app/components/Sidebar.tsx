import * as React from 'react';
import { Nav, INavLink, INavStyles } from '@fluentui/react/lib/Nav';
import { useLocation, useNavigate } from 'react-router-dom';

const navStyles: Partial<INavStyles> = {
  root: {
    width: 250,
    height: '100%',
    boxSizing: 'border-box',
    borderRight: '1px solid #eee',
    overflowY: 'auto',
    backgroundColor: 'var(--bodyBackground, #ffffff)'
  },
};

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const groups = [
    {
      links: [
        {
          name: 'Início',
          url: '/',
          key: 'home',
          icon: 'Home',
        },
        {
          name: 'Exemplo',
          url: '/example',
          key: 'example',
          icon: 'Table',
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
    <div className="h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Menu</span>
      </div>
      <Nav
        onLinkClick={onLinkClick}
        selectedKey={location.pathname === '/' ? 'home' : location.pathname.replace('/', '')}
        ariaLabel="Navegação lateral"
        styles={navStyles}
        groups={groups}
      />
    </div>
  );
};
