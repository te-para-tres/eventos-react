import { DefaultContainer } from "@base/components/layout/containers/DefaultContainer";
import { CrudHeader } from "@base/components/layout/crud/CrudHeader";
import { TablaQuery } from "@base/components/tables/TablaQuery";
import {
  PaginaProvider,
  usePagina,
} from "@base/hooks/usePagina/usePagina";
import { createFileRoute } from "@tanstack/react-router";
import { Col, Row } from "antd";
import { Modulo as ModelClass } from "@/models/Modulo.model";
import ActionsButton from "@base/components/buttons/ActionsButton";
import useHttp from "@base/hooks/useHttp/useHttp";
import useModelColumns from "@base/hooks/useModelColumns/useModelColumns";
export const Route = createFileRoute("/(auth)/administracion/modulos/")({
  component: () => (
    <PaginaProvider titulo={`Listado de ${ModelClass.CLASS_NAME}s`}>
      <RouteComponent />
    </PaginaProvider>
  ),
});

function RouteComponent() {
  const { requestParams, setRequestParams, navigate } = usePagina();
  const http = useHttp();
  const handleAgregar = () => {
    navigate({
      to: `${ModelClass.BASE_ROUTE}/detalle`,
    });
  };

  const columns = useModelColumns({
    columns: ModelClass.COLUMNS,
    actionsButtonRender: (value, data) => {
      return (
        <ActionsButton
          onEliminar={() => {
            http.defaultDelete({
              modalContent: (
                <p>
                  ¿Está seguro de querer eliminar la {ModelClass.CLASS_NAME}{" "}
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
      );
    },
  });

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
                // expand: "",
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
