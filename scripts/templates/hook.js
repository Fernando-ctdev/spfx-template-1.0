module.exports = (name) => `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSP } from '../../config/pnpConfig';

/**
 * Hook customizado ${name}
 * 
 * @description Hook para gerenciar dados do SharePoint com cache
 */
export const ${name} = <T = any>(listName: string, select: string[] = ['Id', 'Title', 'Created', 'Modified']) => {
  const sp = getSP();
  const queryClient = useQueryClient();

  // Query para buscar dados
  const {
    data: items,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['${name.replace('use', '').toLowerCase()}', listName],
    queryFn: async () => {
      const result = await sp.web.lists
        .getByTitle(listName)
        .items
        .select(...select)
        .top(5000)();
      return result as T[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para criar item
  const createMutation = useMutation({
    mutationFn: async (data: Partial<T>) => {
      const result = await sp.web.lists
        .getByTitle(listName)
        .items
        .add(data);
      return result.data as T;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${name.replace('use', '').toLowerCase()}', listName] });
    },
  });

  // Mutation para atualizar item
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<T> }) => {
      await sp.web.lists
        .getByTitle(listName)
        .items
        .getById(id)
        .update(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${name.replace('use', '').toLowerCase()}', listName] });
    },
  });

  // Mutation para deletar item
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await sp.web.lists
        .getByTitle(listName)
        .items
        .getById(id)
        .delete();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${name.replace('use', '').toLowerCase()}', listName] });
    },
  });

  return {
    items: items || [],
    loading,
    error: error ? String(error) : null,
    refetch,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
`;
