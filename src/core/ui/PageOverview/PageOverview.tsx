import * as React from 'react';
import { FileCode, FileText, Wrench, Zap, ExternalLink } from 'lucide-react';

interface FileInfo {
  name: string;
  path: string;
  description: string;
  type: 'page' | 'component' | 'service' | 'hook' | 'model' | 'test';
}

interface IPageOverviewProps {
  pageName: string;
  files: FileInfo[];
  createdAt?: string;
}

const fileIcons = {
  page: FileCode,
  component: FileCode,
  service: Wrench,
  hook: Zap,
  model: FileText,
  test: FileText
};

const fileColors = {
  page: 'from-blue-600 to-purple-600',
  component: 'from-cyan-600 to-blue-600',
  service: 'from-emerald-600 to-teal-600',
  hook: 'from-orange-600 to-red-600',
  model: 'from-violet-600 to-purple-600',
  test: 'from-pink-600 to-rose-600'
};

const PageOverview: React.FC<IPageOverviewProps> = ({ pageName, files, createdAt }) => {
  const getRelativePath = (fullPath: string) => {
    return fullPath.replace(/^.*?src\//, 'src/');
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 lg:px-8 py-4 lg:py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileCode className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-white">
                Visão Geral da Página
              </h2>
              <p className="text-blue-100 text-sm lg:text-base">
                {pageName} - Arquivos gerados automaticamente
              </p>
            </div>
          </div>
          {createdAt && (
            <div className="text-right">
              <p className="text-xs text-blue-100">Criado em</p>
              <p className="text-sm font-medium text-white">{createdAt}</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <p className="text-gray-600 leading-relaxed">
            Esta página foi gerada automaticamente pelo <strong className="text-blue-600">SPFx Enterprise Template</strong> 
            e inclui todos os arquivos necessários para sua funcionalidade. Abaixo você encontra uma visão detalhada 
            dos componentes criados e suas respectivas responsabilidades.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {files.map((file, index) => {
            const FileIcon = fileIcons[file.type];
            const gradientClass = fileColors[file.type];

            return (
              <div
                key={index}
                className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <FileIcon size={24} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {file.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gradient-to-r ${gradientClass}`}>
                        {file.type}
                      </span>
                    </div>
                    
                    <code className="block text-xs text-gray-500 font-mono bg-gray-100 rounded px-2 py-1 mb-2 truncate">
                      {getRelativePath(file.path)}
                    </code>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {file.description}
                    </p>
                  </div>

                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-black-900 dark:text-gray-600 mb-1">
                Dica de Desenvolvimento
              </h4>
              <p className="text-sm text-blue-800 dark:text-gray-500">
                Todos os arquivos estão interconectados e seguem o padrão de arquitetura do template. 
                Modifique os arquivos conforme necessário para implementar sua lógica de negócios.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageOverview;
