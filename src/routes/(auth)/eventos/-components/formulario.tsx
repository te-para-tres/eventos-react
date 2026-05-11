import { IFormularioBaseProps } from "@base/interfaces/forms/FormularioBase.interface";
import { Evento } from "@/models/Evento.model";
import VITE_ENV from "@/config/constants/vite-env";
import dayjs from "dayjs";
import { Card, Col, Descriptions, Divider, Empty, Image, Row, Tag, Typography } from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  TeamOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { QRCodeSVG } from "qrcode.react";

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

  return (
    <div className="p-4 rounded-lg border border-neutral-300 bg-white">
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

      <Row justify="space-between" align="middle" className="mb-6">
        <Col>
          <Typography.Title level={2} className="!m-0">
            {evento.nombre || "Sin nombre"}
          </Typography.Title>
        </Col>
        <Col>
          <Tag color={estadoInfo.color} className="text-sm px-3 py-0.5">
            {estadoInfo.label}
          </Tag>
        </Col>
      </Row>

      <Row gutter={[24, 16]}>
        <Col xs={24} md={16}>
          <Card
            title={
              <span>
                <InfoCircleOutlined className="mr-2" />
                Información del Evento
              </span>
            }
          >
            <Descriptions column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="Categoría">
                {evento.categoriaEvento?.nombre || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Carrera / Departamento">
                {evento.carrera?.nombre || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Descripción" span={2}>
                {evento.descripcion || "Sin descripción"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            title={
              <span>
                <CalendarOutlined className="mr-2" />
                Logística
              </span>
            }
            className="mt-4"
          >
            <Descriptions column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="Unidad Académica">
                {evento.unidadAcademica?.nombre || "—"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <EnvironmentOutlined className="mr-1" />
                    Lugar
                  </span>
                }
              >
                {evento.lugar || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Fecha y Hora de Inicio">
                {evento.fechaInicio
                  ? dayjs(evento.fechaInicio).format("DD/MM/YYYY HH:mm")
                  : "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Fecha y Hora de Fin">
                {evento.fechaFin
                  ? dayjs(evento.fechaFin).format("DD/MM/YYYY HH:mm")
                  : "—"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {evento.eventoMaterial && evento.eventoMaterial.length > 0 && (
            <Card
              title={
                <span>
                  <ToolOutlined className="mr-2" />
                  Materiales Requeridos
                </span>
              }
              className="mt-4"
            >
              <Row gutter={[12, 12]}>
                {evento.eventoMaterial.map((em) => (
                  <Col key={em.id} xs={24} sm={12} md={8}>
                    <Card size="small" className="h-full">
                      <Typography.Text strong>
                        {em.material?.nombre || "Material"}
                      </Typography.Text>
                      <br />
                      <Typography.Text type="secondary">
                        Cantidad: {em.cantidad}
                      </Typography.Text>
                      {em.material?.nota && (
                        <>
                          <br />
                          <Typography.Text
                            type="secondary"
                            style={{ fontSize: 12 }}
                          >
                            {em.material.nota}
                          </Typography.Text>
                        </>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          )}
        </Col>

        <Col xs={24} md={8}>
          <Card
            title={
              <span>
                <TeamOutlined className="mr-2" />
                Acceso y Visibilidad
              </span>
            }
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Capacidad">
                {evento.capacidadMinima ?? 0} –{" "}
                {evento.capacidadMaxima ?? "Sin límite"} asistentes
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <EyeOutlined className="mr-1" />
                    Visibilidad
                  </span>
                }
              >
                {evento.visibilidad}
              </Descriptions.Item>
            </Descriptions>

            {evento.qr && (
              <>
                <Divider />
                <Typography.Text type="secondary" className="block mb-2">
                  Código QR de Acceso
                </Typography.Text>
                <div className="flex justify-center">
                  <QRCodeSVG
                    value={`https://eventues.app/registro-evento?evento=${evento.id}`}
                    size={150}
                    fgColor="#731C38"
                    level="H"
                  />
                </div>
              </>
            )}
          </Card>
        </Col>

        {evento.eventoMedia && evento.eventoMedia.length > 0 && (
          <Col span={24}>
            <Card
              title={
                <span>
                  <PictureOutlined className="mr-2" />
                  Galería de Imágenes y Anexos
                </span>
              }
            >
              <Image.PreviewGroup>
                <Row gutter={[16, 16]}>
                  {evento.eventoMedia.map((em) => {
                    const ruta = em.media?.ruta;
                    const nombre = em.media?.nombre || "Sin nombre";
                    const url = ruta
                      ? `${VITE_ENV.BASE_API_URL}/recursos/${ruta}`
                      : "";

                    return (
                      <Col key={em.id} xs={12} sm={8} md={6} lg={4}>
                        {esImagen(em.media?.extension) && url ? (
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
                          <Card
                            size="small"
                            className="flex flex-col items-center justify-center text-center h-full"
                          >
                            <Typography.Text
                              strong
                              className="block"
                              style={{ fontSize: 12 }}
                            >
                              {nombre}
                            </Typography.Text>
                            <Typography.Text
                              type="secondary"
                              style={{ fontSize: 11 }}
                            >
                              {em.media?.extension?.toUpperCase() ||
                                "Archivo"}
                            </Typography.Text>
                          </Card>
                        )}
                      </Col>
                    );
                  })}
                </Row>
              </Image.PreviewGroup>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}
