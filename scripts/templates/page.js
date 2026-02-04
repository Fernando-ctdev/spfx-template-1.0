module.exports = (name, options) => {
  const { withSharePoint, crudInfo, generatedFiles } = options || {};
  const hookName = crudInfo ? `use${name}` : '';
  const modelName = crudInfo ? `I${name}` : '';
  const listName = crudInfo?.listName || '';
  
  const isFullCRUD = crudInfo && crudInfo.crudMode === 'crud';
  const isReadOnly = crudInfo && crudInfo.crudMode === 'read';
  const hasCRUD = crudInfo || withSharePoint;

  const filesArray = generatedFiles && generatedFiles.length > 0 
    ? JSON.stringify(generatedFiles.map(f => ({
        name: f.name,
        path: f.path,
        description: f.description,
        type: f.type
      })))
    : '[]';

  let imports = `import * as React from 'react';
import { FileText, FileCode, Database, Code, Layers } from 'lucide-react';
import { PageOverview, DataGallery, NavigationAnchor, AppModal, AppInput, AppButton } from '../../../core/ui';`;

  if (crudInfo) {
    imports += `
import { DialogTrigger, DialogActions } from '@fluentui/react-components';
import { ${hookName} } from '../../../core/hooks/${hookName}';
import { ${modelName} } from '../../../models/${modelName}';`;
  } else if (withSharePoint) {
    imports += `
import { useListItems } from '../../../core/hooks/useSharePoint';`;
  }

  const content = `
export const ${name}: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState('overview');
  const [filterText, setFilterText] = React.useState('');
  const [scrollPosition, setScrollPosition] = React.useState(0);

${crudInfo ? `  const { 
    items, 
    loading, 
    error,${isFullCRUD ? `
    create, 
    update, 
    delete: remove,
    isCreating,
    isDeleting ` : ''}
  } = ${hookName}<${modelName}>('${listName}');` : withSharePoint ? `  const { items, loading, error } = useListItems('${listName || 'SitePages'}', ['Id', 'Title']);` : `  const loading = false;
  const error: string | null = null;
  const items = [];`}

${isFullCRUD ? `  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = React.useState(false);
  const [isCreateDialogVisible, setIsCreateDialogVisible] = React.useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<${modelName} | null>(null);
  const [newItemTitle, setNewItemTitle] = React.useState('');
  const [editingItemTitle, setEditingItemTitle] = React.useState('');` : ''}

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
      await remove(Number(selectedItem.Id));
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
    await update({ id: Number(selectedItem.Id), data: { Title: editingItemTitle } });
    setIsEditDialogVisible(false);
    setSelectedItem(null);
    setEditingItemTitle('');
  };` : ''}

  const sections = React.useMemo(() => [
    { id: 'overview', label: 'Visão Geral', icon: <FileCode size={18} /> },
    ${hasCRUD ? `{ id: 'data', label: 'Dados Conectados', icon: <Database size={18} /> }` : ''}
  ], []);

  const generatedFiles = ${filesArray};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                ${name}
              </h1>
            </div>
          </div>
        </header>

        <NavigationAnchor
          sections={sections}
          activeSection={activeSection}
          onSectionClick={setActiveSection}
          orientation="horizontal"
        />

        {activeSection === 'overview' && (
          <PageOverview
            pageName="${name}"
            files={generatedFiles as any[]}
            createdAt={new Date().toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          />
        )}

        ${hasCRUD ? `{activeSection === 'data' && (
          <DataGallery
            items={filteredItems}
            loading={loading}
            error={error}
            listName="${listName || 'Dados'}"
            crudMode="${crudInfo?.crudMode || 'read'}"
            filterText={filterText}
            onFilterChange={setFilterText}
            ${isFullCRUD ? `onCreate={() => setIsCreateDialogVisible(true)}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}` : ''}
          />
        )}` : ''}
      </div>

      ${isFullCRUD ? `{/* Create Dialog */}
      <DialogTrigger disableButtonEnhancement>
        <AppModal
          isOpen={isCreateDialogVisible}
          onOpenChange={() => setIsCreateDialogVisible(false)}
          title="Novo Item"
        >
          <AppInput
            value={newItemTitle}
            onChange={(ev, data) => setNewItemTitle(data.value)}
            placeholder="Digite o título do item"
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
      </DialogTrigger>

      {/* Edit Dialog */}
      <AppModal
        isOpen={isEditDialogVisible}
        onOpenChange={() => setIsEditDialogVisible(false)}
        title="Editar Item"
      >
        <AppInput
          value={editingItemTitle}
          onChange={(ev, data) => setEditingItemTitle(data.value)}
          placeholder="Digite o título do item"
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

      {/* Delete Dialog */}
      <AppModal
        isOpen={isDeleteDialogVisible}
        onOpenChange={() => setIsDeleteDialogVisible(false)}
        title="Confirmar exclusão"
      >
        <div style={{ marginBottom: '16px' }}>
          Tem certeza que deseja excluir o item "{selectedItem?.Title}"? Esta ação não pode ser desfeita.
        </div>
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

export default ${name};`;
  return imports + content;
};
