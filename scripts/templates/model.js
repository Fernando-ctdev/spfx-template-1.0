module.exports = (name, options = {}) => {
  const { extendModel } = options || {};
  
  if (extendModel) {
    return `/**
 * Interface ${name}
 *
 * @description Model para ${name} (estende ${extendModel})
 */
export interface ${name} extends ${extendModel} {
  // Adicione seus campos customizados aqui
}
`;
  }
  
  return `/**
 * Interface ${name}
 *
 * @description Model para ${name}
 */
export interface ${name} {
  Id: number | string;
  Title: string;
  Created?: string;
  Modified?: string;
  Author?: {
    Title: string;
    EMail: string;
  };
  Editor?: {
    Title: string;
    EMail: string;
  };
  
  // Adicione seus campos customizados aqui
}
`;
};
