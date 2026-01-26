import * as React from 'react';
import { Terminal, FolderTree, Wrench, Settings, Linkedin, Sparkles, ExternalLink, ArrowRight, Zap } from 'lucide-react';

interface IHomeProps {
  userName?: string;
}

const features = [
  {
    icon: Terminal,
    title: 'CLI & Geração de Código',
    description: 'Comandos poderosos para gerar componentes, extensões, web parts e muito mais com um único comando',
    command: 'pnpm run generate:page Nome'
  },
  {
    icon: FolderTree,
    title: 'Estrutura Organizada',
    description: 'Organização modular e escalável com separação clara de responsabilidades (components, services, hooks, models)'
  },
  {
    icon: Wrench,
    title: 'Ferramentas Integradas',
    description: 'ESLint, Prettier, Jest, Tailwind CSS, Fluent UI e mais ferramentas configuradas out-of-the-box'
  },
  {
    icon: Settings,
    title: 'Setup Inteligente',
    description: 'Script configure interativo com modos de execução (Page, Component) e layouts (Navbar, Sidebar, Blank)'
  }
];

const Home: React.FC<IHomeProps> = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <header className="mb-16 lg:mb-24">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl lg:rounded-3xl p-8 lg:p-12 shadow-2xl shadow-blue-500/30 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-yellow-300" />
                <span className="text-sm lg:text-base font-medium bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
                  v1.0.0
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                SPFx Enterprise Template
              </h1>
              
              <p className="text-xl lg:text-2xl text-blue-50 mb-8 max-w-3xl">
                Bem-vindo à página inicial do seu projeto SPFx, criado com o SPFx Enterprise Template
              </p>
              
              <p className="text-base lg:text-lg text-blue-100 mb-8 max-w-2xl leading-relaxed">
                Um template moderno e robusto para SharePoint Framework com arquitetura escalável, ferramentas integradas e setup inteligente para acelerar seu desenvolvimento.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href="https://www.linkedin.com/in/devmfernando/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>Maicon Fernando Cabral</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-16 lg:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Recursos do Template
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tudo o que você precisa para criar aplicações SharePoint modernas de forma rápida e eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                  <feature.icon size={28} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                {feature.command && (
                  <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-green-400 flex items-center justify-between">
                    <code className="truncate">{feature.command}</code>
                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 lg:mb-24">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 lg:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
                  <Sparkles className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    Esta é uma página de exemplo
                  </h3>
                  
                  <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                    Todo o conteúdo apresentado nesta página foi gerado automaticamente pelo template <strong className="text-blue-600">SPFx Enterprise Template</strong> e serve apenas como exemplo inicial.
                  </p>
                  
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    Você deve substituir este conteúdo pela implementação real do seu projeto.
                  </p>
                  
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-600">
                    <ArrowRight className="w-4 h-4" />
                    <span>Use os scripts do template para criar suas próprias páginas e componentes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-gray-200 pt-8 lg:pt-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500 mb-1">
                SPFx Enterprise Template v1.0.0
              </p>
              <p className="text-sm text-gray-400">
                © 2025 SPFx Enterprise Template
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/devmfernando/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span className="text-sm font-medium">Maicon Fernando Cabral</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
