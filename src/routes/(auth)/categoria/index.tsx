import { DefaultContainer } from "@base/components/layout/containers/DefaultContainer";
import { CrudHeader } from "@base/components/layout/crud/CrudHeader";
import { TablaQuery } from "@base/components/tables/TablaQuery";
import {
  PaginaProvider,
  usePagina,
} from "@base/hooks/usePagina/usePagina";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Col, Row, Tag } from "antd";
import { CategoriaEvento as ModelClass } from "@/models/CategoriaEvento.model";
import ActionsButton from "@base/components/buttons/ActionsButton";
import useHttp from "@base/hooks/useHttp/useHttp";
import useModelColumns from "@base/hooks/useModelColumns/useModelColumns";
import { useMemo } from "react";
export const Route = createFileRoute("/(auth)/categoria/")({
  component: () => (
    <PaginaProvider titulo={`Listado de ${ModelClass.CLASS_NAME}s`}>
      <RouteComponent />
    </PaginaProvider>
  ),
});

function RouteComponent() {
  const { router, requestParams, setRequestParams } = usePagina();
  const http = useHttp();
  const handleAgregar = () => {
    router.navigate({
      to: `${ModelClass.BASE_ROUTE}/detalle`,
    });
  };

  const baseColumns = useModelColumns({
    columns: ModelClass.COLUMNS,
    actionsButtonRender: (value, data) => (
      <ActionsButton
        onEliminar={() => {
          http.defaultDelete({
            modalContent: (
              <p>
                ¿Está seguro de querer eliminar el {ModelClass.CLASS_NAME}{" "}
                <b>{data.nombre}</b>?
              </p>
            ),
            requestParams: {
              endpoint: ModelClass.ENDPOINTS.DEFAULT,
              params: { id: value },
              onSuccess: () => {
                setRequestParams((prev) => ({
                  ...prev,
                  timestamp: Date.now(),
                }));
              },
            },
          });
        }}
      />
    ),
  });

  const columns = useMemo(() =>
    baseColumns.map((col: any) =>
      col.dataIndex === "estado"
        ? {
          ...col,
          render: (value: string, data: any) => (
            <Link to="/unidad-academica/detalle"
              search={{ id: data?.id, ...requestParams }}>
              <Tag color={value === "activo" ? "green" : "red"}>
                {value === "activo" ? "Activo" : "Inactivo"}
              </Tag>
            </Link >
          ),
        }
        : col
    ),
    [baseColumns, requestParams]
  );

  return (
    <DefaultContainer className="h-full">
      <Row gutter={[24, 16]}>
        <Col span={24}>
          <CrudHeader
            titulo={ModelClass.CLASS_NAME}
            agregarLabel={`Agregar ${ModelClass.CLASS_NAME}`}
            onAgregar={handleAgregar}
          />
        </Col>

        <Col span={24}>
          <TablaQuery
            columns={columns}
            queryProps={{
              endpoint: ModelClass.ENDPOINTS.DEFAULT,
              extraParams: {
                ...requestParams,
              },
            }}
            setRequestParams={setRequestParams}
            showSearch
            searchProps={{
              inputProps: {
                placeholder: "Buscar...",
              },
            }}

          />
        </Col>
      </Row>
    </DefaultContainer>
  );
}
