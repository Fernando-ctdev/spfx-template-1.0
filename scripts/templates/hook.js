module.exports = (name, options = {}) => {
  const { models = [], serviceName = null } = options || {};
  const hasModels = models && models.length > 0;
  const hasService = serviceName;
  
  // Gerar imports dos models
  let modelImports = '';
  if (hasModels) {
    modelImports = models.map(model => 
      `import { ${model} } from '../../models/${model}';`
    ).join('\n');
  }
  
  // Gerar import do serviço
  let serviceImport = '';
  if (hasService) {
    serviceImport = `import { ${serviceName} } from '../services/${serviceName}';`;
  }
  
  // Gerar tipos para os models
  let modelTypes = '';
  if (hasModels) {
    const modelTypeList = models.join(' | ');
    modelTypes = `<T = ${modelTypeList}>`;
  } else {
    modelTypes = '<T = any>';
  }
  
  // Gerar comentário de documentação dos models
  let modelsDoc = '';
  if (hasModels) {
    modelsDoc = `\n * @models Models expostos: ${models.join(', ')}`;
  }
  
  // Gerar comentário de documentação do serviço
  let serviceDoc = '';
  if (hasService) {
    serviceDoc = `\n * @service Serviço injetado: ${serviceName}`;
  }
  
  // Gerar código de injeção do serviço
  let serviceInjection = '';
  let serviceUsage = '';
  if (hasService) {
    serviceInjection = `
  // Injeção do serviço ${serviceName}
  const service = ${serviceName};`;
    serviceUsage = `
      // Usar o serviço injetado para operações
      // Exemplo: await service.getAll(listName, select)`;
  }
  
  return `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSP } from '../../config/pnpConfig';${modelImports ? '\n' + modelImports : ''}${serviceImport ? '\n' + serviceImport : ''}

/**
 * Hook customizado ${name}
 * 
 * @description Hook para gerenciar dados do SharePoint com cache${modelsDoc}${serviceDoc}
 */
export const ${name} = ${modelTypes}(listName: string, select: string[] = ['Id', 'Title', 'Created', 'Modified']) => {
  const sp = getSP();
  const queryClient = useQueryClient();${serviceInjection}

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
        .top(5000)();${serviceUsage}
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
};
