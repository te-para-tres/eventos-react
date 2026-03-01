import React from "react";

export function useSortColumns({ columnsData = [] as any[], order = "" }) {
  const [sortValue, setSortValue] = React.useState(order);
  const [sortedColumns, setSortedColumns] = React.useState<any[]>([]);

  const onHeaderCell = React.useCallback(
    (column: { key: string; orden?: string; dataIndex: string }) => {
      return {
        onClick: () => {
          const _sort = sortValue.indexOf("asc") > 0 ? "desc" : "asc";
          setSortValue(
            `${column?.orden ? column.orden : column.dataIndex}-${_sort}`
          );
        },
      };
    },
    [sortValue]
  );

  React.useEffect(() => {
    const columnsDefaultProps = {
      sorter: { multiple: 2 },
      sortOrder: sortValue.indexOf("asc") >= 0 ? "ascend" : "descend",
      onHeaderCell: onHeaderCell,
      showSorterTooltip: false,
    };

    const _columns = columnsData?.map((column) => {
      column.sortOrder = null;
      if (column?.ordenar === false) {
        return column;
      }
      if (column?.ordenar) {
        if (sortValue.indexOf(column.orden) >= 0) {
          column.sortOrder =
            sortValue.indexOf("asc") >= 0 ? "ascend" : "descend";
        }
      } else if (sortValue.indexOf(column.dataIndex) >= 0) {
        column.sortOrder = sortValue.indexOf("asc") >= 0 ? "ascend" : "descend";
      }

      if (column.key === "acciones") {
        return { ...column, title: "" };
      }
      return { ...columnsDefaultProps, ...column };
    });

    setSortedColumns(_columns);
  }, [onHeaderCell, columnsData, sortValue]);

  return React.useMemo(
    () => ({
      sortValue,
      sortedColumns,
    }),
    [sortedColumns, sortValue]
  );
}
