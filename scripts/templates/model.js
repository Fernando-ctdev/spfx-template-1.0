module.exports = (name) => `/**
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
