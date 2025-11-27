import * as React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getSP } from '../../config/pnpConfig';

// Context para SharePoint
export const SharePointContext = React.createContext<ReturnType<typeof getSP> | null>(null);

// Scroll to top on navigation
if (typeof window !== 'undefined') {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
}

// Tema MUI customizado
const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#0078d4', // Azul SharePoint
      light: '#2b88d8',
      dark: '#005a9e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6264a7', // Roxo Teams
      light: '#8b8cc7',
      dark: '#464775',
      contrastText: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'none',
        },
      },
    },
  },
});

export interface IAppProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}

// Componente Home de exemplo
const Home: React.FC<{ userName?: string }> = ({ userName }) => {
  return (
    <div style={{ padding: '24px' }}>
      <h1>🚀 Bem-vindo ao seu App SPFx{userName ? `, ${userName}` : ''}!</h1>
      <p>Este é o template de página inteira. Edite este arquivo para começar a desenvolver.</p>
      <ul>
        <li>📁 Páginas em: <code>src/webparts/app/pages/</code></li>
        <li>🧩 Componentes em: <code>src/webparts/app/components/</code></li>
        <li>🔧 Serviços em: <code>src/core/services/</code></li>
        <li>📊 Models em: <code>src/models/</code></li>
      </ul>
    </div>
  );
};

// Componente NotFound
const NotFound: React.FC = () => {
  return (
    <div style={{ padding: '24px', textAlign: 'center' }}>
      <h1>404</h1>
      <p>Página não encontrada</p>
    </div>
  );
};

const App: React.FC<IAppProps> = (props) => {
  const {
    userDisplayName
  } = props;

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SharePointContext.Provider value={sp}>
        <Router>
          <Routes>
            <Route path="/" element={<Home userName={userDisplayName} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </SharePointContext.Provider>
    </ThemeProvider>
  );
};

export default App;
