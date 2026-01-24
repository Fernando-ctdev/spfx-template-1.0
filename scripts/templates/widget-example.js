
module.exports = `
import * as React from 'react';
import { Sparkles } from 'lucide-react';

interface IMainWidgetProps {
  userName?: string;
}

const MainWidget: React.FC<IMainWidgetProps> = ({ userName }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 max-w-sm mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
          <Sparkles size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Olá, {userName}!</h2>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">
        Este é o seu novo <strong>Widget SPFx</strong>. Ele foi configurado para ser inserido em qualquer página do SharePoint.
      </p>

      <button 
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
        onClick={() => alert('Widget funcionando!')}
      >
        Interagir
      </button>
    </div>
  );
};

export default MainWidget;
`;
