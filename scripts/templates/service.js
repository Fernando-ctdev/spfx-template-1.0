module.exports = (name) => `import { getSP } from '../../config/pnpConfig';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/batching';

/**
 * ${name}
 * 
 * @description Serviço para operações relacionadas a ${name.replace('Service', '')}
 */
export class ${name} {
  private static sp = getSP();

  /**
   * Verifica se a lista existe no site
   * @param listName Nome da lista
   */
  private static async ensureListExists(listName: string): Promise<void> {
    try {
      await this.sp.web.lists.getByTitle(listName).select('Id')();
    } catch (error) {
      console.error(\`🚨 ERRO CRÍTICO: A lista '\${listName}' não foi encontrada no site SharePoint.\`);
      console.error('Verifique se o nome está correto ou se a lista já foi criada.');
      throw new Error(\`Lista '\${listName}' não encontrada.\`);
    }
  }

  /**
   * Obtém todos os itens
   * @param listName Nome da lista do SharePoint
   * @param select Campos a serem retornados
   * @returns Promise com array de itens
   */
  public static async getAll<T = any>(
    listName: string,
    select: string[] = ['Id', 'Title']
  ): Promise<T[]> {
    try {
      // Validação de desenvolvimento (pode ser removida em prod se desejar performance máxima)
      if (process.env.NODE_ENV === 'development') {
        await this.ensureListExists(listName);
      }

      const items = await this.sp.web.lists
        .getByTitle(listName)
        .items
        .select(...select)
        .top(5000)();
      
      return items as T[];
    } catch (error) {
      console.error(\`Erro ao buscar itens de \${listName}:\`, error);
      throw error;
    }
  }

  /**
   * Obtém um item por ID
   * @param listName Nome da lista do SharePoint
   * @param id ID do item
   * @param select Campos a serem retornados
   * @returns Promise com o item
   */
  public static async getById<T = any>(
    listName: string,
    id: number,
    select: string[] = ['Id', 'Title']
  ): Promise<T> {
    try {
      const item = await this.sp.web.lists
        .getByTitle(listName)
        .items
        .getById(id)
        .select(...select)();
      
      return item as T;
    } catch (error) {
      console.error(\`Erro ao buscar item \${id} de \${listName}:\`, error);
      throw error;
    }
  }

  /**
   * Cria um novo item
   * @param listName Nome da lista do SharePoint
   * @param data Dados do item a ser criado
   * @returns Promise com o item criado
   */
  public static async create<T = any>(
    listName: string,
    data: Partial<T>
  ): Promise<T> {
    try {
      const result = await this.sp.web.lists
        .getByTitle(listName)
        .items
        .add(data);
      
      return result.data as T;
    } catch (error) {
      console.error(\`Erro ao criar item em \${listName}:\`, error);
      throw error;
    }
  }

  /**
   * Atualiza um item existente
   * @param listName Nome da lista do SharePoint
   * @param id ID do item
   * @param data Dados a serem atualizados
   * @returns Promise com o item atualizado
   */
  public static async update<T = any>(
    listName: string,
    id: number,
    data: Partial<T>
  ): Promise<T> {
    try {
      await this.sp.web.lists
        .getByTitle(listName)
        .items
        .getById(id)
        .update(data);
      
      return this.getById<T>(listName, id);
    } catch (error) {
      console.error(\`Erro ao atualizar item \${id} em \${listName}:\`, error);
      throw error;
    }
  }

  /**
   * Deleta um item
   * @param listName Nome da lista do SharePoint
   * @param id ID do item
   * @returns Promise void
   */
  public static async delete(
    listName: string,
    id: number
  ): Promise<void> {
    try {
      await this.sp.web.lists
        .getByTitle(listName)
        .items
        .getById(id)
        .delete();
    } catch (error) {
      console.error(\`Erro ao deletar item \${id} de \${listName}:\`, error);
      throw error;
    }
  }
}
`;
