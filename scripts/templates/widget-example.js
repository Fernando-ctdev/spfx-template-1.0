
module.exports = `
import * as React from 'react';
import { PrimaryButton } from '@fluentui/react';
import { Sparkles } from 'lucide-react';

interface IMainWidgetProps {
  userName?: string;
}

/**
 * Componente MainWidget
 * 
 * ARQUITETURA HÍBRIDA:
 * - Tailwind CSS para layout (flex, grid, spacing, containers)
 * - Fluent UI para componentes interativos (botões, inputs, diálogos)
 */
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

      <PrimaryButton
        onClick={() => alert('Widget funcionando!')}
        className="w-full"
      >
        Interagir
      </PrimaryButton>
    </div>
  );
};

export default MainWidget;
`;
