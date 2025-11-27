import * as React from 'react';
import { getSP } from '../../config/pnpConfig';
import { IUser } from '../../models';

/**
 * Hook para obter o usuário atual do SharePoint
 */
export const useCurrentUser = () => {
  const [user, setUser] = React.useState<IUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const sp = getSP();
        if (!sp) {
          throw new Error('SharePoint context not initialized');
        }
        
        const currentUser = await sp.web.currentUser();
        setUser({
          Id: currentUser.Id,
          Title: currentUser.Title,
          Email: currentUser.Email,
          LoginName: currentUser.LoginName
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};

/**
 * Hook genérico para obter itens de uma lista
 * @param listName Nome da lista
 * @param select Campos a serem selecionados
 * @param filter Filtro OData (opcional)
 */
export const useListItems = <T>(
  listName: string,
  select: string[] = ['Id', 'Title'],
  filter?: string
) => {
  const [items, setItems] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchItems = React.useCallback(async () => {
    try {
      setLoading(true);
      const sp = getSP();
      if (!sp) {
        throw new Error('SharePoint context not initialized');
      }

      let query = sp.web.lists.getByTitle(listName).items
        .select(...select)
        .top(1000);

      if (filter) {
        query = query.filter(filter);
      }

      const result = await query();
      setItems(result as T[]);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [listName, select, filter]);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, refetch: fetchItems };
};
