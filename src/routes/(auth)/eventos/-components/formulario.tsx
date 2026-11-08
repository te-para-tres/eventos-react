import { IFormularioBaseProps } from "@base/interfaces/forms/FormularioBase.interface";
import { Evento } from "@/models/Evento.model";
import VITE_ENV from "@/config/constants/vite-env";
import dayjs from "dayjs";
import {
  Card,
  Col,
  Empty,
  Image,
  Row,
  Table,
  Tag,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  CalendarOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  PictureOutlined,
  TeamOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { TarjetaSeccion } from "./TarjetaSeccion";
import { TarjetaQr } from "./TarjetaQr";
import type { Asistente } from "@/models/Asistente.model";
import { ExportarAsistentesButton } from "./ExportarAsistentesButton";
import { obtenerCarrera } from "./exportarAsistentes";

const ACCENT = "#731C38";

const visibilidadMap: Record<string, string> = {
  publico: "Público",
  "unidad academica": "Unidad Académica",
  carrera: "Carrera",
};

const estadoMap: Record<string, { label: string; color: string }> = {
  INFORMACION_BASICA: { label: "Información Básica", color: "blue" },
  LOGISTICA: { label: "Logística", color: "cyan" },
  VISIBILIDAD: { label: "Visibilidad", color: "geekblue" },
  REVISION: { label: "Revisión", color: "orange" },
  ESPERA: { label: "En Espera", color: "gold" },
  APROBADO: { label: "Aprobado", color: "green" },
  CANCELADO: { label: "Cancelado", color: "red" },
};

const columnasAsistentes: TableColumnsType<Asistente> = [
  {
    title: "Nombre",
    dataIndex: "nombre",
    key: "nombre",
    render: (nombre: string | undefined) => nombre || "Sin nombre",
  },
  {
    title: "Expediente",
    dataIndex: "expediente",
    key: "expediente",
    render: (expediente: string | undefined) => expediente || "—",
  },
  {
    title: "Correo electrónico",
    dataIndex: "correo",
    key: "correo",
    render: (correo: string | undefined) => correo || "—",
  },
  {
    title: "Carrera",
    key: "carrera",
    render: (_valor, asistente) => obtenerCarrera(asistente),
  },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography.Text
      className="block text-sm font-medium tracking-wide mb-1.5"
      style={{ color: ACCENT }}
    >
      {children}
    </Typography.Text>
  );
}

export default function Formulario({
  modelo,
  isLoading = false,
}: IFormularioBaseProps<Evento>) {
  if (isLoading) {
    return (
        <div className="flex justify-center items-center py-15 w-screen h-screen">
        <LoadingOutlined className="text-4xl"/>
      </div>
    );
  }

  const evento = modelo as Evento | undefined;

  if (!evento) {
    return <Empty description="No se encontró información del evento" />;
  }

  const estadoInfo = estadoMap[evento.estado ?? ""] ?? {
    label: evento.estado || "Desconocido",
    color: "default",
  };

  const esImagen = (extension?: string) =>
    extension &&
    ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
      extension.toLowerCase()
    );

  const materialesList = evento.materiales ??
    evento.eventoMaterial?.map((em: any) => ({
      ...em.material,
      cantidad: em.cantidad,
      nota: em.nota,
      id: em.id,
    })) ??
    [];

  const mediosList = evento.medias ??
    evento.eventoMedia?.map((em) => em.media).filter(Boolean) ??
    [];

  return (
    <div className="p-3 space-y-3">
      {evento.imagenDestacada && (
        <div className="mb-6 overflow-hidden rounded-lg">
          <Image
            src={`${VITE_ENV.BASE_API_URL}/recursos/${evento.imagenDestacada.ruta}`}
            alt={evento.imagenDestacada.nombre}
            width="100%"
            style={{ maxHeight: 400, objectFit: "cover" }}
          />
        </div>
      )}

      <Row justify="space-between" align="middle">
        <Col>
          <Typography.Title level={2} className="m-0!">
            {evento.nombre || "Sin nombre"}
          </Typography.Title>
        </Col>
        <Col>
          <Tag color={estadoInfo.color} className="text-sm px-3 capitalize py-1.5 border-0" style={{ background: `${ACCENT}15`, color: ACCENT }}>
            {estadoInfo.label}
          </Tag>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={24} className="flex flex-col gap-3">
          <TarjetaSeccion title="Información del Evento" icon={<InfoCircleOutlined />}>
            <Row gutter={[18, 12]}>
              <Col span={24} sm={12}>
                <FieldLabel>Categoría</FieldLabel>
                <Typography.Text className="text-stone-800 block">
                  {evento.categoriaEvento?.nombre || "—"}
                </Typography.Text>
              </Col>
              <Col span={24} sm={12}>
                <FieldLabel>Carrera / Departamento</FieldLabel>
                <Typography.Text className="text-stone-800 block">
                  {evento.carrera?.nombre || "—"}
                </Typography.Text>
              </Col>
              {evento.actividad && (
                <Col span={24} sm={12}>
                  <FieldLabel>Actividad</FieldLabel>
                  <Typography.Text className="text-stone-800 block">
                    {evento.actividad.nombre}
                  </Typography.Text>
                </Col>
              )}
              <Col span={24}>
                <FieldLabel>Descripción</FieldLabel>
                <Typography.Text className="text-stone-700 block">
                  {evento.descripcion || "Sin descripción"}
                </Typography.Text>
              </Col>
            </Row>
          </TarjetaSeccion>

          <TarjetaSeccion title="Logística" icon={<CalendarOutlined />}>
            <Row gutter={[18, 12]}>
              <Col span={24} sm={12}>
                <FieldLabel>Unidad Académica</FieldLabel>
                <Typography.Text className="text-stone-800 block">
                  {evento.unidadAcademica?.nombre || "—"}
                </Typography.Text>
              </Col>
              <Col span={24} sm={12}>
                <FieldLabel>
                  Lugar
                </FieldLabel>
                <Typography.Text className="text-stone-800 block">
                  {evento.lugar || "—"}
                </Typography.Text>
              </Col>
              <Col span={24} sm={12}>
                <FieldLabel>Fecha de Inicio</FieldLabel>
                <Typography.Text className="text-stone-800 block">
                  {evento.fechaInicio
                    ? dayjs(evento.fechaInicio).format("DD/MM/YYYY HH:mm")
                    : "—"}
                </Typography.Text>
              </Col>
              <Col span={24} sm={12}>
                <FieldLabel>Fecha Fin</FieldLabel>
                <Typography.Text className="text-stone-800 block">
                  {evento.fechaFin
                    ? dayjs(evento.fechaFin).format("DD/MM/YYYY HH:mm")
                    : "—"}
                </Typography.Text>
              </Col>
              {evento.estado === "CANCELADO" && evento.fechaCancelacion && (
                <Col span={24}>
                  <FieldLabel>Fecha de Cancelación</FieldLabel>
                  <Typography.Text type="danger">
                    {dayjs(evento.fechaCancelacion).format("DD/MM/YYYY HH:mm")}
                  </Typography.Text>
                </Col>
              )}
            </Row>
          </TarjetaSeccion>

          <TarjetaSeccion title="Acceso y QR" icon={<EyeOutlined />}>
            <Row gutter={[18, 12]} align="middle">
              <Col xs={24} sm={8}>
                <FieldLabel>Capacidad</FieldLabel>
                <Typography.Text className="text-stone-800">
                  {evento.capacidadMinima ?? 0} – {evento.capacidadMaxima ?? "∞"} personas
                </Typography.Text>
              </Col>
              <Col xs={24} sm={8}>
                <FieldLabel>Visibilidad</FieldLabel>
                <Typography.Text className="text-stone-800">
                  {visibilidadMap[evento.visibilidad ?? ""] || evento.visibilidad || "—"}
                </Typography.Text>
              </Col>
              <Col xs={24} sm={8}>
                <TarjetaQr evento={evento} />
              </Col>
            </Row>
          </TarjetaSeccion>

          {(materialesList.length > 0) && (
            <TarjetaSeccion title="Materiales Requeridos" icon={<ToolOutlined />}>
              <Row gutter={[12, 12]}>
                {materialesList.map((m) => (
                  <Col key={m.id} xs={24} sm={12} md={8}>
                    <Card size="small" className="h-full border-l-2" style={{ borderLeftColor: ACCENT }}>
                      <Typography.Text strong className="text-stone-800 block">
                        {m.nombre || "Material"}: <span className="text-[#731C38]">{m.cantidad ?? "—"}</span>
                      </Typography.Text>
                      {m.nota && (
                        <Typography.Text type="secondary" className="block mt-1.5">
                          {m.nota}
                        </Typography.Text>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            </TarjetaSeccion>
          )}

          {mediosList.length > 0 && (
            <TarjetaSeccion title="Galería de Imágenes y Anexos" icon={<PictureOutlined />}>
              <Image.PreviewGroup>
                <Row gutter={[18, 18]}>
                  {mediosList.map((media: any) => {
                    if (!media) return null;
                    const ruta = media.ruta;
                    const nombre = media.nombre || "Sin nombre";
                    const url = ruta
                      ? `${VITE_ENV.BASE_API_URL}/recursos/${ruta}`
                      : "";
                    return (
                      <Col key={media.id} xs={12} sm={8} md={6} lg={4}>
                        {esImagen(media.extension) && url ? (
                          <>
                            <Image
                              src={url}
                              alt={nombre}
                              width="100%"
                              style={{
                                aspectRatio: "4/3",
                                objectFit: "cover",
                                borderRadius: 8,
                              }}
                            />
                            <Typography.Text
                              className="block text-center mt-1.5"
                              style={{ fontSize: 12 }}
                              ellipsis
                            >
                              {nombre}
                            </Typography.Text>
                          </>
                        ) : (
                          <Card size="small" className="flex flex-col items-center justify-center text-center h-full">
                            <Typography.Text strong className="block text-center" style={{ fontSize: 12 }}>
                              {nombre}
                            </Typography.Text>
                            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                              {media.extension?.toUpperCase() || "Archivo"}
                            </Typography.Text>
                          </Card>
                        )}
                      </Col>
                    );
                  })}
                </Row>
              </Image.PreviewGroup>
            </TarjetaSeccion>
          )}
        </Col>

      </Row>

      <TarjetaSeccion
        title={`Asistentes registrados (${evento.asistentes?.length ?? 0})`}
        icon={<TeamOutlined />}
      >
        <div className="mb-3 flex justify-end">
          <ExportarAsistentesButton evento={evento} />
        </div>
        <Table<Asistente>
          rowKey={(asistente) =>
            asistente.id || `${asistente.expediente}-${asistente.correo}`
          }
          columns={columnasAsistentes}
          dataSource={evento.asistentes ?? []}
          locale={{
            emptyText: (
              <Empty
                description="No hay asistentes registrados"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: [10, 25, 50],
            showTotal: (total) => `${total} asistentes`,
          }}
          scroll={{ x: true }}
        />
      </TarjetaSeccion>
    </div>
  );
}
