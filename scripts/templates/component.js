module.exports = (name, withProps) => `import * as React from 'react';

/**
 * Props do componente ${name}
 */
export interface I${name}Props {${withProps ? `
  title?: string;
  description?: string;` : `
  // Adicione suas props aqui`}
}

/**
 * Componente ${name}
 * 
 * @description Componente gerado automaticamente.
 * 
 * ARQUITETURA HÍBRIDA:
 * - Tailwind CSS para layout (flex, grid, spacing, containers)
 * - Fluent UI para componentes interativos (botões, inputs, diálogos)
 * 
 * Exemplos de uso de Fluent UI:
 * - PrimaryButton, DefaultButton para ações
 * - TextField para inputs
 * - Dialog para modais
 * - DetailsList para tabelas
 */
const ${name}: React.FC<I${name}Props> = (${withProps ? '{ title, description }' : 'props'}) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Conteúdo do componente ${name} */}${withProps ? `
      {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
      {description && <p className="text-sm text-gray-600">{description}</p>}` : ''}
    </div>
  );
};

export default ${name};
`;
