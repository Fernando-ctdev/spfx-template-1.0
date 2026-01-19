import * as React from 'react';
import { Rocket, FolderOpen, Puzzle, Wrench, Database, Sparkles, ExternalLink } from 'lucide-react';

// Cores para ícones de estrutura
const iconColors = {
  pages: { bg: '#e3f2fd', color: '#1976d2' },
  components: { bg: '#f3e5f5', color: '#7b1fa2' },
  services: { bg: '#e8f5e9', color: '#388e3c' },
  models: { bg: '#fff3e0', color: '#f57c00' },
};

interface IHomeProps {
  userName?: string;
}

const Home: React.FC<IHomeProps> = ({ userName }) => {
  const structureItems = [
    { icon: FolderOpen, label: 'Páginas', path: 'src/webparts/app/pages/', colors: iconColors.pages },
    { icon: Puzzle, label: 'Componentes', path: 'src/webparts/app/components/', colors: iconColors.components },
    { icon: Wrench, label: 'Serviços', path: 'src/core/services/', colors: iconColors.services },
    { icon: Database, label: 'Models', path: 'src/models/', colors: iconColors.models },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] p-8 text-center text-white">
          <div className="inline-flex p-3 rounded-full bg-white/20 mb-4">
            <Rocket size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-semibold mb-2">
            {userName ? `Olá, ${userName}!` : 'Bem-vindo!'}
          </h1>
          <p className="text-sm opacity-90">
            Seu template SPFx está pronto para desenvolvimento
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Estrutura do Projeto */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
              <FolderOpen size={18} className="text-[#0078d4]" />
              <span>Estrutura do Projeto</span>
            </div>
            <div className="flex flex-col gap-2">
              {structureItems.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 transition-all hover:bg-gray-100 hover:translate-x-1"
                >
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: item.colors.bg }}
                  >
                    <item.icon size={18} color={item.colors.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 mb-0.5">{item.label}</p>
                    <p className="text-xs text-gray-600 font-mono">{item.path}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stack de UI */}
          <div className="mb-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
              <Sparkles size={18} className="text-[#0078d4]" />
              <span>Stack de UI</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-md text-sm font-medium text-gray-800">
                <span className="text-base">🎨</span> Tailwind CSS
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-md text-sm font-medium text-gray-800">
                <span className="text-base">⚡</span> Fluent UI v8
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-md text-sm font-medium text-gray-800">
                <span className="text-base">📦</span> PnPjs 4.x
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-md text-sm font-medium text-gray-800">
                <span className="text-base">🔄</span> TanStack Query
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <span className="text-xs text-gray-600">
            SPFx 1.21.0 • React 17 • TypeScript
          </span>
          <a 
            href="https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-[#0078d4] no-underline flex items-center gap-1 hover:underline"
          >
            Documentação <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
