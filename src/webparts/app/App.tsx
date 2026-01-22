import * as React from 'react';
import { HashRouter as Router, Route, Routes, useSearchParams, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme, ITheme, mergeStyleSets, Text, Stack } from '@fluentui/react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { getSP } from '../../config/pnpConfig';
import { Layout } from './components/Layout';
import Home from './pages/Home';

// Inicializa ícones do Fluent UI
initializeIcons();

// Context para SharePoint
export const SharePointContext = React.createContext<ReturnType<typeof getSP> | null>(null);

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

/**
 * Helper para sincronizar rotas com querystring
 */
export const useRouteSync = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const syncRoute = React.useCallback((route: string) => {
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
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}

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
  const { userDisplayName } = props;

  // Obter o SP inicializado
  const sp = React.useMemo(() => {
    return getSP();
  }, []);

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
    <ThemeProvider theme={lightTheme}>
      <SharePointContext.Provider value={sp}>
        <div className="spfx-app-root">
          <Router>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home userName={userDisplayName} />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </div>
      </SharePointContext.Provider>
    </ThemeProvider>
  );
};

export default App;
