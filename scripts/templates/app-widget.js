
module.exports = `
import * as React from 'react';
import { FluentProvider, webLightTheme, Button } from '@fluentui/react-components';
import { Sparkles } from 'lucide-react';
import { getSP } from '../../config/pnpConfig';
import MainWidget from './components/MainWidget';

export const SharePointContext = React.createContext<ReturnType<typeof getSP> | null>(null);

export interface IAppProps {
  description: string;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}

const App: React.FC<IAppProps> = (props) => {
  const { userDisplayName } = props;

  const sp = React.useMemo(() => {
    return getSP();
  }, []);

  return (
    <FluentProvider theme={webLightTheme}>
      <SharePointContext.Provider value={sp}>
        <div className="spfx-widget-root p-4">
           <MainWidget userName={userDisplayName} />
        </div>
      </SharePointContext.Provider>
    </FluentProvider>
  );
};

export default App;
`;
