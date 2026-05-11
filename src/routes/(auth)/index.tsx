import { Carrera } from "@/models/Carrera.model";
import { CategoriaEvento } from "@/models/CategoriaEvento.model";
import { UnidadAcademica } from "@/models/UnidadAcademica.model";
import { Icon } from "@iconify/react/dist/iconify.js";
import { CloseOutlined, CloudUploadOutlined, CheckCircleOutlined, EditOutlined, FileTextOutlined, KeyOutlined, LinkOutlined } from "@ant-design/icons";
import { SelectorQuery } from "@base/components/form/SelectorQuery/SelectorQuery";
import { TextAreaInput } from "@base/components/form/TextAreaInput/TextAreaInput";
import { TextInput } from "@base/components/form/TextInput/TextInput";
import { DefaultContainer } from "@base/components/layout/containers/DefaultContainer";
import { AntdFormValidation } from "@base/constants/antd-form-validation";
import { PaginaProvider } from "@base/hooks/usePagina/usePagina";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Col, ConfigProvider, DatePicker, Divider, Form, Modal, Row, Space, Steps, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import TablaMateriales from "@/components/TablaMateriales";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import VITE_ENV from "@/config/constants/vite-env";
import { Media } from "@/models/Media.model";
import { MediaSelector } from "@/routes/(auth)/medios/index";
import { Material } from "@/models/Material.model";
import { QRCodeSVG } from "qrcode.react";
import useHttp from "@base/hooks/useHttp/useHttp";
dayjs.locale('es');

const QR_ACCESS_URL = "https://eventues.app/registro-evento";

export const Route = createFileRoute("/(auth)/")({
  component: RouteComponent,
});

interface EstatusI {
  titulo: string;
  descripcion: string;
  icono: string;
  valor: string;
}

const estatusEventos: EstatusI[] = [
  {
    titulo: "Público",
    descripcion: "Visible para toda la comunidad UES",
    icono: "lucide:earth",
    valor: "publico"
  },
  {
    titulo: "Por Unidad Académica",
    descripcion: "Solo estudiantes del campus local",
    icono: "lucide:building",
    valor: "unidad academica"
  },
  {
    titulo: "Por Carrera",
    descripcion: "Restringido a carreras específicas",
    icono: "lucide:graduation-cap",
    valor: "carrera"
  },
];

const pasosConfig = [
  {
    title: "Información Básica",
    subtitulo: "Proporcione los detalles fundamentales de su evento",
  },
  {
    title: "Logística",
    subtitulo: "Defina la ubicación, horarios y recursos necesarios.",
  },
  {
    title: "Acceso y Visibilidad",
    subtitulo: "Controle el aforo y la privacidad del evento",
  },
  {
    title: "Revisión",
  },
];

const camposPorPaso: string[][] = [
  ["nombre", "categoria", "descripcion"],
  ["idUnidadAcademica", "lugar", "fechaHorario"],
  ["capacidadMinima", "capacidadMaxima", "visibilidad"],
];

const obtenerEventoGuardado = (response: any) => {
  if (Array.isArray(response?.resultado)) return response.resultado[0];
  return response?.resultado ?? response?.detalle ?? response;
};

const validarCapacidadMaxima = ({ getFieldValue }: { getFieldValue: (name: string) => unknown }) => ({
  validator(_: unknown, value: unknown) {
    const capacidadMinima = getFieldValue("capacidadMinima");
    const minimo = Number(capacidadMinima);
    const maximo = Number(value);

    if (!value || !capacidadMinima || maximo >= minimo) {
      return Promise.resolve();
    }

    return Promise.reject(new Error("El máximo debe ser mayor o igual al mínimo"));
  },
});

function RouteComponent() {
  const [form] = useForm();
  const http = useHttp();
  const [pasoActual, setPasoActual] = useState<number>(0);
  const [modalMediaAbierto, setModalMediaAbierto] = useState(false);
  const [modalAnexosAbierto, setModalAnexosAbierto] = useState(false);

  const [estado, setEstado] = useState<string>("");
  const [imagenPrincipal, setImagenPrincipal] = useState<Media | null>(null);
  const [anexos, setAnexos] = useState<Media[]>([]);
  const [fecha, setFecha] = useState<{ inicio: string, fin: string }>();
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [eventoCreadoId, setEventoCreadoId] = useState<string | number | null>(null);
  const [modalQrAbierto, setModalQrAbierto] = useState(false);
  const [creandoEvento, setCreandoEvento] = useState(false);

  const [resumen, setResumen] = useState<{
    titulo?: string,
    fecha?: string,
    hora?: string,
    ubicacion?: string,
    estatus?: string,
  }>();

  const siguiente = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    try {
      await form.validateFields(camposPorPaso[pasoActual]);
      setPasoActual((prev) => Math.min(prev + 1, pasosConfig.length - 1));
    } catch {
      // e
    }
  };

  const handleOnFinish = async () => {
    if (pasoActual < pasosConfig.length - 1) return;

    await form.validateFields(camposPorPaso.flat());

    const formValues = form.getFieldsValue();
    const datosCompletos = {
      ...formValues,
      imagenPrincipal: imagenPrincipal?.id,
      anexos: anexos.map((anexo) => anexo.id),
      materiales: materiales.map(({ nombre, cantidad, nota }) => ({ nombre, cantidad, nota })),
      fechaInicio: fecha?.inicio,
      fechaFin: fecha?.fin,
      estado: "publico",
      visibilidad: formValues.visibilidad,
    }

    delete datosCompletos.fechaHorario;

    try {
      setCreandoEvento(true);

      const response = await http.post({
        endpoint: "/v1/evento.json",
        body: datosCompletos,
      });

      const eventoGuardado = obtenerEventoGuardado(response);
      const eventoId = eventoGuardado?.id;

      if (!eventoId) return;

      setEventoCreadoId(eventoId);
      setQrUrl(null);
      setModalQrAbierto(true);
    } finally {
      setCreandoEvento(false);
    }

  };

  const generarQr = () => {
    if (!eventoCreadoId) return;
    setQrUrl(`${QR_ACCESS_URL}?id=${eventoCreadoId}`);
  };

  const cerrarModalQr = () => {
    setModalQrAbierto(false);
  };

  return (
    <PaginaProvider titulo="Inicio">
      <DefaultContainer className="h-full">
        <div className="flex justify-center items-center w-full h-auto px-20 py-8">
          <Row className="w-full h-auto max-w-5xl">
            <Col span={24} className="flex flex-col justify-center items-center mb-12 w-full h-auto">
              <Typography.Title level={2}>
                Crear Nuevo Evento
              </Typography.Title>
              <Typography.Text className="text-stone-400 pt-2">
                Complete los detalles a continuación para comenzar a planificar su evento
              </Typography.Text>
              <ConfigProvider theme={{ token: { colorPrimary: '#731C38' } }}>
                <Steps current={pasoActual} items={pasosConfig} className="pt-8" />
              </ConfigProvider>
            </Col>
            <Col span={24}>
              <Card>
                <Typography.Title level={3}>
                  Paso {pasoActual + 1}: {pasosConfig[pasoActual].title}
                </Typography.Title>
                <Typography.Text className="text-stone-400">
                  {pasosConfig[pasoActual].subtitulo}
                </Typography.Text>
                <Form
                  layout="vertical"
                  autoComplete="true"
                  form={form}
                  className="w-full h-auto pt-8"
                  preserve
                  onFinish={handleOnFinish}
                >
                  <div style={{ display: pasoActual === 0 ? "block" : "none" }}>
                    <Row gutter={[10, 10]}>
                      <Col span={24}>
                        <Form.Item
                          label="Titulo del Evento"
                          name="nombre"
                          rules={[AntdFormValidation.Requerido("El titulo es obligatorio")]}
                        >
                          <TextInput onChange={(e) => setResumen((prev) => ({ ...prev, titulo: e.target.value }))} placeholder="Ej. Feria Anual de Ciencias y Tecnología" />
                        </Form.Item>
                      </Col>
                      <Col span={24} sm={12}>
                        <Form.Item
                          label="Categoría"
                          name="categoria"
                          rules={[AntdFormValidation.Requerido("La categoría es obligatoria")]}
                        >
                          <SelectorQuery
                            queryProps={{
                              endpoint: CategoriaEvento.ENDPOINTS.DEFAULT,
                              enabled: true,
                              extraParams: {
                                ordenar: "nombre-asc",
                              },
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24} sm={12}>
                        <Form.Item
                          label="Departamento Anfitrión"
                          name="carrera"
                        >
                          <SelectorQuery
                            queryProps={{
                              endpoint: Carrera.ENDPOINTS.DEFAULT,
                              enabled: true,
                              extraParams: {
                                ordenar: "nombre-asc",
                              },
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label="Descripción del Evento"
                          name="descripcion"
                          rules={[
                            AntdFormValidation.Requerido("La descripción es obligatoria"),
                            AntdFormValidation.LongitudMinima(50, "La descripción debe tener al menos 50 caracteres"),
                          ]}
                          extra={<span className="text-sm text-stone-400 mt-0.5">Se recomienda como mínimo de 50 caracteres.</span>}
                        >
                          <TextAreaInput showCount placeholder="Proporcione una descripción detallada de los objetivos del evento, el público objetivo y lo que los participantes pueden esperar..." rows={5} maxLength={2000} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          className="w-full h-auto"
                          label="Imagen de Portada"
                          name="idImagenDestacada"
                        >
                          <div className="flex flex-col gap-3">
                            <Button
                              icon={<CloudUploadOutlined />}
                              onClick={() => setModalMediaAbierto(true)}
                              className="w-1/4 h-auto py-1"
                            >
                              Establecer imagen
                            </Button>
                            {imagenPrincipal && (
                              <div className="relative w-56 aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
                                <img
                                  src={`${VITE_ENV.BASE_API_URL}/recursos/${imagenPrincipal.ruta}`}
                                  alt={imagenPrincipal.nombre}
                                  className="h-full w-full object-contain"
                                />
                                <button
                                  type="button"
                                  onClick={() => setImagenPrincipal(null)}
                                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-red-500 hover:text-white"
                                >
                                  <CloseOutlined style={{ fontSize: 10 }} />
                                </button>
                                <Typography.Text className="absolute bottom-0 left-0 right-0 truncate bg-black/50 px-3 py-1 text-xs text-white">
                                  {imagenPrincipal.nombre}
                                </Typography.Text>
                              </div>
                            )}
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>

                  <div style={{ display: pasoActual === 1 ? "block" : "none" }}>
                    <Row gutter={[10, 10]}>
                      <Col span={24} sm={12}>
                        <Form.Item
                          label="Unidad Academica"
                          name="idUnidadAcademica"
                          rules={[AntdFormValidation.Requerido("La unidad academica es obligatoria")]}
                        >
                          <SelectorQuery
                            queryProps={{
                              endpoint: UnidadAcademica.ENDPOINTS.DEFAULT,
                              enabled: true,
                              extraParams: {
                                ordenar: "nombre-asc",
                              },
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24} sm={12}>
                        <Form.Item
                          label="Edificio y Salon"
                          name="lugar"
                          rules={[AntdFormValidation.Requerido("El lugar es obligatorio")]}
                        >
                          <TextInput onChange={(e) => setResumen((prev) => ({ ...prev, ubicacion: e.target.value }))} placeholder="Ej: Edificio K, K03" />

                        </Form.Item>
                      </Col>
                      <Col span={24} sm={12}>
                        <Form.Item
                          label="Fecha y Horario"
                          name="fechaHorario"
                          rules={[AntdFormValidation.Requerido("La fecha y horario son obligatorios")]}
                        >
                          <DatePicker.RangePicker
                            format={"DD/MM/YYYY HH:mm"}
                            showTime={{ format: 'HH:mm' }}
                            style={{
                              width: "100%",
                            }}
                            onChange={(v) => {
                              if (v && v?.length > 0) {
                                setFecha({
                                  inicio: v[0]!.format("YYYY-MM-DD HH:mm:ss"),
                                  fin: v[1]!.format("YYYY-MM-DD HH:mm:ss"),
                                });

                                setResumen((prev) => {
                                  const formatStr = "D [de] MMMM, YYYY  hh:mm a";
                                  return {
                                    ...prev,
                                    fecha: v[0]?.format(formatStr),
                                    hora: v[1]?.format(formatStr),
                                  };
                                })
                              } else {
                                setFecha(undefined);
                                setResumen((prev) => ({ ...prev, fecha: undefined, hora: undefined }));
                              }
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <TablaMateriales
                          setMateriales={setMateriales}
                          materiales={materiales}
                        />
                      </Col>
                    </Row>
                  </div>

                  <div style={{ display: pasoActual === 2 ? "block" : "none" }}>
                    <Row gutter={[10, 10]}>
                      <Col sm={12} span={24}>
                        <Form.Item
                          label="Mínimo de asistentes"
                          name="capacidadMinima"
                          rules={[AntdFormValidation.Requerido("El mínimo de asistentes es obligatorio")]}
                        >
                          <TextInput type="number" placeholder="Ej: 10" />
                        </Form.Item>
                      </Col>
                      <Col sm={12} span={24}>
                        <Form.Item
                          label="Máximo de asistentes (Aforo)"
                          name="capacidadMaxima"
                          rules={[
                            AntdFormValidation.Requerido("El máximo de asistentes es obligatorio"),
                            validarCapacidadMaxima,
                          ]}
                        >
                          <TextInput type="number" placeholder="Ej: 100" />
                        </Form.Item>
                      </Col>
                      <Divider />
                      <Row gutter={[15, 0]} align={"middle"} className="flex w-full h-auto">
                        <Col span={24}>
                          <Typography.Title level={4} className="flex items-center mb-4 text-zinc-600">
                            <Icon icon="lucide:eye" className="inline-block mr-2" /> Privacidad y Visibilidad
                          </Typography.Title>
                          <Form.Item
                            name="visibilidad"
                            rules={[AntdFormValidation.Requerido("La visibilidad es obligatoria")]}
                            className="mb-0"
                          >
                            <input type="hidden" />
                          </Form.Item>
                        </Col>
                        {
                          estatusEventos.map((estatus, index) => (
                            <Col
                              key={index}
                              sm={8} span={24}>
                              <Card
                                onClick={() => {
                                  setEstado(estatus.valor);
                                  form.setFieldValue("visibilidad", estatus.valor);
                                  void form.validateFields(["visibilidad"]);
                                }}
                                className={`cursor-pointer flex flex-col justify-center items-start gap-4 border-2 ${estado == estatus.valor ? "bg-[#f8f1f1] border-red-900" : ""} w-full h-auto`}
                              >
                                <Icon icon={estatus.icono} className="inline-block text-red-900 text-3xl mb-2" />
                                <Typography.Title level={5}>
                                  {estatus.titulo}
                                </Typography.Title>
                                <Typography.Text className="text-zinc-400">
                                  {estatus.descripcion}
                                </Typography.Text>
                              </Card>
                            </Col>
                          ))
                        }
                      </Row>
                    </Row>
                  </div>

                  <div style={{ display: pasoActual === 3 ? "block" : "none" }}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={16}>
                        <Card>
                          <Row justify={"space-between"} align={"middle"} className="mb-6">
                            <Typography.Title level={4} className="flex items-center m-0 text-zinc-800">
                              <FileTextOutlined className="mr-3 text-[#731C38] text-2xl" />
                              Resumen del Evento
                            </Typography.Title>
                            <Button
                              type="link"
                              onClick={() => setPasoActual(0)}
                              icon={<EditOutlined />}
                              className="text-[#731C38] font-medium hover:text-red-900 flex items-center gap-1"
                            >
                              Editar todo
                            </Button>
                          </Row>

                          <Col span={24} className="flex flex-col gap-0">
                            <Row className="py-5 border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors px-2 rounded-md">
                              <Col span={8}>
                                <Typography.Text className="text-zinc-400 font-medium">Título</Typography.Text>
                              </Col>
                              <Col span={16}>
                                <Typography.Text strong className="text-zinc-800 text-base">
                                  {resumen?.titulo || "—"}
                                </Typography.Text>
                              </Col>
                            </Row>

                            <Row className="py-5 border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors px-2 rounded-md">
                              <Col span={8}>
                                <Typography.Text className="text-zinc-400 font-medium">Fecha y Hora</Typography.Text>
                              </Col>
                              <Col span={16}>
                                <Typography.Text strong className="text-zinc-800">
                                  {resumen?.fecha} {resumen?.hora ? ` • ${resumen?.hora}` : ""}
                                </Typography.Text>
                              </Col>
                            </Row>

                            <Row className="py-5 border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors px-2 rounded-md">
                              <Col span={8}>
                                <Typography.Text className="text-zinc-400 font-medium">Ubicación</Typography.Text>
                              </Col>
                              <Col span={16}>
                                <Typography.Text strong className="text-[#8B1D3D] text-base">
                                  {resumen?.ubicacion || "—"}
                                </Typography.Text>
                              </Col>
                            </Row>

                            <Row className="py-5 hover:bg-zinc-50/50 transition-colors px-2 rounded-md">
                              <Col span={8}>
                                <Typography.Text className="text-zinc-400 font-medium">Visibilidad</Typography.Text>
                              </Col>
                              <Col span={16}>
                                {estado ? (
                                  <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-emerald-100 uppercase tracking-wide">
                                    {estatusEventos.find((e) => e.valor === estado)?.titulo || estado}
                                  </span>
                                ) : (
                                  <Typography.Text className="text-zinc-300 italic">No seleccionada</Typography.Text>
                                )}
                              </Col>
                            </Row>
                          </Col>
                        </Card>
                      </Col>

                      <Col xs={24} md={8}>
                        <Card
                          title={
                            <Space>
                              <KeyOutlined />
                              Generación de Acceso
                            </Space>
                          }
                          size="small"
                          className="w-auto h-full"
                        >
                          <Space direction="vertical" size="middle" className="w-full">
                            <Card className="flex flex-col justify-center items-center border-stone-400 bg-stone-50 w-full h-auto" style={{ minHeight: 180 }}>
                              {qrUrl ? (
                                <div className="flex flex-col items-center gap-3 py-4">
                                  <Typography.Text strong className="text-[#731C38]">
                                    Generación de QR
                                  </Typography.Text>
                                  <QRCodeSVG
                                    value={qrUrl}
                                    size={140}
                                    bgColor="#f8f8f8"
                                    fgColor="#731C38"
                                    level="H"
                                    includeMargin
                                  />
                                  <Typography.Text className="text-xs text-zinc-400 text-center break-all px-2">
                                    Acceso a {qrUrl}
                                  </Typography.Text>
                                  <Button
                                    size="small"
                                    danger
                                    onClick={() => setQrUrl(null)}
                                  >
                                    Limpiar QR
                                  </Button>
                                </div>
                              ) : eventoCreadoId ? (
                                <div className="flex flex-col items-center gap-3 py-4">
                                  <Typography.Text className="text-zinc-500 text-sm text-center">
                                    El evento fue creado. Puedes generar el acceso QR cuando lo necesites.
                                  </Typography.Text>
                                  <Button icon={<KeyOutlined />} onClick={generarQr}>
                                    Generar QR de Acceso
                                  </Button>
                                </div>
                              ) : (
                                <Typography.Text className="text-zinc-400 text-sm text-center">
                                  El acceso QR estará disponible después de crear el evento
                                </Typography.Text>
                              )}
                            </Card>

                            <Button type="primary" icon={<CheckCircleOutlined />} block size="large">
                              Publicar Evento
                            </Button>
                          </Space>
                        </Card>
                      </Col>
                    </Row>

                    <Row gutter={[16, 16]} className="mt-3">
                      <Col xs={24} span={24}>
                        <Card>
                          <Typography.Title level={4} className="flex items-center m-0 text-zinc-800 mb-4">
                            <LinkOutlined className="mr-3 text-[#731C38] text-2xl" />
                            Flyers Digitales y Anexos
                          </Typography.Title>
                          <Typography.Text className="text-zinc-400 mb-4">
                            Carga el material visual oficial y documentos adicionales (PDF, JPG, PNG)
                          </Typography.Text>

                          <Form.Item
                            className="w-full h-auto"
                          >
                            <div className="flex flex-col gap-3">
                              <Button
                                icon={<CloudUploadOutlined />}
                                onClick={() => setModalAnexosAbierto(true)}
                                className="w-auto h-auto py-1 mt-2"
                              >
                                Agregar Anexos al Evento
                              </Button>
                              <div className="grid sm:grid-cols-4 gap-4 w-full h-auto">
                                {anexos && (
                                  anexos.map((anexo) => (
                                    <div key={anexo.id} className="relative w-56 aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
                                      <img
                                        src={`${VITE_ENV.BASE_API_URL}/recursos/${anexo.ruta}`}
                                        alt={anexo.nombre}
                                        className="h-full w-full object-contain"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setAnexos((prev) => prev.filter((a) => a.id !== anexo.id))}
                                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-red-500 hover:text-white"
                                      >
                                        <CloseOutlined style={{ fontSize: 10 }} />
                                      </button>
                                      <Typography.Text className="absolute bottom-0 left-0 right-0 truncate bg-black/50 px-3 py-1 text-xs text-white">
                                        {anexo.nombre}
                                      </Typography.Text>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </Form.Item>
                        </Card>
                      </Col>
                    </Row>
                  </div>

                  <Row className="mt-6">
                    <Col span={12}>
                      {pasoActual === 0 ? (
                        <Button icon={<CloseOutlined />}>
                          Cancelar
                        </Button>
                      ) : (
                        <Button htmlType="button" onClick={() => setPasoActual((prev) => Math.max(prev - 1, 0))}>
                          Anterior: {pasosConfig[pasoActual - 1].title}
                        </Button>
                      )}
                    </Col>
                    <Col span={12} className="flex justify-end">
                      {pasoActual < pasosConfig.length - 1 ? (
                        <Button htmlType="button" className="bg-[#731C38] text-white" onClick={siguiente}>
                          Siguiente: {pasosConfig[pasoActual + 1].title}
                        </Button>
                      ) : (
                        <Button className="bg-[#731C38] text-white" htmlType="submit" loading={creandoEvento}>
                          Crear Evento
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </DefaultContainer>

      <Modal
        open={modalMediaAbierto}
        onCancel={() => setModalMediaAbierto(false)}
        footer={null}
        width="90vw"
        style={{ maxWidth: 1200 }}
        title="Biblioteca de Medios"
        styles={{ body: { padding: 0, maxHeight: "80vh", overflow: "auto" } }}
      >
        <MediaSelector
          onSelectMedia={(media) => {
            setImagenPrincipal(media);
            setModalMediaAbierto(false);
          }}
        />
      </Modal>

      <Modal
        open={modalAnexosAbierto}
        onCancel={() => setModalAnexosAbierto(false)}
        footer={null}
        width="90vw"
        style={{ maxWidth: 1200 }}
        title="Seleccionar Anexos"
        styles={{ body: { padding: 0, maxHeight: "80vh", overflow: "auto" } }}
      >
        <MediaSelector
          multiple
          onSelectMultiple={(medias) => {
            setAnexos((prev) => {
              const existentes = new Set(prev.map((m) => m.id));
              const nuevos = medias.filter((m) => !existentes.has(m.id));
              return [...prev, ...nuevos];
            });
            setModalAnexosAbierto(false);
          }}
        />
      </Modal>

      <Modal
        open={modalQrAbierto}
        onCancel={cerrarModalQr}
        title="Generación de QR"
        footer={
          qrUrl ? (
            <Button type="primary" onClick={cerrarModalQr}>
              Listo
            </Button>
          ) : (
            <Space>
              <Button onClick={cerrarModalQr}>
                No crear QR
              </Button>
              <Button type="primary" icon={<KeyOutlined />} onClick={generarQr}>
                Generar QR
              </Button>
            </Space>
          )
        }
      >
        {qrUrl ? (
          <Space direction="vertical" size="middle" className="w-full items-center text-center">
            <QRCodeSVG
              value={qrUrl}
              size={180}
              bgColor="#ffffff"
              fgColor="#731C38"
              level="H"
              includeMargin
            />
            <Typography.Text strong>
              Generación de QR
            </Typography.Text>
            <Typography.Text className="break-all">
              Acceso a {qrUrl}
            </Typography.Text>
          </Space>
        ) : (
          <Typography.Text>
            El evento se creó correctamente. ¿Deseas generar el QR de acceso?
          </Typography.Text>
        )}
      </Modal>
    </PaginaProvider>
  );
}
