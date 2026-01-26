import * as React from 'react';
import { Plus, Edit, Trash2, Search, Grid, List, Database, Sparkles } from 'lucide-react';

interface IDataItem {
  Id: number | string;
  Title: string;
  Created?: string;
  Modified?: string;
  [key: string]: any;
}

interface IDataGalleryProps {
  items: IDataItem[];
  loading?: boolean;
  error?: string | null;
  onCreate?: () => void;
  onEdit?: (item: IDataItem) => void;
  onDelete?: (item: IDataItem) => void;
  onView?: (item: IDataItem) => void;
  listName?: string;
  crudMode?: 'read' | 'crud';
  viewMode?: 'grid' | 'list';
  filterText?: string;
  onFilterChange?: (text: string) => void;
}

const DataGallery: React.FC<IDataGalleryProps> = ({
  items,
  loading = false,
  error = null,
  onCreate,
  onEdit,
  onDelete,
  onView,
  listName = 'Dados',
  crudMode = 'read',
  viewMode = 'grid',
  filterText = '',
  onFilterChange
}) => {
  const [internalViewMode, setInternalViewMode] = React.useState<'grid' | 'list'>(viewMode);
  const [hoveredItem, setHoveredItem] = React.useState<number | string | null>(null);

  const filteredItems = React.useMemo(() => {
    if (!items) return [];
    if (!filterText) return items;
    return items.filter(item => 
      item.Title?.toLowerCase().includes(filterText.toLowerCase()) ||
      Object.values(item).some(val => 
        typeof val === 'string' && val.toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [items, filterText]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleAction = (action: () => void, e: React.MouseEvent) => {
    e.stopPropagation();
    action();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Carregando {listName}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white flex-shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-red-900 mb-2">
              Erro ao Carregar Dados
            </h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 lg:px-8 py-4 lg:py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-white">
                {listName}
              </h2>
              <p className="text-blue-100 text-sm">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'} encontrado{filteredItems.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={filterText}
                onChange={(e) => onFilterChange?.(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full lg:w-64"
              />
            </div>

            <div className="flex items-center gap-1 bg-white/20 rounded-lg p-1">
              <button
                onClick={() => setInternalViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${internalViewMode === 'grid' ? 'bg-white text-blue-600' : 'text-white/70 hover:bg-white/10'}`}
                title="Visualização em Grade"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setInternalViewMode('list')}
                className={`p-2 rounded-md transition-colors ${internalViewMode === 'list' ? 'bg-white text-blue-600' : 'text-white/70 hover:bg-white/10'}`}
                title="Visualização em Lista"
              >
                <List size={18} />
              </button>
            </div>

            {crudMode === 'crud' && onCreate && (
              <button
                onClick={onCreate}
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Novo Item</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {filterText ? 'Nenhum resultado encontrado' : 'Nenhum item ainda'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              {filterText 
                ? `Tente buscar com outros termos para encontrar o que procura em ${listName}.`
                : `Comece criando o primeiro item em ${listName} usando o botão "Novo Item" acima.`
              }
            </p>
            {crudMode === 'crud' && onCreate && !filterText && (
              <button
                onClick={onCreate}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Plus size={20} />
                Criar Primeiro Item
              </button>
            )}
          </div>
        ) : internalViewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.Id}
                className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                onMouseEnter={() => setHoveredItem(item.Id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => onView?.(item)}
              >
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 h-2" />
                
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {item.Title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {item.Id}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {item.Created && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="font-medium">Criado:</span>
                        <span>{formatDate(item.Created)}</span>
                      </div>
                    )}
                    {item.Modified && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="font-medium">Modificado:</span>
                        <span>{formatDate(item.Modified)}</span>
                      </div>
                    )}
                  </div>

                  {crudMode === 'crud' && (
                    <div className={`flex items-center gap-2 pt-3 border-t border-gray-100 ${hoveredItem === item.Id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                      {onEdit && (
                        <button
                          onClick={(e) => handleAction(() => onEdit(item), e)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          <Edit size={14} />
                          <span>Editar</span>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => handleAction(() => onDelete(item), e)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={14} />
                          <span>Excluir</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Título</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Criado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Modificado</th>
                  {crudMode === 'crud' && (
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr
                    key={item.Id}
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                    onClick={() => onView?.(item)}
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {item.Id}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.Title}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 hidden sm:table-cell">
                      {formatDate(item.Created)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 hidden lg:table-cell">
                      {formatDate(item.Modified)}
                    </td>
                    {crudMode === 'crud' && (
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {onEdit && (
                            <button
                              onClick={(e) => handleAction(() => onEdit(item), e)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={(e) => handleAction(() => onDelete(item), e)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataGallery;
