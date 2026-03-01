import { ColumnRender } from "@base/components/tables/column-renderer/column-renderer";
import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { ColumnsType } from "antd/lib/table";
import React from "react";

interface UseModelColumnsProps {
  columns: ModelColumnsType[];
  actionsButtonRender?: (value: any, data: any) => React.ReactNode;
  hideActionsButton?: boolean;
}

const useModelColumns = ({
  columns,
  actionsButtonRender,
  hideActionsButton = false,
}: UseModelColumnsProps): ColumnsType<any> => {
  const _columns = React.useMemo(() => {
    const _columns: ColumnsType<any> = [];

    if (!hideActionsButton && actionsButtonRender) {
      _columns.push({
        title: "",
        dataIndex: "id",
        sorter: false,
        width: 30,
        align: "center",
        render: actionsButtonRender,
      });
    }

    _columns.push(
      ...columns.map((column) => ({
        ...column,
        dataIndex: column.dataIndex ?? column.key,
        render: (_: any, data: any) => {
          return <ColumnRender col={column} data={data} />;
        },
      }))
    );

    return _columns;
  }, [columns, actionsButtonRender, hideActionsButton]);

  return _columns;
};

export default useModelColumns;
