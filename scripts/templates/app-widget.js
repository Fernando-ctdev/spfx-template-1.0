
module.exports = `
import * as React from 'react';
import { ThemeProvider, createTheme, ITheme } from '@fluentui/react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { getSP } from '../../config/pnpConfig';
import MainWidget from './components/MainWidget';

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

export interface IAppProps {
  description: string;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}

const App: React.FC<IAppProps> = (props) => {
  const { userDisplayName } = props;

  // Obter o SP inicializado
  const sp = React.useMemo(() => {
    return getSP();
  }, []);

  return (
    <ThemeProvider theme={lightTheme}>
      <SharePointContext.Provider value={sp}>
        <div className="spfx-widget-root p-4">
           <MainWidget userName={userDisplayName} />
        </div>
      </SharePointContext.Provider>
    </ThemeProvider>
  );
};

export default App;
`;
