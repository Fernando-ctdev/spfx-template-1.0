// Exemplo de modelo de dados
// Adicione seus models aqui

export interface IUser {
  Id: number;
  Title: string;
  Email: string;
  LoginName?: string;
}

export interface IListItem {
  Id: number;
  Title: string;
  Created: string;
  Modified: string;
  AuthorId: number;
  EditorId: number;
}
