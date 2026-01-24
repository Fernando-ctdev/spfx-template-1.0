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
import { FileText } from 'lucide-react';
import { DefaultButton, TextField } from '@fluentui/react';`;

    // Imports condicionais
    if (crudInfo) {
      imports += `
import { Spinner, SpinnerSize, MessageBar, MessageBarType, PrimaryButton, DetailsList, SelectionMode, Dialog, DialogType, DialogFooter${isFullCRUD ? ', IconButton' : ''} } from '@fluentui/react';
import { ${hookName} } from '../../../core/hooks/${hookName}';
import { ${modelName} } from '../../../models/${modelName}';`;
    } else if (withSharePoint) {
      imports += `
import { useListItems } from '../../../core/hooks/useSharePoint';
import { Spinner, SpinnerSize, MessageBar, MessageBarType, DetailsList, SelectionMode, IconButton } from '@fluentui/react';`;
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
  const [isCreateDialogVisible, setIsCreateDialogVisible] = React.useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<${modelName} | null>(null);
  const [newItemTitle, setNewItemTitle] = React.useState('');
  const [editingItemTitle, setEditingItemTitle] = React.useState('');` : ''}
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

${crudInfo || withSharePoint ? `  // Colunas para DetailsList
  const columns = React.useMemo(() => [
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
          ${isFullCRUD ? `<IconButton
            iconProps={{ iconName: 'Edit' }}
            onClick={() => handleEditClick(item)}
            title="Editar"
          />
          <IconButton
            iconProps={{ iconName: 'Delete' }}
            onClick={() => handleDeleteClick(item)}
            title="Excluir"
          />` : `<IconButton
            iconProps={{ iconName: 'More' }}
            onClick={() => console.log('Mais opções:', item)}
            title="Mais opções"
          />`}
        </div>
      ),
    },` : ''}
  ], []);` : ''}` : withSharePoint ? `  // Exemplo de hook (descomente para usar)
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
          <DefaultButton iconProps={{ iconName: 'Filter' }}>
            Filtrar
          </DefaultButton>
          ${isFullCRUD ? `<PrimaryButton
            iconProps={{ iconName: 'Add' }}
            onClick={() => setIsCreateDialogVisible(true)}
            disabled={isCreating}
          >
            Novo Item
          </PrimaryButton>` : ''}
        </div>
      </div>

      {/* Área de Conteúdo */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col">
        
        {/* Toolbar de Busca */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <TextField
              placeholder="Buscar em ${name}..."
              value={${crudInfo ? 'filterText' : "''"}}
              onChange={${crudInfo ? '(e, value) => setFilterText(value || "")' : '() => {}'}}
              iconProps={{ iconName: 'Search' }}
              underlined
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
              <DetailsList
                items={${crudInfo ? 'filteredItems' : 'items'}}
                columns={columns}
                selectionMode={SelectionMode.none}
                compact={true}
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
            </div>
          )}` : `<div className="p-12 text-center">
            {/* ... Conteúdo vazio ... */}
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Comece por aqui</h3>
          </div>`}
        </div>
      </div>

      ${isFullCRUD ? `{/* Dialog de Criação */}
      <Dialog
        hidden={!isCreateDialogVisible}
        onDismiss={() => setIsCreateDialogVisible(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Novo Item',
        }}
      >
        <TextField
          label="Título"
          value={newItemTitle}
          onChange={(e, value) => setNewItemTitle(value || '')}
          placeholder="Digite o título do item"
          required
        />
        <DialogFooter>
          <PrimaryButton onClick={handleCreate} text="Salvar" disabled={isCreating || !newItemTitle.trim()} />
          <DefaultButton onClick={() => setIsCreateDialogVisible(false)} text="Cancelar" />
        </DialogFooter>
      </Dialog>

      {/* Dialog de Edição */}
      <Dialog
        hidden={!isEditDialogVisible}
        onDismiss={() => setIsEditDialogVisible(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Editar Item',
        }}
      >
        <TextField
          label="Título"
          value={editingItemTitle}
          onChange={(e, value) => setEditingItemTitle(value || '')}
          placeholder="Digite o título do item"
          required
        />
        <DialogFooter>
          <PrimaryButton onClick={handleUpdate} text="Salvar" disabled={!editingItemTitle.trim()} />
          <DefaultButton onClick={() => setIsEditDialogVisible(false)} text="Cancelar" />
        </DialogFooter>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
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
