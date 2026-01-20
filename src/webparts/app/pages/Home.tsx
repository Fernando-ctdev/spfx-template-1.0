
import * as React from 'react';
import { Rocket, FolderOpen, Puzzle, Wrench, Database, Sparkles, ExternalLink, ArrowRight, Zap, Code } from 'lucide-react';
import { NavLink } from 'react-router-dom';

// Cores para ícones de estrutura
const iconColors = {
  pages: { bg: 'bg-blue-50 dark:bg-blue-900/20', color: 'text-blue-600 dark:text-blue-400' },
  components: { bg: 'bg-purple-50 dark:bg-purple-900/20', color: 'text-purple-600 dark:text-purple-400' },
  services: { bg: 'bg-green-50 dark:bg-green-900/20', color: 'text-green-600 dark:text-green-400' },
  models: { bg: 'bg-orange-50 dark:bg-orange-900/20', color: 'text-orange-600 dark:text-orange-400' },
};

interface IHomeProps {
  userName?: string;
}

const Home: React.FC<IHomeProps> = ({ userName }) => {
  const structureItems = [
    { icon: FolderOpen, label: 'Páginas', path: 'src/webparts/app/pages/', ...iconColors.pages },
    { icon: Puzzle, label: 'Componentes', path: 'src/webparts/app/components/', ...iconColors.components },
    { icon: Wrench, label: 'Serviços', path: 'src/core/services/', ...iconColors.services },
    { icon: Database, label: 'Models', path: 'src/models/', ...iconColors.models },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-semibold uppercase tracking-wide">
              Template V2.0
            </span>
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs font-semibold uppercase tracking-wide">
              SPA Ready
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {userName ? `Olá, ${userName}!` : 'Bem-vindo ao seu novo Portal'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Este template foi arquitetado para escalar. Você tem em mãos uma estrutura completa com roteamento, 
            gerenciamento de estado e estilização moderna.
          </p>
        </div>
        <div className="hidden md:block p-4 bg-blue-50 dark:bg-blue-900/10 rounded-full">
          <Rocket size={48} className="text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal - Estrutura */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Code className="text-gray-400" size={20} />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Onde codar?</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {structureItems.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${item.bg}`}>
                    <item.icon size={20} className={item.color} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.label}</h3>
                    <code className="text-xs text-gray-500 dark:text-gray-400 mt-1 block break-all">{item.path}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-start gap-4">
              <Zap className="mt-1 text-yellow-300" />
              <div>
                <h3 className="font-bold text-lg mb-2">Acelere com o Gerador</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Não perca tempo criando arquivos manualmente. Use a CLI para gerar páginas completas com rotas e menu já configurados.
                </p>
                <div className="bg-black/30 rounded-lg p-3 font-mono text-xs sm:text-sm text-blue-200 inline-block">
                  npm run generate:page Relatorios
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Lateral - Stack e Links */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="text-yellow-500" size={20} />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tech Stack</h2>
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Tailwind CSS', desc: 'Estilização Utility-First', icon: '🎨' },
                { name: 'Fluent UI v8', desc: 'Componentes Microsoft', icon: '⚡' },
                { name: 'TanStack Query', desc: 'Gerenciamento de Estado', icon: '🔄' },
                { name: 'PnPjs', desc: 'Comunicação SharePoint', icon: '📦' },
              ].map((tech) => (
                <div key={tech.name} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="text-xl">{tech.icon}</span>
                  <div>
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{tech.name}</div>
                    <div className="text-xs text-gray-500">{tech.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Links Úteis</h3>
            <div className="space-y-2">
              <a 
                href="https://tailwindcss.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 group"
              >
                Docs Tailwind
                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a 
                href="https://pnp.github.io/pnpjs/" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 group"
              >
                Docs PnPjs
                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
