module.exports = (name, options) => {
    const { withSharePoint, crudInfo } = options || {};
    const hookName = crudInfo ? `use${name}` : '';
    const modelName = crudInfo ? `I${name}` : '';
    const listName = crudInfo?.listName || '';
    
    // Modos de operação
    const isFullCRUD = crudInfo && crudInfo.crudMode === 'crud';
    const isReadOnly = crudInfo && crudInfo.crudMode === 'read';

    // Imports base
    let imports = `import * as React from 'react';
import { FileText, Search, Filter${isFullCRUD ? ', Plus, Trash2, Edit' : ''} } from 'lucide-react';`;

    // Imports condicionais
    if (crudInfo) {
      imports += `
import { Spinner, SpinnerSize, MessageBar, MessageBarType${isFullCRUD ? ', IconButton, Dialog, DialogType, DialogFooter, PrimaryButton, DefaultButton' : ''} } from '@fluentui/react';
import { ${hookName} } from '../../../core/hooks/${hookName}';
import { ${modelName} } from '../../../models/${modelName}';`;
    } else if (withSharePoint) {
      imports += `
import { useListItems } from '../../../core/hooks/useSharePoint';
import { Spinner, SpinnerSize, MessageBar, MessageBarType, IconButton } from '@fluentui/react';
import { MoreHorizontal } from 'lucide-react';`;
    }

    const content = `
/**
 * Página ${name}
 * 
 * @description Página gerada automaticamente via CLI
 */
const ${name}: React.FC = () => {
${crudInfo ? `  // Hook CRUD gerado automaticamente
  const { 
    items, 
    loading, 
    error,${isFullCRUD ? `
    create, 
    update, 
    delete: remove,
    isCreating,
    isDeleting ` : ''}
  } = ${hookName}<${modelName}>('${listName}');

${isFullCRUD ? `  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<${modelName} | null>(null);` : ''}
  const [filterText, setFilterText] = React.useState('');

  // Filtragem local
  const filteredItems = React.useMemo(() => {
    if (!items) return [];
    if (!filterText) return items;
    return items.filter(i => i.Title.toLowerCase().includes(filterText.toLowerCase()));
  }, [items, filterText]);

${isFullCRUD ? `  const handleDeleteClick = (item: ${modelName}) => {
    setSelectedItem(item);
    setIsDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedItem) {
      await remove(selectedItem.Id);
      setIsDeleteDialogVisible(false);
      setSelectedItem(null);
    }
  };` : ''}` : withSharePoint ? `  // Exemplo de hook (descomente para usar)
  // const { items, loading, error } = useListItems('SitePages', ['Id', 'Title']);
  
  // Mock para visualização inicial (remova ao integrar)
  const loading = false;
  const error: string | null = null;
  const items = [1, 2, 3, 4, 5];` : ''}

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-600 flex items-center gap-2">
            <FileText className="text-blue-600 dark:text-blue-400" size={28} />
            ${name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestão de ${name}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
            <Filter size={16} />
            Filtrar
          </button>
          ${isFullCRUD ? `<button 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm text-sm font-medium"
            onClick={() => console.log('Implementar criação')}
            disabled={isCreating}
          >
            <Plus size={16} />
            Novo Item
          </button>` : ''}
        </div>
      </div>

      {/* Área de Conteúdo */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col">
        
        {/* Toolbar de Busca */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar em ${name}..." 
              value={${crudInfo ? 'filterText' : "''"}}
              onChange={${crudInfo ? '(e) => setFilterText(e.target.value)' : '() => {}'}}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="p-0">
          ${crudInfo || withSharePoint ? `{loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size={SpinnerSize.large} label="Carregando dados..." />
            </div>
          ) : error ? (
            <div className="p-6">
              <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-800/50">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Título</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Criado em</th>
                    ${isFullCRUD || withSharePoint ? `<th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Ações</th>` : ''}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {${crudInfo ? 'filteredItems' : 'items'}.map((item) => (
                    <tr key={typeof item === 'number' ? item : item.Id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">#{item.Id || item}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.Title || \`Item \${item}\`}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {${crudInfo ? 'item.Created ? new Date(item.Created).toLocaleDateString() : "-"' : '"Hoje"'}}
                      </td>
                      ${isFullCRUD || withSharePoint ? `<td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          ${isFullCRUD ? `<button className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <Edit size={16} />
                          </button>
                          <button 
                            className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <Trash2 size={16} />
                          </button>` : `<button className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <MoreHorizontal size={18} />
                          </button>`}
                        </div>
                      </td>` : ''}
                    </tr>
                  ))}
                  {${crudInfo ? 'filteredItems' : 'items'}.length === 0 && (
                    <tr>
                      <td colSpan={${isFullCRUD || withSharePoint ? 4 : 3}} className="px-6 py-12 text-center text-gray-500">
                        Nenhum item encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}` : `<div className="p-12 text-center">
            {/* ... Conteúdo vazio ... */}
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Comece por aqui</h3>
          </div>`}
        </div>
      </div>

      ${isFullCRUD ? `{/* Dialog de Confirmação de Exclusão */}
      <Dialog
        hidden={!isDeleteDialogVisible}
        onDismiss={() => setIsDeleteDialogVisible(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Confirmar exclusão',
          subText: \`Tem certeza que deseja excluir o item "\${selectedItem?.Title}"? Esta ação não pode ser desfeita.\`,
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={confirmDelete} text="Excluir" disabled={isDeleting} />
          <DefaultButton onClick={() => setIsDeleteDialogVisible(false)} text="Cancelar" />
        </DialogFooter>
      </Dialog>` : ''}
    </div>
  );
};

export default ${name};
`;
    return imports + content;
  };
