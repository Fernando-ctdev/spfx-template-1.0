/**
 * ===============================================
 * 🔑 FACTORY DE QUERY KEYS - TANSTACK QUERY
 * ===============================================
 * 
 * Padrão centralizado para QueryKeys do TanStack Query
 * Garante consistência e evita colisões de cache
 * 
 * Uso:
 *   const { data } = useQuery({
 *     queryKey: queryKeys.list('users', { status: 'active' }),
 *     queryFn: () => fetchUsers()
 *   });
 * 
 * ===============================================
 */

/**
 * Contexto base para todas as queries
 * Inclui tenant e site para isolamento de cache entre ambientes
 */
interface QueryContext {
  tenant?: string;
  siteUrl?: string;
}

// Contexto global (definido na inicialização)
let globalContext: QueryContext = {};

/**
 * Define o contexto global para as queries
 * Chamar uma vez na inicialização do app
 */
export const setQueryContext = (context: QueryContext): void => {
  globalContext = context;
};

/**
 * Factory de QueryKeys padronizadas
 * 
 * Estrutura: ['entity', context, ...params]
 * 
 * Exemplos:
 *   queryKeys.all('users')           -> ['users', { tenant, site }]
 *   queryKeys.list('users')          -> ['users', { tenant, site }, 'list']
 *   queryKeys.list('users', filter)  -> ['users', { tenant, site }, 'list', filter]
 *   queryKeys.detail('users', 1)     -> ['users', { tenant, site }, 'detail', 1]
 */
export const queryKeys = {
  /**
   * Key base para uma entidade (invalidar tudo da entidade)
   */
  all: (entity: string) => [entity, globalContext] as const,

  /**
   * Key para listagens
   * @param entity - Nome da entidade (ex: 'users', 'items')
   * @param filters - Filtros opcionais
   */
  list: (entity: string, filters?: Record<string, unknown>) => 
    [...queryKeys.all(entity), 'list', filters] as const,

  /**
   * Key para listagens paginadas
   */
  listPaginated: (entity: string, page: number, pageSize: number, filters?: Record<string, unknown>) =>
    [...queryKeys.all(entity), 'list', { page, pageSize, ...filters }] as const,

  /**
   * Key para detalhes de um item específico
   */
  detail: (entity: string, id: string | number) =>
    [...queryKeys.all(entity), 'detail', id] as const,

  /**
   * Key para usuário atual
   */
  currentUser: () => ['currentUser', globalContext] as const,

  /**
   * Key para configurações
   */
  config: (key: string) => ['config', globalContext, key] as const,

  /**
   * Key customizada para casos específicos
   */
  custom: (keys: unknown[]) => [...keys, globalContext] as const,
};

/**
 * Keys específicas para SharePoint Lists
 */
export const spQueryKeys = {
  /**
   * Key para itens de uma lista SharePoint
   */
  listItems: (listName: string, select?: string[], filter?: string) =>
    ['sp-list', globalContext, listName, { select, filter }] as const,

  /**
   * Key para item específico de uma lista
   */
  listItem: (listName: string, itemId: number) =>
    ['sp-list', globalContext, listName, 'item', itemId] as const,

  /**
   * Key para metadados de lista
   */
  listInfo: (listName: string) =>
    ['sp-list', globalContext, listName, 'info'] as const,

  /**
   * Key para campos de uma lista
   */
  listFields: (listName: string) =>
    ['sp-list', globalContext, listName, 'fields'] as const,

  /**
   * Key para usuários do site
   */
  siteUsers: (filter?: string) =>
    ['sp-users', globalContext, { filter }] as const,

  /**
   * Key para grupos do site
   */
  siteGroups: () =>
    ['sp-groups', globalContext] as const,

  /**
   * Key para permissões
   */
  permissions: (itemType: 'list' | 'item', listName: string, itemId?: number) =>
    ['sp-permissions', globalContext, itemType, listName, itemId] as const,
};

/**
 * Helpers para invalidação de cache
 */
export const invalidationKeys = {
  /**
   * Invalida todas as queries de uma entidade
   */
  allOf: (entity: string) => queryKeys.all(entity),

  /**
   * Invalida todas as listagens de uma entidade
   */
  listsOf: (entity: string) => [...queryKeys.all(entity), 'list'],

  /**
   * Invalida itens de uma lista SharePoint
   */
  spList: (listName: string) => ['sp-list', globalContext, listName],
};

export default queryKeys;
