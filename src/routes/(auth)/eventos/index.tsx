import { DefaultContainer } from "@base/components/layout/containers/DefaultContainer";
import { CrudHeader } from "@base/components/layout/crud/CrudHeader";
import {
  PaginaProvider,
  usePagina,
} from "@base/hooks/usePagina/usePagina";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Col, Row, Tag, Typography } from "antd";
import { Evento as ModelClass } from "@/models/Evento.model";
import { CategoriaEvento } from "@/models/CategoriaEvento.model";
import { Carrera } from "@/models/Carrera.model";
import { Actividad } from "@/models/Actividad.model";
import ActionsButton from "@base/components/buttons/ActionsButton";
import useHttp from "@base/hooks/useHttp/useHttp";
import { ProTable } from "@ant-design/pro-components";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import { useRef, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/(auth)/eventos/")({
  component: () => (
    <PaginaProvider titulo={`Listado de ${ModelClass.CLASS_NAME}s`}>
      <RouteComponent />
    </PaginaProvider>
  ),
});

const estadoEnum: Record<string, { text: string }> = {
  INFORMACION_BASICA: { text: "Información Básica" },
  LOGISTICA: { text: "Logística" },
  VISIBILIDAD: { text: "Visibilidad" },
  REVISION: { text: "Revisión" },
  ESPERA: { text: "En Espera" },
  APROBADO: { text: "Aprobado" },
  CANCELADO: { text: "Cancelado" },
};

const estadoColorMap: Record<string, string> = {
  INFORMACION_BASICA: "blue",
  LOGISTICA: "cyan",
  VISIBILIDAD: "geekblue",
  REVISION: "orange",
  ESPERA: "gold",
  APROBADO: "green",
  CANCELADO: "red",
};

const visibilidadEnum: Record<string, { text: string }> = {
  publico: { text: "Público" },
  "unidad academica": { text: "Unidad Académica" },
  carrera: { text: "Carrera" },
};

const visibilidadColorMap: Record<string, string> = {
  publico: "green",
  "unidad academica": "blue",
  carrera: "purple",
};

function RouteComponent() {
  const { router, requestParams, setRequestParams } = usePagina();
  const http = useHttp();
  const actionRef = useRef<ActionType>();

  const handleAgregar = () => {
    router.navigate({
      to: `/`,
    });
  };


  const categoriasQuery = useQuery({
    queryKey: ["categorias-filter", CategoriaEvento.ENDPOINTS.DEFAULT, http],
    queryFn: () =>
      http.get({
        endpoint: CategoriaEvento.ENDPOINTS.DEFAULT,
        params: { ordenar: "nombre-asc", limite: 100 },
      }),
  });

  const carrerasQuery = useQuery({
    queryKey: ["carreras-filter", Carrera.ENDPOINTS.DEFAULT, http],
    queryFn: () =>
      http.get({
        endpoint: Carrera.ENDPOINTS.DEFAULT,
        params: { ordenar: "nombre-asc", limite: 200 },
      }),
  });

  const actividadesQuery = useQuery({
    queryKey: ["actividades-filter", Actividad.ENDPOINTS.DEFAULT, http],
    queryFn: () =>
      http.get({
        endpoint: Actividad.ENDPOINTS.DEFAULT,
        params: { ordenar: "nombre-asc", limite: 100 },
      }),
  });

  const categoriaFilters = useMemo(() => {
    const resultado = categoriasQuery.data?.resultado ?? [];
    const enumMap: Record<string, { text: string }> = {};
    for (const cat of resultado) {
      if (cat.id && cat.nombre) {
        enumMap[cat.id] = { text: cat.nombre };
      }
    }
    return enumMap;
  }, [categoriasQuery.data]);

  const carreraFilters = useMemo(() => {
    const resultado = carrerasQuery.data?.resultado ?? [];
    const enumMap: Record<string, { text: string }> = {};
    for (const c of resultado) {
      if (c.id && c.nombre) {
        enumMap[c.id] = { text: c.nombre };
      }
    }
    return enumMap;
  }, [carrerasQuery.data]);

  const actividadFilters = useMemo(() => {
    const resultado = actividadesQuery.data?.resultado ?? [];
    const enumMap: Record<string, { text: string }> = {};
    for (const a of resultado) {
      if (a.id && a.nombre) {
        enumMap[a.id] = { text: a.nombre };
      }
    }
    return enumMap;
  }, [actividadesQuery.data]);

  const handleEliminar = useCallback(
    (value: any, data: any) => {
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
            actionRef.current?.reload();
          },
        },
      });
    },
    [http, setRequestParams]
  );

  const columns: ProColumns<any>[] = useMemo(
    () => [
      {
        title: "",
        dataIndex: "id",
        key: "acciones",
        width: 40,
        align: "center" as const,
        search: false,
        render: (_: any, data: any) => (
          <ActionsButton
            onEliminar={() => handleEliminar(data.id, data)}
          />
        ),
      },
      {
        title: "Nombre",
        dataIndex: "nombre",
        key: "nombre",
        ellipsis: true,
        render: (_: any, data: any) => (
          <Link to="/eventos/detalle" search={{ id: data.id }}>
            <Typography.Text strong className="text-[#731C38]">
              {data.nombre || "—"}
            </Typography.Text>
          </Link>
        ),
      },
      {
        title: "Categoría",
        dataIndex: "idCategoriaEvento",
        key: "idCategoriaEvento",
        valueType: "select",
        valueEnum: categoriaFilters,
        render: (_: any, data: any) => (
          <Typography.Text>
            {data.categoriaEvento?.nombre || "—"}
          </Typography.Text>
        ),
      },
      {
        title: "Carrera",
        dataIndex: "idCarrera",
        key: "idCarrera",
        valueType: "select",
        valueEnum: carreraFilters,
        render: (_: any, data: any) => (
          <Typography.Text>
            {data.carrera?.nombre || "—"}
          </Typography.Text>
        ),
      },
      {
        title: "Actividad",
        dataIndex: "idActividad",
        key: "idActividad",
        valueType: "select",
        valueEnum: actividadFilters,
        render: (_: any, data: any) => (
          <Typography.Text>
            {data.actividad?.nombre || "—"}
          </Typography.Text>
        ),
      },
      {
        title: "Estado",
        dataIndex: "estado",
        key: "estado",
        valueType: "select",
        valueEnum: estadoEnum,
        render: (_: any, data: any) => {
          const label = estadoEnum[data.estado ?? ""]?.text ?? data.estado ?? "—";
          const color = estadoColorMap[data.estado ?? ""] ?? "default";
          return (
            <Link to="/eventos/detalle" search={{ id: data.id }}>
              <Tag color={color}>{label}</Tag>
            </Link>
          );
        },
      },
      {
        title: "Visibilidad",
        dataIndex: "visibilidad",
        key: "visibilidad",
        valueType: "select",
        valueEnum: visibilidadEnum,
        render: (_: any, data: any) => {
          const label = visibilidadEnum[data.visibilidad ?? ""]?.text ?? data.visibilidad ?? "—";
          const color = visibilidadColorMap[data.visibilidad ?? ""] ?? "default";
          return <Tag color={color}>{label}</Tag>;
        },
      },
      {
        title: "Inicio",
        dataIndex: "fechaInicio",
        key: "fechaInicio",
        valueType: "dateRange",
        search: {
          transform: (value: any) => ({
            fechaInicio: value[0],
            fechaFin: value[1],
          }),
        },
        render: (_: any, data: any) =>
          data.fechaInicio
            ? dayjs(data.fechaInicio).format("DD/MM/YYYY HH:mm")
            : "—",
      },
      {
        title: "Capacidad",
        dataIndex: "capacidadMaxima",
        key: "capacidadMaxima",
        search: false,
        render: (_: any, data: any) =>
          data.capacidadMaxima ? `${data.capacidadMaxima} personas` : "—",
      },
    ],
    [categoriaFilters, carreraFilters, actividadFilters, handleEliminar]
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
          <ProTable<any>
            actionRef={actionRef}
            columns={columns}
            rowKey="id"
            cardBordered
            headerTitle={`Listado de ${ModelClass.CLASS_NAME}s`}
            request={async (params, sort) => {
              const queryParams: Record<string, any> = {
                ...requestParams,
                expand: ModelClass.EXPAND.DEFAULT,
                pagina: params.current ?? 1,
                limite: params.pageSize ?? 10,
              };

              // Map ProTable filter params to API params
              if (params.nombre) queryParams.buscar = params.nombre;
              if (params.idCategoriaEvento) queryParams.idCategoriaEvento = params.idCategoriaEvento;
              if (params.idCarrera) queryParams.idCarrera = params.idCarrera;
              if (params.idActividad) queryParams.idActividad = params.idActividad;
              if (params.estado) queryParams.estado = params.estado;
              if (params.visibilidad) queryParams.visibilidad = params.visibilidad;
              if (params.fechaInicio) queryParams.fechaDesde = params.fechaInicio;
              if (params.fechaFin) queryParams.fechaHasta = params.fechaFin;

              // Sort
              if (sort && Object.keys(sort).length > 0) {
                const [sortKey, sortOrder] = Object.entries(sort)[0];
                queryParams.ordenar = `${sortKey}-${sortOrder === "ascend" ? "asc" : "desc"}`;
              } else {
                queryParams.ordenar = "id-desc";
              }

              const response = await http.get({
                endpoint: ModelClass.ENDPOINTS.DEFAULT,
                params: queryParams,
              });

              return {
                data: response?.resultado ?? [],
                total: response?.paginacion?.total ?? 0,
                success: true,
              };
            }}
            pagination={{
              showSizeChanger: true,
              pageSizeOptions: [10, 25, 50, 100],
              size: "small",
              showTotal: (total) =>
                `Total: ${total} ${total === 1 ? "registro" : "registros"}`,
            }}
            search={{
              labelWidth: "auto",
              defaultCollapsed: false,
              searchText: "Buscar",
              resetText: "Limpiar",
            }}
            options={{
              density: true,
              fullScreen: true,
              reload: true,
              setting: true,
            }}
            dateFormatter="string"
            toolBarRender={false}
          />
        </Col>
      </Row>
    </DefaultContainer>
  );
}
