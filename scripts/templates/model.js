module.exports = (name) => `/**
 * Interface ${name}
 * 
 * @description Model para ${name}
 */
export interface ${name} {
  Id: number;
  Title: string;
  Created?: Date;
  Modified?: Date;
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
