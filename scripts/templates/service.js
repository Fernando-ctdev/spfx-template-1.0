module.exports = (name, options = {}) => {
  const { listName = '', modelName = null, serviceType = 'crud' } = options || {};
  const hasDefaultList = listName && listName.length > 0;
  const hasModel = modelName;
  const isReadOnly = serviceType === 'readonly';
  
  let imports = `import { getSP } from '../../config/pnpConfig';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/batching';`;
  
  if (hasModel) {
    imports += `
import { ${modelName} } from '../../models/${modelName}';`;
  }
  
  let classContent = `export class ${name} {
  private static sp = getSP();${hasDefaultList ? `
  
  /**
   * Nome da lista SharePoint padrão para este serviço
   */
  public static readonly DEFAULT_LIST_NAME = '${listName}';` : ''}`;
  
  if (hasModel) {
    classContent += `
  
  /**
   * Model TypeScript associado a este serviço
   */
  public static readonly MODEL_NAME = '${modelName}';`;
  }
  
  // Métodos de leitura (sempre gerados)
  const readMethods = `

  /**
   * Verifica se a lista existe no site (não-bloqueante em geração)
   * @param listName Nome da lista
   */
  private static async ensureListExists(listName: string): Promise<boolean> {
    try {
      await this.sp.web.lists.getByTitle(listName).select('Id')();
      return true;
    } catch (error) {
      console.warn(\`⚠️ AVISO: A lista '\${listName}' não foi encontrada no site SharePoint.\`);
      console.warn('Verifique se o nome está correto ou se a lista já foi criada antes de usar este serviço.');
      return false;
    }
  }

  /**
   * Obtém todos os itens
   * @param listName Nome da lista do SharePoint${hasDefaultList ? ` (opcional, usa padrão: ${listName})` : ''}
   * @param select Campos a serem retornados
   * @returns Promise com array de itens${hasModel ? ` (${modelName}[])` : ''}
   */
  public static async getAll${hasModel ? `<T = ${modelName}>` : `<T = any>`}(
    ${hasDefaultList ? `listName?: string,` : `listName: string,`}
    select: string[] = ['Id', 'Title'],
    validateList: boolean = true
  ): Promise<T[]> {
    try {
      // Usa lista padrão se não fornecida
      const targetListName = ${hasDefaultList ? `listName || this.DEFAULT_LIST_NAME;` : `listName;`}
      
      // Validação opcional da lista em desenvolvimento
      if (validateList && process.env.NODE_ENV === 'development') {
        await this.ensureListExists(targetListName);
      }

      const items = await this.sp.web.lists
        .getByTitle(targetListName)
        .items
        .select(...select)
        .top(5000)();
      
      return items as T[];
    } catch (error) {
      console.error(\`Erro ao buscar itens de \${${hasDefaultList ? `listName || this.DEFAULT_LIST_NAME` : `listName`}}:\`, error);
      throw error;
    }
  }

  /**
   * Obtém um item por ID
   * @param listName Nome da lista do SharePoint${hasDefaultList ? ` (opcional, usa padrão: ${listName})` : ''}
   * @param id ID do item
   * @param select Campos a serem retornados
   * @returns Promise com o item${hasModel ? ` (${modelName})` : ''}
   */
  public static async getById${hasModel ? `<T = ${modelName}>` : `<T = any>`}(
    ${hasDefaultList ? `listName: string | undefined,` : `listName: string,`}
    id: number,
    select: string[] = ['Id', 'Title']
  ): Promise<T> {
    try {
      // Usa lista padrão se não fornecida
      const targetListName = ${hasDefaultList ? `listName || this.DEFAULT_LIST_NAME;` : `listName;`}
      
      const item = await this.sp.web.lists
        .getByTitle(targetListName)
        .items
        .getById(id)
        .select(...select)();
      
      return item as T;
    } catch (error) {
      console.error(\`Erro ao buscar item \${id} de \${${hasDefaultList ? `listName || this.DEFAULT_LIST_NAME` : `listName`}}:\`, error);
      throw error;
    }
  }`;

  // Métodos CRUD (apenas quando não é readonly)
  const crudMethods = `

  /**
   * Cria um novo item
   * @param listName Nome da lista do SharePoint${hasDefaultList ? ` (opcional, usa padrão: ${listName})` : ''}
   * @param data Dados do item a ser criado
   * @returns Promise com o item criado${hasModel ? ` (${modelName})` : ''}
   */
  public static async create${hasModel ? `<T = ${modelName}>` : `<T = any>`}(
    ${hasDefaultList ? `listName?: string,` : `listName: string,`}
    data: Partial<T>
  ): Promise<T> {
    try {
      // Usa lista padrão se não fornecida
      const targetListName = ${hasDefaultList ? `listName || this.DEFAULT_LIST_NAME;` : `listName;`}
      
      const result = await this.sp.web.lists
        .getByTitle(targetListName)
        .items
        .add(data);
      
      return result.data as T;
    } catch (error) {
      console.error(\`Erro ao criar item em \${${hasDefaultList ? `listName || this.DEFAULT_LIST_NAME` : `listName`}}:\`, error);
      throw error;
    }
  }

  /**
   * Atualiza um item existente
   * @param listName Nome da lista do SharePoint${hasDefaultList ? ` (opcional, usa padrão: ${listName})` : ''}
   * @param id ID do item
   * @param data Dados a serem atualizados
   * @returns Promise com o item atualizado${hasModel ? ` (${modelName})` : ''}
   */
  public static async update${hasModel ? `<T = ${modelName}>` : `<T = any>`}(
    ${hasDefaultList ? `listName: string | undefined,` : `listName: string,`}
    id: number,
    data: Partial<T>
  ): Promise<T> {
    try {
      // Usa lista padrão se não fornecida
      const targetListName = ${hasDefaultList ? `listName || this.DEFAULT_LIST_NAME;` : `listName;`}
      
      await this.sp.web.lists
        .getByTitle(targetListName)
        .items
        .getById(id)
        .update(data);
      
      return this.getById<T>(targetListName, id);
    } catch (error) {
      console.error(\`Erro ao atualizar item \${id} em \${${hasDefaultList ? `listName || this.DEFAULT_LIST_NAME` : `listName`}}:\`, error);
      throw error;
    }
  }

  /**
   * Deleta um item
   * @param listName Nome da lista do SharePoint${hasDefaultList ? ` (opcional, usa padrão: ${listName})` : ''}
   * @param id ID do item
   * @returns Promise void
   */
  public static async delete(
    ${hasDefaultList ? `listName: string | undefined,` : `listName: string,`}
    id: number
  ): Promise<void> {
    try {
      // Usa lista padrão se não fornecida
      const targetListName = ${hasDefaultList ? `listName || this.DEFAULT_LIST_NAME;` : `listName;`}
      
      await this.sp.web.lists
        .getByTitle(targetListName)
        .items
        .getById(id)
        .delete();
    } catch (error) {
      console.error(\`Erro ao deletar item \${id} de \${${hasDefaultList ? `listName || this.DEFAULT_LIST_NAME` : `listName`}}:\`, error);
      throw error;
    }
  }`;

  return `${imports}

/**
 * ${name}
 *
 * @description Serviço para operações relacionadas a ${name.replace('Service', '')}
${hasDefaultList ? ` * @defaultListName Lista SharePoint padrão: ${listName}` : ''}
${hasModel ? ` * @model Model TypeScript: ${modelName}` : ''}
${isReadOnly ? ` * @type Apenas leitura (métodos: getAll, getById)` : ` * @type CRUD completo (métodos: getAll, getById, create, update, delete)`}
 */
${classContent}${readMethods}${isReadOnly ? '' : crudMethods}
}
`;
};
