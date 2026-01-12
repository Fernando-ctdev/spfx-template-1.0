import * as React from 'react';
import { HashRouter as Router, Route, Routes, useSearchParams, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme, ITheme } from '@fluentui/react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
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

// Componente Home de exemplo usando Fluent UI
const Home: React.FC<{ userName?: string }> = ({ userName }) => {
  return (
    <div className="spfx-app-root" style={{ padding: '24px' }}>
      <h1 style={{ margin: '0 0 16px 0', fontSize: '28px', fontWeight: 600 }}>
        🚀 Bem-vindo ao seu App SPFx{userName ? `, ${userName}` : ''}!
      </h1>
      <p style={{ color: '#605e5c', marginBottom: '24px' }}>
        Este é o template de página inteira. Edite este arquivo para começar a desenvolver.
      </p>
      
      <div style={{ 
        background: '#f3f2f1', 
        padding: '16px', 
        borderRadius: '4px',
        border: '1px solid #edebe9'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>
          📁 Estrutura do Projeto
        </h3>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>📁 Páginas em: <code style={{ background: '#e1dfdd', padding: '2px 6px', borderRadius: '3px' }}>src/webparts/app/pages/</code></li>
          <li>🧩 Componentes em: <code style={{ background: '#e1dfdd', padding: '2px 6px', borderRadius: '3px' }}>src/webparts/app/components/</code></li>
          <li>🔧 Serviços em: <code style={{ background: '#e1dfdd', padding: '2px 6px', borderRadius: '3px' }}>src/core/services/</code></li>
          <li>📊 Models em: <code style={{ background: '#e1dfdd', padding: '2px 6px', borderRadius: '3px' }}>src/models/</code></li>
        </ul>
      </div>

      <div style={{ marginTop: '24px', padding: '16px', background: '#deecf9', borderRadius: '4px', border: '1px solid #c7e0f4' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: '#0078d4' }}>
          💡 Stack de UI
        </h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#323130' }}>
          <strong>Fluent UI</strong> para componentes visuais | <strong>Radix UI</strong> para componentes headless avançados
        </p>
      </div>
    </div>
  );
};

// Componente NotFound
const NotFound: React.FC = () => {
  return (
    <div className="spfx-app-root" style={{ padding: '24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '72px', margin: '0', color: '#d13438' }}>404</h1>
      <p style={{ fontSize: '18px', color: '#605e5c' }}>Página não encontrada</p>
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
