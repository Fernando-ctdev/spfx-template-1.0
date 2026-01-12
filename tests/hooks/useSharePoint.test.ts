/**
 * ===============================================
 * 🧪 EXEMPLO DE TESTE - useSharePoint Hook
 * ===============================================
 * 
 * Demonstra como testar hooks que usam PnPjs
 * 
 * Executar: npm test
 * ===============================================
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useCurrentUser, useListItems } from '../../src/core/hooks/useSharePoint';
import { 
  mockPnPjsSP, 
  mockCurrentUser, 
  mockListItems,
  resetAllMocks 
} from '../__mocks__/spfxMocks';

// Mock do módulo pnpConfig
jest.mock('../../src/config/pnpConfig', () => ({
  getSP: jest.fn(() => mockPnPjsSP),
}));

describe('useSharePoint Hooks', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe('useCurrentUser', () => {
    it('deve retornar o usuário atual com sucesso', async () => {
      const { result } = renderHook(() => useCurrentUser());

      // Inicialmente loading
      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeNull();

      // Aguarda resolução
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verifica dados do usuário
      expect(result.current.user).toEqual(mockCurrentUser);
      expect(result.current.error).toBeNull();
    });

    it('deve tratar erro quando SP não está inicializado', async () => {
      // Simula SP não inicializado
      jest.mock('../../src/config/pnpConfig', () => ({
        getSP: jest.fn(() => null),
      }));

      const { result } = renderHook(() => useCurrentUser());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
    });

    it('deve tratar erro de rede', async () => {
      mockPnPjsSP.web.currentUser.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useCurrentUser());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.message).toBe('Network error');
    });
  });

  describe('useListItems', () => {
    it('deve retornar itens da lista com sucesso', async () => {
      // Configura mock para retornar itens
      mockPnPjsSP.web.lists.getByTitle.mockReturnValue({
        items: {
          select: jest.fn().mockReturnThis(),
          filter: jest.fn().mockReturnThis(),
          top: jest.fn().mockResolvedValue(mockListItems),
        },
      });

      const { result } = renderHook(() => 
        useListItems('TestList', ['Id', 'Title'])
      );

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.items).toHaveLength(3);
      expect(result.current.error).toBeNull();
    });

    it('deve aplicar filtro OData corretamente', async () => {
      const filterMock = jest.fn().mockReturnThis();
      mockPnPjsSP.web.lists.getByTitle.mockReturnValue({
        items: {
          select: jest.fn().mockReturnThis(),
          filter: filterMock,
          top: jest.fn().mockResolvedValue(mockListItems.filter(i => i.Status === 'Active')),
        },
      });

      const { result } = renderHook(() => 
        useListItems('TestList', ['Id', 'Title', 'Status'], "Status eq 'Active'")
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(filterMock).toHaveBeenCalledWith("Status eq 'Active'");
    });

    it('deve permitir refetch manual', async () => {
      let callCount = 0;
      mockPnPjsSP.web.lists.getByTitle.mockReturnValue({
        items: {
          select: jest.fn().mockReturnThis(),
          filter: jest.fn().mockReturnThis(),
          top: jest.fn().mockImplementation(() => {
            callCount++;
            return Promise.resolve(mockListItems);
          }),
        },
      });

      const { result } = renderHook(() => useListItems('TestList'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(callCount).toBe(1);

      // Chama refetch
      await result.current.refetch();

      expect(callCount).toBe(2);
    });
  });
});
