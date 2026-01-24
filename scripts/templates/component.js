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
 * @description Descrição do componente ${name}
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
