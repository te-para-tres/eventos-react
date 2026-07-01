import { DefaultContainer } from "@base/components/layout/containers/DefaultContainer";
import { CrudHeader } from "@base/components/layout/crud/CrudHeader";
import { PaginaProvider, usePagina } from "@base/hooks/usePagina/usePagina";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Col, Input, Row, Select, Tag, Typography, DatePicker } from "antd";
import { Evento as ModelClass } from "@/models/Evento.model";
import { CategoriaEvento } from "@/models/CategoriaEvento.model";
import { Carrera } from "@/models/Carrera.model";
import { Actividad } from "@/models/Actividad.model";
import ActionsButton from "@base/components/buttons/ActionsButton";
import useHttp from "@base/hooks/useHttp/useHttp";
import { ProTable } from "@ant-design/pro-components";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  ClearOutlined,
  CloseOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDebouncedValue } from "@mantine/hooks";
import type { Dayjs } from "dayjs";
import type { RangePickerProps } from "antd/lib/date-picker";
import { SelectorQuery } from "@base/components/form/SelectorQuery/SelectorQuery";

export const Route = createFileRoute("/(auth)/eventos/")({
  component: () => (
    <PaginaProvider titulo={`Listado de ${ModelClass.CLASS_NAME}s`}>
      <RouteComponent />
    </PaginaProvider>
  ),
});

const ACCENT = "#731C38";

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

const visibilidadOptions = [
  { value: "", label: "Todas" },
  { value: "publico", label: "Público" },
  { value: "unidad academica", label: "Unidad Académica" },
  { value: "carrera", label: "Carrera" },
];

const estadoOptions = [
  { value: "", label: "Todos" },
  ...Object.entries(estadoEnum).map(([value, { text }]) => ({ value, label: text })),
];

function DetailLink({ id, children }: { id: any; children: React.ReactNode }) {
  return (
    <Link to="/eventos/detalle" search={{ id }}>
      {children}
    </Link>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography.Text
      className="block text-sm mb-1"
      style={{ color: ACCENT, fontWeight: "normal" }}
    >
      {children}
    </Typography.Text>
  );
}

type Filtros = {
  idCategoriaEvento: string;
  idCarrera: string;
  idActividad: string;
  estado: string;
  visibilidad: string;
  rangoFechas: [Dayjs | null, Dayjs | null] | null;
};

const emptyFiltros: Filtros = {
  idCategoriaEvento: "",
  idCarrera: "",
  idActividad: "",
  estado: "",
  visibilidad: "",
  rangoFechas: null,
};

function RouteComponent() {
  const { router, requestParams, setRequestParams } = usePagina();
  const http = useHttp();
  const actionRef = useRef<ActionType>();
  const [buscador, setBuscador] = useState(
    (requestParams.buscar as string) ?? ""
  );
  const [debouncedBuscador] = useDebouncedValue(buscador, 400);

  const [filtros, setFiltros] = useState<Filtros>(() => ({
    ...emptyFiltros,
    idCategoriaEvento: (requestParams.idCategoriaEvento as string) ?? "",
    idCarrera: (requestParams.idCarrera as string) ?? "",
    idActividad: (requestParams.idActividad as string) ?? "",
    estado: (requestParams.estado as string) ?? "",
    visibilidad: (requestParams.visibilidad as string) ?? "",
  }));


  const handleAgregar = () => {
    router.navigate({ to: "/eventos/crear" });
  };

  const applyFilter = useCallback(
    (key: string, value: string | undefined) => {
      setRequestParams((prev) => {
        const next = { ...prev };
        if (value) {
          next[key] = value;
        } else {
          delete next[key];
        }
        return next;
      });
    },
    [setRequestParams]
  );

  const updateFiltro = useCallback(
    <K extends keyof Filtros>(key: K, value: Filtros[K]) => {
      setFiltros((prev) => ({ ...prev, [key]: value }));

      if (key === "rangoFechas") {
        const [desde, hasta] = (value as Filtros["rangoFechas"]) ?? [null, null];
        setRequestParams((prev) => {
          const next: Record<string, any> = { ...prev };
          if (desde) next.fechaDesde = desde.toISOString();
          else delete next.fechaDesde;
          if (hasta) next.fechaHasta = hasta.toISOString();
          else delete next.fechaHasta;
          return next;
        });
        return;
      }

      applyFilter(key, value as string);
    },
    [applyFilter, setRequestParams]
  );

  const filtrosRequestRef = useRef<Record<string, any>>({});

  const handleLimpiarFiltros = () => {
    setBuscador("");
    setFiltros(emptyFiltros);
    setRequestParams((prev) => {
      const {
        buscar: _b,
        idCategoriaEvento: _c,
        idCarrera: _ca,
        idActividad: _a,
        estado: _e,
        visibilidad: _v,
        fechaDesde: _fd,
        fechaHasta: _fh,
        timestamp: _t,
        ...rest
      } = prev as Record<string, any>;
      return { ...rest, timestamp: Date.now() };
    });
  };

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
            setRequestParams((prev) => ({ ...prev, timestamp: Date.now() }));
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
          <ActionsButton onEliminar={() => handleEliminar(data.id, data)} />
        ),
      },
      {
        title: "Nombre",
        dataIndex: "nombre",
        key: "nombre",
        ellipsis: true,
        search: false,
        render: (_: any, data: any) => (
          <DetailLink id={data.id}>
            <Typography.Text>{data.nombre || "—"}</Typography.Text>
          </DetailLink>
        ),
      },
      {
        title: "Categoría",
        dataIndex: ["categoriaEvento", "nombre"],
        key: "categoriaEvento.nombre",
        search: false,
        render: (_: any, data: any) => (
          <DetailLink id={data.id}>
            <Typography.Text>{data.categoriaEvento?.nombre || "—"}</Typography.Text>
          </DetailLink>
        ),
      },
      {
        title: "Carrera",
        dataIndex: ["carrera", "nombre"],
        key: "carrera.nombre",
        search: false,
        render: (_: any, data: any) => (
          <DetailLink id={data.id}>
            <Typography.Text>{data.carrera?.nombre || "—"}</Typography.Text>
          </DetailLink>
        ),
      },
      {
        title: "Actividad",
        dataIndex: ["actividad", "nombre"],
        key: "actividad.nombre",
        search: false,
        render: (_: any, data: any) => (
          <DetailLink id={data.id}>
            <Typography.Text>{data.actividad?.nombre || "—"}</Typography.Text>
          </DetailLink>
        ),
      },
      {
        title: "Estado",
        dataIndex: "estado",
        key: "estado",
        search: false,
        render: (_: any, data: any) => {
          const label = estadoEnum[data.estado ?? ""]?.text ?? data.estado ?? "—";
          const color = estadoColorMap[data.estado ?? ""] ?? "default";
          return (
            <DetailLink id={data.id}>
              <Tag color={color}>{label}</Tag>
            </DetailLink>
          );
        },
      },
      {
        title: "Visibilidad",
        dataIndex: "visibilidad",
        key: "visibilidad",
        search: false,
        render: (_: any, data: any) => {
          const label =
            visibilidadEnum[data.visibilidad ?? ""]?.text ??
            data.visibilidad ??
            "—";
          const color = visibilidadColorMap[data.visibilidad ?? ""] ?? "default";
          return (
            <DetailLink id={data.id}>
              <Tag color={color}>{label}</Tag>
            </DetailLink>
          );
        },
      },
      {
        title: "Inicio",
        dataIndex: "fechaInicio",
        key: "fechaInicio",
        search: false,
        render: (_: any, data: any) => (
          <DetailLink id={data.id}>
            <Typography.Text>
              {data.fechaInicio
                ? dayjs(data.fechaInicio).format("DD/MM/YYYY HH:mm")
                : "—"}
            </Typography.Text>
          </DetailLink>
        ),
      },
      {
        title: "Fin",
        dataIndex: "fechaFin",
        key: "fechaFin",
        search: false,
        render: (_: any, data: any) => (
          <DetailLink id={data.id}>
            <Typography.Text>
              {data.fechaFin
                ? dayjs(data.fechaFin).format("DD/MM/YYYY HH:mm")
                : "—"}
            </Typography.Text>
          </DetailLink>
        ),
      },
      {
        title: "Capacidad",
        dataIndex: "capacidadMaxima",
        key: "capacidadMaxima",
        search: false,
        render: (_: any, data: any) => (
          <DetailLink id={data.id}>
            <Typography.Text>
              {data.capacidadMaxima ? `${data.capacidadMaxima} personas` : "—"}
            </Typography.Text>
          </DetailLink>
        ),
      },
    ],
    [handleEliminar]
  );

  useEffect(() => {
    const v = debouncedBuscador?.trim();
    applyFilter("buscar", v);
  }, [debouncedBuscador, applyFilter]);


  useEffect(() => {
    if (!actionRef.current) return;

    const filtrosActuales: Record<string, any> = {};
    for (const k of [
      "buscar",
      "idCategoriaEvento",
      "idCarrera",
      "idActividad",
      "estado",
      "visibilidad",
      "fechaDesde",
      "fechaHasta",
    ]) {
      if (requestParams[k] !== undefined) filtrosActuales[k] = requestParams[k];
    }

    const changed =
      JSON.stringify(filtrosActuales) !==
      JSON.stringify(filtrosRequestRef.current);

    if (changed) {
      filtrosRequestRef.current = filtrosActuales;
      actionRef.current.reload();
    }
  }, [requestParams]);

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
          <div className="rounded-lg border border-stone-200 bg-white p-4">
            <Row gutter={[16, 12]}>
              <Col xs={24} md={12} lg={6}>
                <div className="flex flex-col justify-center">
                  <FieldLabel>Buscar</FieldLabel>
                  <Input
                    prefix={<SearchOutlined className="text-xs text-stone-400" />}
                    suffix={
                      buscador ? (
                        <CloseOutlined
                          className="cursor-pointer text-xs text-stone-400 hover:text-stone-700"
                          onClick={() => setBuscador("")}
                          aria-label="Limpiar búsqueda"
                        />
                      ) : null
                    }
                    value={buscador}
                    onChange={(e) => setBuscador(e.target.value)}
                    placeholder="Nombre del evento..."
                    allowClear={false}
                    className="text-sm"
                  />
                </div>
              </Col>

              <Col xs={24} md={12} lg={6}>
                <div className="flex flex-col justify-center">
                  <FieldLabel>Categoría</FieldLabel>
                  <SelectorQuery
                    value={filtros.idCategoriaEvento || undefined}
                    onChange={(v: string | undefined) =>
                      updateFiltro("idCategoriaEvento", v ?? "")
                    }
                    queryProps={{
                      endpoint: CategoriaEvento.ENDPOINTS.DEFAULT,
                      enabled: true,
                      extraParams: {
                        ordenar: "nombre-asc",
                        limite: 100,
                      },
                    }}
                    selectProps={{
                      placeholder: "Todas",
                      allowClear: true,
                      className: "w-full",
                    }}
                    append={[{ value: "", label: "Todas", id: "" }]}
                  />
                </div>
              </Col>

              <Col xs={24} md={12} lg={6}>
                <div className="flex flex-col justify-center">
                  <FieldLabel>Carrera</FieldLabel>
                  <SelectorQuery
                    value={filtros.idCarrera || undefined}
                    onChange={(v: string | undefined) =>
                      updateFiltro("idCarrera", v ?? "")
                    }
                    queryProps={{
                      endpoint: Carrera.ENDPOINTS.DEFAULT,
                      enabled: true,
                      extraParams: {
                        ordenar: "nombre-asc",
                        limite: 200,
                      },
                    }}
                    selectProps={{
                      placeholder: "Todas",
                      allowClear: true,
                      className: "w-full",
                    }}
                    append={[{ value: "", label: "Todas", id: "" }]}
                  />
                </div>
              </Col>

              <Col xs={24} md={12} lg={6}>
                <div className="flex flex-col justify-center">
                  <FieldLabel>Actividad</FieldLabel>
                  <SelectorQuery
                    value={filtros.idActividad || undefined}
                    onChange={(v: string | undefined) =>
                      updateFiltro("idActividad", v ?? "")
                    }
                    queryProps={{
                      endpoint: Actividad.ENDPOINTS.DEFAULT,
                      enabled: true,
                      extraParams: {
                        ordenar: "nombre-asc",
                        limite: 100,
                      },
                    }}
                    selectProps={{
                      placeholder: "Todas",
                      allowClear: true,
                      className: "w-full",
                    }}
                    append={[{ value: "", label: "Todas", id: "" }]}
                  />
                </div>
              </Col>

              <Col xs={12} md={6} lg={6}>
                <div className="flex flex-col justify-center">
                  <FieldLabel>Estado</FieldLabel>
                  <Select
                    value={filtros.estado || undefined}
                    onChange={(v: string) => updateFiltro("estado", v ?? "")}
                    placeholder="Todos"
                    allowClear
                    options={estadoOptions}
                    className="w-full"
                  />
                </div>
              </Col>

              <Col xs={12} md={6} lg={6}>
                <div className="flex flex-col justify-center">
                  <FieldLabel>Visibilidad</FieldLabel>
                  <Select
                    value={filtros.visibilidad || undefined}
                    onChange={(v: string) => updateFiltro("visibilidad", v ?? "")}
                    placeholder="Todas"
                    allowClear
                    options={visibilidadOptions}
                    className="w-full"
                  />
                </div>
              </Col>

              <Col xs={24} md={12} lg={6}>
                <div className="flex flex-col justify-center">
                  <FieldLabel>Periodo</FieldLabel>
                  <DatePicker.RangePicker
                    value={filtros.rangoFechas ?? undefined}
                    onChange={(
                      values: RangePickerProps["onChange"] extends (
                        d: infer V
                      ) => unknown
                        ? V
                        : any
                    ) => {
                      const desde = values?.[0] ? dayjs(values[0]) : null;
                      const hasta = values?.[1] ? dayjs(values[1]) : null;
                      updateFiltro("rangoFechas", [desde, hasta]);
                    }}
                    format="DD/MM/YYYY"
                    placeholder={["Desde", "Hasta"]}
                    className="w-full"
                  />
                </div>
              </Col>

              <Col xs={24} md={12} lg={2}>
                <div className="flex h-full flex-col justify-center">
                  <Button
                    size="small"
                    icon={<ClearOutlined />}
                    onClick={handleLimpiarFiltros}
                    className="flex items-center justify-center border border-[#731C38]! bg-[#731C38]! text-white! transition-colors hover:bg-white! hover:text-[#731C38]!"
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Col>

        <Col span={24}>
          <ProTable<any>
            actionRef={actionRef}
            columns={columns}
            rowKey="id"
            cardBordered
            request={async (params, sort) => {
              const apiParams: Record<string, any> = {
                pagina: params.current ?? 1,
                limite: params.pageSize ?? 10,
                expand: ModelClass.EXPAND.DEFAULT,
                ...requestParams,
              };

              if (sort && Object.keys(sort).length > 0) {
                const [sortKey, sortOrder] = Object.entries(sort)[0];
                apiParams.ordenar = `${sortKey}-${sortOrder === "ascend" ? "asc" : "desc"
                  }`;
              } else {
                apiParams.ordenar = "id-desc";
              }

              const response = await http.get({
                endpoint: ModelClass.ENDPOINTS.DEFAULT,
                params: apiParams,
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
            search={false}
            options={{
              density: false,
              fullScreen: false,
              reload: false,
              setting: false,
            }}
            dateFormatter="string"
          />
        </Col>
      </Row>
    </DefaultContainer>
  );
}
