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
  Tag,
  Typography,
} from "antd";
import { QRCodeSVG } from "qrcode.react";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  TeamOutlined,
  ToolOutlined,
} from "@ant-design/icons";

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

// Label sobre el valor
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography.Text
      className="block text-xs uppercase tracking-wide mb-1"
      style={{ color: ACCENT }}
    >
      {children}
    </Typography.Text>
  );
}

function InfoCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card
      title={
        <span className="flex items-center gap-2" style={{ color: ACCENT }}>
          <span style={{ color: ACCENT }}>{icon}</span>
          {title}
        </span>
      }
      className="shadow-sm"
      styles={{ title: { color: ACCENT, borderBottom: `2px solid ${ACCENT}30` } }}
    >
      {children}
    </Card>
  );
}

export default function Formulario({
  modelo,
  isLoading = false,
}: IFormularioBaseProps<Evento>) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Typography.Text type="secondary">Cargando evento...</Typography.Text>
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

  const qrValue = `https://eventues.app/registro-evento?id=${evento.id}`;

  const materialesList = evento.materiales ??
    evento.eventoMaterial?.map((em) => ({
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
    <div className="p-4 space-y-4">
      {/* Imagen de portada */}
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

      {/* Título y estado */}
      <Row justify="space-between" align="middle">
        <Col>
          <Typography.Title level={2} className="!m-0">
            {evento.nombre || "Sin nombre"}
          </Typography.Title>
        </Col>
        <Col>
          <Tag color={estadoInfo.color} className="text-sm px-3 py-0.5 border-0" style={{ background: `${ACCENT}15`, color: ACCENT }}>
            {estadoInfo.label}
          </Tag>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Columna principal — Información del evento + Logística + QR */}
        <Col xs={24} md={16} className="flex flex-col gap-4">
          <InfoCard title="Información del Evento" icon={<InfoCircleOutlined />}>
            <Row gutter={[16, 8]}>
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
          </InfoCard>

          <InfoCard title="Logística" icon={<CalendarOutlined />}>
            <Row gutter={[16, 8]}>
              <Col span={24} sm={12}>
                <FieldLabel>Unidad Académica</FieldLabel>
                <Typography.Text className="text-stone-800 block">
                  {evento.unidadAcademica?.nombre || "—"}
                </Typography.Text>
              </Col>
              <Col span={24} sm={12}>
                <FieldLabel>
                  <EnvironmentOutlined className="mr-1" /> Lugar
                </FieldLabel>
                <Typography.Text className="text-stone-800 block">
                  {evento.lugar || "—"}
                </Typography.Text>
              </Col>
              <Col span={24} sm={12}>
                <FieldLabel>Fecha y Hora de Inicio</FieldLabel>
                <Typography.Text className="text-stone-800 block">
                  {evento.fechaInicio
                    ? dayjs(evento.fechaInicio).format("DD/MM/YYYY HH:mm")
                    : "—"}
                </Typography.Text>
              </Col>
              <Col span={24} sm={12}>
                <FieldLabel>Fecha y Hora de Fin</FieldLabel>
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
          </InfoCard>

          {/* Acceso y QR — ahora inline */}
          <InfoCard title="Acceso y QR" icon={<EyeOutlined />}>
            <Row gutter={[16, 8]} align="middle">
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
                {evento.qr ? (
                  <div className="flex flex-col items-center">
                    <Typography.Text className="text-xs text-stone-400 mb-1 block text-center">
                      Código QR de Acceso
                    </Typography.Text>
                    <QRCodeSVG
                      value={qrValue}
                      size={100}
                      fgColor={ACCENT}
                      level="H"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Typography.Text className="text-xs text-stone-400 mb-1 block text-center">
                      Código QR de Acceso
                    </Typography.Text>
                    <QRCodeSVG
                      value={qrValue}
                      size={100}
                      fgColor={ACCENT}
                      level="L"
                      style={{ opacity: 0.4 }}
                    />
                    <Typography.Text className="text-xs text-stone-400 mt-1 text-center">
                      QR pendiente
                    </Typography.Text>
                  </div>
                )}
              </Col>
            </Row>
          </InfoCard>

          {/* Materiales */}
          {(materialesList.length > 0) && (
            <InfoCard title="Materiales Requeridos" icon={<ToolOutlined />}>
              <Row gutter={[12, 12]}>
                {materialesList.map((m) => (
                  <Col key={m.id} xs={24} sm={12} md={8}>
                    <Card size="small" className="h-full border-l-2" style={{ borderLeftColor: ACCENT }}>
                      <Typography.Text strong className="text-stone-800 block">
                        {m.nombre || "Material"}
                      </Typography.Text>
                      <Typography.Text type="secondary" className="text-xs block">
                        Cantidad: {m.cantidad ?? "—"}
                      </Typography.Text>
                      {m.nota && (
                        <Typography.Text type="secondary" className="text-xs block mt-1">
                          {m.nota}
                        </Typography.Text>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            </InfoCard>
          )}

          {/* Galería */}
          {mediosList.length > 0 && (
            <InfoCard title="Galería de Imágenes y Anexos" icon={<PictureOutlined />}>
              <Image.PreviewGroup>
                <Row gutter={[16, 16]}>
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
                              className="block text-center mt-1"
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
            </InfoCard>
          )}
        </Col>

        {/* Columna lateral — Asistentes */}
        <Col xs={24} md={8} className="flex flex-col gap-4">
          <InfoCard
            title={
              <span className="flex items-center gap-2">
                <TeamOutlined style={{ color: ACCENT }} />
                Asistentes ({evento.asistentes?.length ?? 0})
              </span>
            }
            icon={null}
          >
            {evento.asistentes && evento.asistentes.length > 0 ? (
              <Row gutter={[12, 12]}>
                {evento.asistentes.map((asistente) => (
                  <Col key={asistente.id} span={24}>
                    <Card
                      size="small"
                      className="border-l-2"
                      style={{ borderLeftColor: ACCENT }}
                      bodyStyle={{ padding: "10px 12px" }}
                    >
                      <Typography.Text strong className="text-stone-800 text-sm block">
                        {asistente.nombre || "Sin nombre"}
                      </Typography.Text>
                      {asistente.expediente && (
                        <Typography.Text type="secondary" className="text-xs block">
                          Exp: {asistente.expediente}
                        </Typography.Text>
                      )}
                      {asistente.carrera && (
                        <Typography.Text type="secondary" className="text-xs block">
                          {asistente.carrera}
                        </Typography.Text>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty description="No hay asistentes registrados" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </InfoCard>
        </Col>
      </Row>
    </div>
  );
}
