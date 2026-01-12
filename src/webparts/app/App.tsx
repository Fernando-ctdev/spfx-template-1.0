import * as React from 'react';
import { HashRouter as Router, Route, Routes, useSearchParams, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme, ITheme, mergeStyleSets, Text, Stack } from '@fluentui/react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { Rocket, FolderOpen, Puzzle, Wrench, Database, Sparkles, ExternalLink } from 'lucide-react';
import { getSP } from '../../config/pnpConfig';

// Inicializa ícones do Fluent UI
initializeIcons();

// Context para SharePoint
export const SharePointContext = React.createContext<ReturnType<typeof getSP> | null>(null);

// Context para controle de tema
export const ThemeContext = React.createContext<{
  isDark: boolean;
  toggleTheme: () => void;
}>({ isDark: false, toggleTheme: () => {} });

// Tema Light (Fluent UI v8)
const lightTheme: ITheme = createTheme({
  palette: {
    themePrimary: '#0078d4',
    themeLighterAlt: '#eff6fc',
    themeLighter: '#deecf9',
    themeLight: '#c7e0f4',
    themeTertiary: '#71afe5',
    themeSecondary: '#2b88d8',
    themeDarkAlt: '#106ebe',
    themeDark: '#005a9e',
    themeDarker: '#004578',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff',
  },
});

// Tema Dark (Fluent UI v8)
const darkTheme: ITheme = createTheme({
  palette: {
    themePrimary: '#2899f5',
    themeLighterAlt: '#02060a',
    themeLighter: '#061827',
    themeLight: '#0c2d49',
    themeTertiary: '#185a93',
    themeSecondary: '#2284d7',
    themeDarkAlt: '#3da3f6',
    themeDark: '#5db2f7',
    themeDarker: '#8ac7f9',
    neutralLighterAlt: '#2b2b2b',
    neutralLighter: '#333333',
    neutralLight: '#414141',
    neutralQuaternaryAlt: '#4a4a4a',
    neutralQuaternary: '#515151',
    neutralTertiaryAlt: '#6f6f6f',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#1f1f1f',
  },
});

/**
 * Helper para sincronizar rotas com querystring
 * Resolve o problema de deep links e compartilhamento de URLs
 */
export const useRouteSync = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const syncRoute = React.useCallback((route: string) => {
    // Atualiza querystring para permitir deep link
    setSearchParams({ page: route.replace('/', '') || 'home' });
  }, [setSearchParams]);

  const getInitialRoute = React.useCallback(() => {
    const page = searchParams.get('page');
    return page ? `/${page}` : '/';
  }, [searchParams]);

  return { syncRoute, getInitialRoute, navigate };
};

export interface IAppProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}

// Estilos da página Home
const homeStyles = mergeStyleSets({
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '24px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    maxWidth: '600px',
    width: '100%',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 100%)',
    padding: '32px',
    textAlign: 'center' as const,
  },
  headerIcon: {
    width: '64px',
    height: '64px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: 600,
    margin: '0 0 8px 0',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    margin: 0,
  },
  body: {
    padding: '32px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#323130',
  },
  structureList: {
    display: 'grid',
    gap: '12px',
  },
  structureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: '#f3f2f1',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    ':hover': {
      background: '#edebe9',
      transform: 'translateX(4px)',
    },
  },
  structureIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  structureText: {
    flex: 1,
  },
  structureLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#323130',
    margin: 0,
  },
  structurePath: {
    fontSize: '12px',
    color: '#605e5c',
    fontFamily: 'Consolas, Monaco, monospace',
    margin: 0,
  },
  stackBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#deecf9',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#0078d4',
    marginRight: '8px',
    marginBottom: '8px',
  },
  footer: {
    borderTop: '1px solid #edebe9',
    padding: '16px 32px',
    background: '#faf9f8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: '12px',
    color: '#605e5c',
  },
  footerLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#0078d4',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
});

// Cores para ícones de estrutura
const iconColors = {
  pages: { bg: '#e3f2fd', color: '#1976d2' },
  components: { bg: '#f3e5f5', color: '#7b1fa2' },
  services: { bg: '#e8f5e9', color: '#388e3c' },
  models: { bg: '#fff3e0', color: '#f57c00' },
};

// Componente Home moderno
const Home: React.FC<{ userName?: string }> = ({ userName }) => {
  const structureItems = [
    { icon: FolderOpen, label: 'Páginas', path: 'src/webparts/app/pages/', colors: iconColors.pages },
    { icon: Puzzle, label: 'Componentes', path: 'src/webparts/app/components/', colors: iconColors.components },
    { icon: Wrench, label: 'Serviços', path: 'src/core/services/', colors: iconColors.services },
    { icon: Database, label: 'Models', path: 'src/models/', colors: iconColors.models },
  ];

  return (
    <div className={homeStyles.container}>
      <div className={homeStyles.card}>
        {/* Header */}
        <div className={homeStyles.header}>
          <div className={homeStyles.headerIcon}>
            <Rocket size={32} color="#ffffff" />
          </div>
          <h1 className={homeStyles.headerTitle}>
            {userName ? `Olá, ${userName}!` : 'Bem-vindo!'}
          </h1>
          <p className={homeStyles.headerSubtitle}>
            Seu template SPFx está pronto para desenvolvimento
          </p>
        </div>

        {/* Body */}
        <div className={homeStyles.body}>
          {/* Estrutura do Projeto */}
          <div className={homeStyles.section}>
            <div className={homeStyles.sectionTitle}>
              <FolderOpen size={18} color="#0078d4" />
              <span>Estrutura do Projeto</span>
            </div>
            <div className={homeStyles.structureList}>
              {structureItems.map((item, index) => (
                <div key={index} className={homeStyles.structureItem}>
                  <div 
                    className={homeStyles.structureIcon}
                    style={{ background: item.colors.bg }}
                  >
                    <item.icon size={18} color={item.colors.color} />
                  </div>
                  <div className={homeStyles.structureText}>
                    <p className={homeStyles.structureLabel}>{item.label}</p>
                    <p className={homeStyles.structurePath}>{item.path}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stack de UI */}
          <div className={homeStyles.section} style={{ marginBottom: 0 }}>
            <div className={homeStyles.sectionTitle}>
              <Sparkles size={18} color="#0078d4" />
              <span>Stack de UI</span>
            </div>
            <div>
              <span className={homeStyles.stackBadge}>
                <span style={{ fontSize: '16px' }}>🎨</span> Fluent UI v8
              </span>
              <span className={homeStyles.stackBadge}>
                <span style={{ fontSize: '16px' }}>⚡</span> Radix UI
              </span>
              <span className={homeStyles.stackBadge}>
                <span style={{ fontSize: '16px' }}>📦</span> PnPjs 4.x
              </span>
              <span className={homeStyles.stackBadge}>
                <span style={{ fontSize: '16px' }}>🔄</span> TanStack Query
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={homeStyles.footer}>
          <span className={homeStyles.footerText}>
            SPFx 1.21.0 • React 17 • TypeScript
          </span>
          <a 
            href="https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview" 
            target="_blank" 
            rel="noopener noreferrer"
            className={homeStyles.footerLink}
          >
            Documentação <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};

// Estilos da página NotFound
const notFoundStyles = mergeStyleSets({
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '24px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: '48px',
    textAlign: 'center' as const,
  },
  errorCode: {
    fontSize: '120px',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #d13438 0%, #a4262c 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
    lineHeight: 1,
  },
  errorText: {
    fontSize: '18px',
    color: '#605e5c',
    margin: '16px 0 0 0',
  },
});

// Componente NotFound moderno
const NotFound: React.FC = () => {
  return (
    <div className={notFoundStyles.container}>
      <div className={notFoundStyles.card}>
        <h1 className={notFoundStyles.errorCode}>404</h1>
        <p className={notFoundStyles.errorText}>Página não encontrada</p>
      </div>
    </div>
  );
};

const App: React.FC<IAppProps> = (props) => {
  const { userDisplayName, isDarkTheme } = props;
  const [darkMode, setDarkMode] = React.useState(isDarkTheme);

  // Obter o SP inicializado
  const sp = React.useMemo(() => {
    return getSP();
  }, []);

  // Toggle tema
  const toggleTheme = React.useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  // Atualiza quando prop muda
  React.useEffect(() => {
    setDarkMode(isDarkTheme);
  }, [isDarkTheme]);

  // Scroll helper
  React.useEffect(() => {
    const forceScrollTop = () => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };
    
    forceScrollTop();
    window.addEventListener('hashchange', forceScrollTop);
    
    return () => {
      window.removeEventListener('hashchange', forceScrollTop);
    };
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <ThemeContext.Provider value={{ isDark: darkMode, toggleTheme }}>
        <SharePointContext.Provider value={sp}>
          <div className="spfx-app-root">
            <Router>
              <Routes>
                <Route path="/" element={<Home userName={userDisplayName} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </div>
        </SharePointContext.Provider>
      </ThemeContext.Provider>
    </ThemeProvider>
  );
};

export default App;
