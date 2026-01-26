import * as React from 'react';
import { DataGrid, DataGridProps, createTableColumn } from '@fluentui/react-components';
import { makeStyles } from '@fluentui/react-components';

const useTableStyles = makeStyles({
  root: {
    width: '100%',
    overflow: 'auto',
  },
  header: {
    fontWeight: '600',
  },
  row: {
    cursor: 'default',
  },
});

interface AppTableProps {
  items?: any[];
  columns?: any[];
  getRowId?: (item: any) => string;
}

export const AppTable: React.FC<AppTableProps> = ({
  items = [],
  columns = [],
  getRowId = (item: any) => (item as any).id?.toString() ?? '0',
}) => {
  const classes = useTableStyles();

  const gridColumns = React.useMemo(() => {
    if (columns.length > 0) {
      return columns.map((col: any) => createTableColumn(col));
    }
    return [];
  }, [columns]);

  if (items.length === 0) {
    return (
      <div className={classes.root} style={{ padding: '24px', textAlign: 'center', color: '#605e5c' }}>
        Nenhum dado disponível
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <DataGrid
        items={items}
        columns={gridColumns}
        getRowId={getRowId}
        sortable
      />
    </div>
  );
};
