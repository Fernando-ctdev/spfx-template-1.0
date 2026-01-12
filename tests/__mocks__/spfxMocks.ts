/**
 * ===============================================
 * 🧪 MOCKS DO SPFX PARA TESTES
 * ===============================================
 * 
 * Mocks para simular o contexto do SharePoint em testes unitários
 * 
 * Uso:
 *   import { mockSPFxContext, mockPnPjs } from '../__mocks__/spfxMocks';
 *   
 *   beforeEach(() => {
 *     mockPnPjs();
 *   });
 * 
 * ===============================================
 */

import { WebPartContext } from '@microsoft/sp-webpart-base';

/**
 * Mock do contexto SPFx WebPart
 */
export const mockSPFxContext: Partial<WebPartContext> = {
  pageContext: {
    web: {
      absoluteUrl: 'https://contoso.sharepoint.com/sites/test',
      serverRelativeUrl: '/sites/test',
      title: 'Test Site',
      id: { toString: () => '00000000-0000-0000-0000-000000000001' },
    },
    user: {
      displayName: 'Test User',
      email: 'test@contoso.com',
      loginName: 'test@contoso.com',
    },
    site: {
      absoluteUrl: 'https://contoso.sharepoint.com',
      serverRelativeUrl: '/',
      id: { toString: () => '00000000-0000-0000-0000-000000000002' },
    },
    list: undefined,
    listItem: undefined,
    legacyPageContext: {},
  } as any,
  serviceScope: {} as any,
  sdks: {
    microsoftTeams: undefined,
  } as any,
};

/**
 * Mock do usuário atual
 */
export const mockCurrentUser = {
  Id: 1,
  Title: 'Test User',
  Email: 'test@contoso.com',
  LoginName: 'i:0#.f|membership|test@contoso.com',
};

/**
 * Mock de itens de lista genéricos
 */
export const mockListItems = [
  { Id: 1, Title: 'Item 1', Status: 'Active' },
  { Id: 2, Title: 'Item 2', Status: 'Inactive' },
  { Id: 3, Title: 'Item 3', Status: 'Active' },
];

/**
 * Factory para criar mock de itens personalizados
 */
export const createMockItems = <T>(
  count: number,
  generator: (index: number) => T
): T[] => {
  return Array.from({ length: count }, (_, i) => generator(i + 1));
};

/**
 * Mock do PnPjs SP
 * Usar com jest.mock ou importar no setupTests
 */
export const mockPnPjsSP = {
  web: {
    currentUser: jest.fn().mockResolvedValue(mockCurrentUser),
    lists: {
      getByTitle: jest.fn().mockReturnValue({
        items: {
          select: jest.fn().mockReturnThis(),
          filter: jest.fn().mockReturnThis(),
          top: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          expand: jest.fn().mockReturnThis(),
          getById: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue(mockListItems[0]),
            update: jest.fn().mockResolvedValue({}),
            delete: jest.fn().mockResolvedValue({}),
          }),
          add: jest.fn().mockResolvedValue({ data: { Id: 999, Title: 'New Item' } }),
          // Chamada final retorna os itens
          [Symbol.asyncIterator]: async function* () {
            yield* mockListItems;
          },
        },
        fields: {
          select: jest.fn().mockReturnThis(),
        },
      }),
    },
    siteUsers: {
      getById: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockCurrentUser),
      }),
    },
  },
};

/**
 * Setup completo do mock PnPjs
 * Chamar no beforeEach ou setupTests.ts
 */
export const setupPnPjsMock = (): void => {
  // Mock do módulo pnpConfig
  jest.mock('../../config/pnpConfig', () => ({
    getSP: jest.fn(() => mockPnPjsSP),
  }));
};

/**
 * Mock para simular erro de rede
 */
export const mockNetworkError = (): void => {
  mockPnPjsSP.web.currentUser.mockRejectedValue(new Error('Network error'));
  mockPnPjsSP.web.lists.getByTitle('').items.mockRejectedValue(new Error('Network error'));
};

/**
 * Mock para simular permissão negada
 */
export const mockPermissionDenied = (): void => {
  const error = new Error('Access denied');
  (error as any).status = 403;
  mockPnPjsSP.web.lists.getByTitle('').items.mockRejectedValue(error);
};

/**
 * Reset de todos os mocks
 */
export const resetAllMocks = (): void => {
  jest.clearAllMocks();
  mockPnPjsSP.web.currentUser.mockResolvedValue(mockCurrentUser);
};

/**
 * Helper para aguardar promises pendentes em testes
 */
export const flushPromises = (): Promise<void> => 
  new Promise(resolve => setImmediate(resolve));

/**
 * Mock do window.location para testes de roteamento
 */
export const mockWindowLocation = (url: string): void => {
  const location = new URL(url);
  Object.defineProperty(window, 'location', {
    value: {
      href: location.href,
      origin: location.origin,
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
    },
    writable: true,
  });
};

export default {
  mockSPFxContext,
  mockCurrentUser,
  mockListItems,
  mockPnPjsSP,
  setupPnPjsMock,
  resetAllMocks,
  flushPromises,
  mockWindowLocation,
};
