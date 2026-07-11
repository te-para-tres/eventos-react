import useHttp from "@base/hooks/useHttp/useHttp";
import { useSortColumns } from "@base/hooks/useSortColumns/useSortColumns";
import { IPagination } from "@base/interfaces/requests/pagination.interface";
import QueryProps from "@base/interfaces/requests/query-props.interface";
import { IRequestParams } from "@base/interfaces/requests/request-params.interface";
import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import { TableProps } from "antd/lib/table";
import { ColumnType, TablePaginationConfig } from "antd/lib/table/interface";
import React from "react";
import BuscadorAutomatico, {
  BuscadorAutomaticoProps,
} from "../form/BuscadorAutomatico";

export type TablaQueryColumnsType<T = any> = {
  orden?: boolean;
} & ColumnType<T>;

export interface TablaQueryProps<T = any> {
  columns: TablaQueryColumnsType<T>[];
  queryProps: QueryProps;
  pagination?: IPagination | boolean;
  setRequestParams: React.Dispatch<React.SetStateAction<IRequestParams>>;

  tableProps?: TableProps<any>;
  searchProps?: Partial<BuscadorAutomaticoProps>;

  loading?: boolean;
  sort?: string; //default: id-desc
  disablesort?: boolean;
  showSearch?: boolean;
}

export function TablaQuery<T = any>({
  columns,
  queryProps,
  pagination = true,
  setRequestParams,
  loading,
  disablesort = false,
  sort = "id-desc",
  tableProps,
  showSearch = false,
  searchProps,
}: TablaQueryProps<T>) {
  const http = useHttp();

  const { sortValue, sortedColumns } = useSortColumns({
    columnsData: columns,
    order: sort,
  });

  const query = useQuery({
    queryKey: [
      queryProps?.queryKey ?? queryProps.endpoint,
      queryProps.extraParams,
      queryProps,
      http,
    ],
    queryFn: () =>
      http.get({
        endpoint: queryProps.endpoint,
        params: queryProps.extraParams,
        onSuccess: queryProps.onSuccess,
        onError: queryProps.onError,
        onFinish: queryProps.onFinish,
      }),
    enabled: queryProps.enabled,
  });

  const paginationConfig = React.useMemo<TablePaginationConfig | false>(() => {
    const length = query.data?.resultado?.length ?? 0;
    const registroString = length === 1 ? "registro" : "registros";

    return {
      total: query?.data?.paginacion?.total || 0,
      showTotal: (total, range) => `Total: ${total} ${registroString}`,
      current: query?.data?.paginacion?.pagina || 1,
      pageSize: query?.data?.paginacion?.limite || 10,
      showSizeChanger: true,
      size: "small",
      pageSizeOptions: [10, 25, 50, 100],
      align: "end",
      style: {
        paddingRight: "10px" 
      },
      onChange(current, pageSize) {
        setRequestParams((prev: IRequestParams) => ({
          ...prev,
          pagina: current,
          limite: pageSize,
        }));
      },
    } as TablePaginationConfig;
  }, [
    query.data?.resultado?.length,
    query.data?.paginacion?.total,
    query.data?.paginacion?.pagina,
    query.data?.paginacion?.limite,
    setRequestParams,
  ]);

  React.useEffect(() => {
    setRequestParams((prev: IRequestParams) => ({
      ...prev,
      pagina: 1,
      ordenar: sortValue,
    }));
  }, [sortValue, setRequestParams]);

  return (
    <div className="flex flex-col gap-2">
      {showSearch && (
        <BuscadorAutomatico
          {...searchProps}
          setRequestParams={setRequestParams}
        />
      )}
      <div className="bg-white rounded-lg border border-neutral-200">
        <Table
          {...tableProps}
          size={tableProps?.size ?? "small"}
          loading={loading || query.isLoading || query.isPending}
          pagination={pagination && paginationConfig}
          columns={disablesort ? columns : sortedColumns}
          dataSource={query.data?.resultado ?? []}
          rowKey="id"
        />
      </div>
    </div>
  );
}
