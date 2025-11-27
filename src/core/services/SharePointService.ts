import { getSP } from '../../config/pnpConfig';
import { IUser } from '../../models';

/**
 * Serviço de exemplo para operações com SharePoint
 * Use como base para criar seus próprios serviços
 */
export class SharePointService {
  
  /**
   * Obtém o usuário atual
   */
  public static async getCurrentUser(): Promise<IUser | null> {
    try {
      const sp = getSP();
      if (!sp) return null;
      
      const user = await sp.web.currentUser();
      return {
        Id: user.Id,
        Title: user.Title,
        Email: user.Email,
        LoginName: user.LoginName
      };
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }

  /**
   * Obtém itens de uma lista
   * @param listName Nome da lista
   * @param select Campos a serem selecionados
   * @param filter Filtro OData (opcional)
   * @param top Quantidade máxima de itens (padrão: 100)
   */
  public static async getListItems<T>(
    listName: string,
    select: string[] = ['Id', 'Title'],
    filter?: string,
    top: number = 100
  ): Promise<T[]> {
    try {
      const sp = getSP();
      if (!sp) return [];

      let query = sp.web.lists.getByTitle(listName).items
        .select(...select)
        .top(top);

      if (filter) {
        query = query.filter(filter);
      }

      return await query();
    } catch (error) {
      console.error(`Erro ao obter itens da lista ${listName}:`, error);
      return [];
    }
  }

  /**
   * Cria um item em uma lista
   * @param listName Nome da lista
   * @param item Dados do item
   */
  public static async createListItem<T>(listName: string, item: Partial<T>): Promise<T | null> {
    try {
      const sp = getSP();
      if (!sp) return null;

      const result = await sp.web.lists.getByTitle(listName).items.add(item as any);
      return result as T;
    } catch (error) {
      console.error(`Erro ao criar item na lista ${listName}:`, error);
      return null;
    }
  }

  /**
   * Atualiza um item em uma lista
   * @param listName Nome da lista
   * @param itemId ID do item
   * @param item Dados atualizados
   */
  public static async updateListItem<T>(
    listName: string,
    itemId: number,
    item: Partial<T>
  ): Promise<boolean> {
    try {
      const sp = getSP();
      if (!sp) return false;

      await sp.web.lists.getByTitle(listName).items.getById(itemId).update(item as any);
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar item ${itemId} na lista ${listName}:`, error);
      return false;
    }
  }

  /**
   * Deleta um item de uma lista
   * @param listName Nome da lista
   * @param itemId ID do item
   */
  public static async deleteListItem(listName: string, itemId: number): Promise<boolean> {
    try {
      const sp = getSP();
      if (!sp) return false;

      await sp.web.lists.getByTitle(listName).items.getById(itemId).delete();
      return true;
    } catch (error) {
      console.error(`Erro ao deletar item ${itemId} na lista ${listName}:`, error);
      return false;
    }
  }
}
