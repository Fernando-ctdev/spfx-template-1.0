module.exports = (name, options) => {
    const { withSharePoint, crudInfo } = options || {};
    const hookName = crudInfo ? `use${name}` : '';
    const modelName = crudInfo ? `I${name}` : '';
    const listName = crudInfo?.listName || '';
    
    const isFullCRUD = crudInfo && crudInfo.crudMode === 'crud';
    const isReadOnly = crudInfo && crudInfo.crudMode === 'read';

    let imports = `import * as React from 'react';
import { FileText, Search, Filter, Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import { AppButton, AppInput, AppModal, AppTable } from '../../core/ui';`;

    if (crudInfo) {
      imports += `
import { Spinner, MessageBar, DialogTrigger } from '@fluentui/react-components';
import { ${hookName} } from '../../../core/hooks/${hookName}';
import { ${modelName} } from '../../../models/${modelName}';`;
    } else if (withSharePoint) {
      imports += `
import { Spinner, MessageBar } from '@fluentui/react-components';
import { useListItems } from '../../../core/hooks/useSharePoint';`;
    }

    const content = `
export const ${name}: React.FC = () => {
${crudInfo ? `  const { 
    items, 
    loading, 
    error,${isFullCRUD ? `
    create, 
    update, 
    delete: remove,
    isCreating,
    isDeleting ` : ''}
  } = ${hookName}<${modelName}>('${listName}');` : withSharePoint ? `  const { items, loading, error } = useListItems('SitePages', ['Id', 'Title']);` : `  const loading = false;
  const error: string | null = null;
  const items = [];`}

${isFullCRUD ? `  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = React.useState(false);
  const [isCreateDialogVisible, setIsCreateDialogVisible] = React.useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<${modelName} | null>(null);
  const [newItemTitle, setNewItemTitle] = React.useState('');
  const [editingItemTitle, setEditingItemTitle] = React.useState('');` : ''}

  const [filterText, setFilterText] = React.useState('');

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
  };

  const handleCreate = async () => {
    if (!newItemTitle.trim()) return;
    await create({ Title: newItemTitle });
    setIsCreateDialogVisible(false);
    setNewItemTitle('');
  };

  const handleEditClick = (item: ${modelName}) => {
    setSelectedItem(item);
    setEditingItemTitle(item.Title);
    setIsEditDialogVisible(true);
  };

  const handleUpdate = async () => {
    if (!selectedItem || !editingItemTitle.trim()) return;
    await update({ id: selectedItem.Id, data: { Title: editingItemTitle } });
    setIsEditDialogVisible(false);
    setSelectedItem(null);
    setEditingItemTitle('');
  };` : ''}

${crudInfo || withSharePoint ? `  const columns = React.useMemo(() => [
    {
      key: 'id',
      name: 'ID',
      fieldName: 'Id',
      minWidth: 80,
      maxWidth: 100,
    },
    {
      key: 'title',
      name: 'Título',
      fieldName: 'Title',
      minWidth: 200,
      isResizable: true,
    },
    {
      key: 'created',
      name: 'Criado em',
      fieldName: 'Created',
      minWidth: 150,
      onRender: (item: any) => item.Created ? new Date(item.Created).toLocaleDateString() : '-',
    },
    ${isFullCRUD || withSharePoint ? `{
      key: 'actions',
      name: 'Ações',
      minWidth: 100,
      onRender: (item: ${crudInfo ? modelName : 'any'}) => (
        <div className="flex gap-2 justify-end">
          ${isFullCRUD ? `<button
            onClick={() => handleEditClick(item)}
            title="Editar"
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(item)}
            title="Excluir"
            className="p-2 hover:bg-red-50 rounded"
          >
            <Trash2 size={16} />
          </button>` : `<button
            onClick={() => console.log('Mais opções:', item)}
            title="Mais opções"
            className="p-2 hover:bg-gray-100 rounded"
          >
            <MoreVertical size={16} />
          </button>`}
        </div>
      ),` : ''}
  ], []);` : ''}

  return (
    <div className="space-y-6 animate-fade-in">
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
        
        <div className="flex flex-wrap items-center gap-2">
          <AppButton
            icon={<Filter size={16} />}
            text="Filtrar"
          />
          ${isFullCRUD ? `<AppButton
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsCreateDialogVisible(true)}
            disabled={isCreating}
            text="Novo Item"
          />` : ''}
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col">
        
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 w-full sm:max-w-md">
            <AppInput
              placeholder="Buscar em ${name}..."
              value=${crudInfo ? 'filterText' : "''"}
              onChange=${crudInfo ? '(e, value) => setFilterText(value || "")' : '() => {}'}
              icon={<Search size={16} />}
              fullWidth
            />
          </div>
        </div>

        <div className="p-0">
          ${crudInfo || withSharePoint ? `{loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="large" label="Carregando dados..." />
            </div>
          ) : error ? (
            <div className="p-6">
              <MessageBar intent="error">{error}</MessageBar>
            </div>
          ) : (
            <>
              <AppTable
                items=${crudInfo ? 'filteredItems' : 'items'}
                columns={columns}
              />
              ${crudInfo ? `{filteredItems.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  Nenhum item encontrado.
                </div>
              )}` : `{items.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  Nenhum item encontrado.
                </div>
              )}`}
            </>
          )}` : `<div className="p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Comece por aqui</h3>
          </div>`}
        </div>
      </div>

      ${isFullCRUD ? `<AppModal
        isOpen={isCreateDialogVisible}
        onDismiss={() => setIsCreateDialogVisible(false)}
        title="Novo Item"
      >
        <AppInput
          label="Título"
          value={newItemTitle}
          onChange={(e, value) => setNewItemTitle(value || '')}
          placeholder="Digite o título do item"
          required
          fullWidth
        />
        <DialogActions>
          <AppButton
            variant="primary"
            onClick={handleCreate}
            text="Salvar"
            disabled={isCreating || !newItemTitle.trim()}
            fullWidth
          />
          <AppButton
            onClick={() => setIsCreateDialogVisible(false)}
            text="Cancelar"
            fullWidth
          />
        </DialogActions>
      </AppModal>

      <AppModal
        isOpen={isEditDialogVisible}
        onDismiss={() => setIsEditDialogVisible(false)}
        title="Editar Item"
      >
        <AppInput
          label="Título"
          value={editingItemTitle}
          onChange={(e, value) => setEditingItemTitle(value || '')}
          placeholder="Digite o título do item"
          required
          fullWidth
        />
        <DialogActions>
          <AppButton
            variant="primary"
            onClick={handleUpdate}
            text="Salvar"
            disabled={!editingItemTitle.trim()}
            fullWidth
          />
          <AppButton
            onClick={() => setIsEditDialogVisible(false)}
            text="Cancelar"
            fullWidth
          />
        </DialogActions>
      </AppModal>

      <AppModal
        isOpen={isDeleteDialogVisible}
        onDismiss={() => setIsDeleteDialogVisible(false)}
        title="Confirmar exclusão"
        subText={\`Tem certeza que deseja excluir o item "\${selectedItem?.Title}"? Esta ação não pode ser desfeita.\`}
      >
        <DialogActions>
          <AppButton
            variant="danger"
            onClick={confirmDelete}
            text="Excluir"
            disabled={isDeleting}
            fullWidth
          />
          <AppButton
            onClick={() => setIsDeleteDialogVisible(false)}
            text="Cancelar"
            fullWidth
          />
        </DialogActions>
      </AppModal>` : ''}
    </div>
  );
};

export default ${name};
`;
    return imports + content;
  };