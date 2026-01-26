import * as React from 'react';
import { HashRouter as Router, Route, Routes, useSearchParams, useNavigate } from 'react-router-dom';
import { FluentProvider, webLightTheme, makeStyles, shorthands } from '@fluentui/react-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getSP } from '../../config/pnpConfig';
import { Layout } from './components/Layout';
import Home from './pages/Home';
/* GENERATOR: IMPORT_PAGE */

export const SharePointContext = React.createContext<ReturnType<typeof getSP> | null>(null);

const useAppStyles = makeStyles({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    ...shorthands.padding('24px'),
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    ...shorthands.padding('48px'),
    textAlign: 'center',
  },
  errorCode: {
    fontSize: '120px',
    fontWeight: '700',
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
    ...shorthands.margin('16px', '0', '0', '0'),
  },
});

const NotFound: React.FC = () => {
  const classes = useAppStyles();

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <h1 className={classes.errorCode}>404</h1>
        <p className={classes.errorText}>Página não encontrada</p>
      </div>
    </div>
  );
};

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

const App: React.FC<IAppProps> = (props) => {
  const { userDisplayName } = props;
  const classes = useAppStyles();
  const queryClient = React.useMemo(() => new QueryClient(), []);

  const sp = React.useMemo(() => {
    return getSP();
  }, []);

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
    <QueryClientProvider client={queryClient}>
      <FluentProvider theme={webLightTheme}>
        <SharePointContext.Provider value={sp}>
          <div className={classes.root}>
            <Router>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home userName={userDisplayName} />} />
                  {/* GENERATOR: ROUTE_PAGE */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Router>
          </div>
        </SharePointContext.Provider>
      </FluentProvider>
    </QueryClientProvider>
  );
};

export default App;
