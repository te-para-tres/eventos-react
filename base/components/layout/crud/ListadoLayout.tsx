import { Col, Row } from "antd";
import { CrudHeader } from "./CrudHeader";
import { ColumnsType } from "antd/lib/table";
import QueryProps from "@base/interfaces/requests/query-props.interface";
import { TablaQuery } from "@base/components/tables/TablaQuery";
import { DefaultContainer } from "../containers/DefaultContainer";

export interface ListadoLayoutProps {
  titulo: string;
  nombreSingular: string;
  nombrePlural: string;
  onAgregar: () => void;
  columns: ColumnsType<any>;
  queryProps: QueryProps;
  setRequestParams: (params: any) => void;
}

export default function ListadoLayout({
  nombreSingular,
  nombrePlural,
  onAgregar,
  columns,
  queryProps,
  setRequestParams,
}: ListadoLayoutProps) {
  return (
    <DefaultContainer className="h-full">
      <Row gutter={[24, 16]}>
        <Col span={24}>
          <CrudHeader
            titulo={nombrePlural}
            agregarLabel={`Agregar ${nombreSingular}`}
            onAgregar={onAgregar}
          />
        </Col>

        <Col span={24}>
          <TablaQuery
            columns={columns}
            queryProps={queryProps}
            setRequestParams={setRequestParams}
            showSearch
            searchProps={{
              inputProps: {
                placeholder: `Buscar ${nombrePlural}`,
              },
            }}
          />
        </Col>
      </Row>
    </DefaultContainer>
  );
}
