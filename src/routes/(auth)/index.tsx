import LocalStorageManager from "@/config/constants/localstorage-manager";
import { Carrera } from "@/models/Carrera.model";
import { CategoriaEvento } from "@/models/CategoriaEvento.model";
import { UnidadAcademica } from "@/models/UnidadAcademica.model";
import { Icon } from "@iconify/react/dist/iconify.js";
import { CloseOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { SelectorQuery } from "@base/components/form/SelectorQuery/SelectorQuery";
import { TextAreaInput } from "@base/components/form/TextAreaInput/TextAreaInput";
import { TextInput } from "@base/components/form/TextInput/TextInput";
import { DefaultContainer } from "@base/components/layout/containers/DefaultContainer";
import { PaginaProvider } from "@base/hooks/usePagina/usePagina";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Col, ConfigProvider, Form, Row, Steps, Typography, Upload, DatePicker as AntdDatePicker, Divider } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import TablaMateriales from "@/components/TablaMateriales";
import dayjs from "dayjs";
import 'dayjs/locale/es';

dayjs.locale('es');

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

function RouteComponent() {
  const [form] = useForm();
  const token = localStorage.getItem(LocalStorageManager.TOKEN) || "";
  const [pasoActual, setPasoActual] = useState<number>(0);
  const [estado, setEstado] = useState<string>("");
  const [resumen, setResumen] = useState<{
    titulo?: string,
    fecha?: string,
    hora?: string,
    ubicacion?: string,
    estatus?: string,
  }>();

  const siguiente = async () => {
    try {
      await form.validateFields();
      setPasoActual((prev) => Math.min(prev + 1, pasosConfig.length - 1));
    } catch {
      // e
    }
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
                <Form layout="vertical" autoComplete="true" form={form} className="w-full h-auto pt-8" preserve>
                  <div style={{ display: pasoActual === 0 ? "block" : "none" }}>
                    <Row gutter={[10, 10]}>
                      <Col span={24}>
                        <Form.Item
                          label="Titulo del Evento"
                          name="nombre"
                        // rules={[AntdFormValidation.Requerido("El titulo es obligatorio")]}
                        >
                          <TextInput onChange={(e) => setResumen((prev) => ({ ...prev, titulo: e.target.value }))} placeholder="Ej. Feria Anual de Ciencias y Tecnología" />
                        </Form.Item>
                      </Col>
                      <Col span={24} sm={12}>
                        <Form.Item
                          label="Categoría"
                          name="categoria"
                        // rules={[AntdFormValidation.Requerido("La categoría es obligatoria")]}
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
                          // rules={[AntdFormValidation.Requerido("La descripción es obligatoria")]}
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
                          <Upload
                            style={{ width: "100%", height: "auto" }}
                            showUploadList={false}
                            multiple
                            accept="image/*"
                            name="archivo"
                          >
                            <div className="bg-neutral-100 hover:bg-neutral-50 w-auto h-48 p-4 rounded-lg border border-zinc-300 border-dashed cursor-pointer flex flex-col items-center justify-center text-lg text-neutral-950 hover:text-neutral-500 text-center">
                              <CloudUploadOutlined style={{ fontSize: 50 }} className="text-[#731C38] bg-[#EAE3E8] p-4 rounded-full" />
                              <Typography.Title level={5} className="text-stone-700 mt-2">
                                Haga clic para cargar o arrastre y suelte
                              </Typography.Title>
                              <Typography.Text className="text-sm text-stone-500">
                                PNG, JPG o WEBP (Recomendado 16:9, min. 1200x675 px)
                              </Typography.Text>
                            </div>
                          </Upload>
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
                        // rules={[AntdFormValidation.Requerido("La unidad academica es obligatoria")]}
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
                        // rules={[AntdFormValidation.Requerido("El lugar es obligatorio")]}
                        >
                          <TextInput onChange={(e) => setResumen((prev) => ({ ...prev, ubicacion: e.target.value }))} placeholder="Ej: Edificio K, K03" />

                        </Form.Item>
                      </Col>
                      <Col span={24} sm={12}>
                        <Form.Item
                          label="Fecha y Horario"
                          name=""
                        // rules={[AntdFormValidation.Requerido("El lugar es obligatorio")]}
                        >
                          <AntdDatePicker.RangePicker
                            format={"DD/MM/YYYY HH:mm"}
                            showTime={{ format: 'HH:mm' }}
                            style={{
                              width: "100%",
                            }}
                            onChange={(v: any) => {
                              if (v && v?.length > 0) {
                                setResumen((prev) => {
                                  const formatStr = "D [de] MMMM, YYYY  hh:mm a";
                                  return {
                                    ...prev,
                                    fecha: v[0]?.format(formatStr),
                                    hora: v[1]?.format(formatStr),
                                  };
                                })
                                // setRequestParams((prev) => ({
                                //   ...prev,
                                //   inicio: v[0]!
                                //     .startOf("day")
                                //     .format("YYYY-MM-DD 00:00:00"),
                                //   fin: v[1]!.endOf("day").format("YYYY-MM-DD 23:59:59"),
                                // }));
                              }
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <TablaMateriales />
                      </Col>
                    </Row>
                  </div>

                  <div style={{ display: pasoActual === 2 ? "block" : "none" }}>
                    <Row gutter={[10, 10]}>
                      <Col sm={12} span={24}>
                        <Form.Item
                          label="Mínimo de asistentes"
                          name="capacidadMinima"
                        >
                          <TextInput type="number" placeholder="Ej: 10" />
                        </Form.Item>
                      </Col>
                      <Col sm={12} span={24}>
                        <Form.Item
                          label="Máximo de asistentes (Aforo)"
                          name="capacidadMaxima"
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
                        </Col>
                        {
                          estatusEventos.map((estatus) => (
                            <Col sm={8} span={24}>
                              <Card onClick={() => setEstado(estatus.valor)} className={`flex flex-col justify-center items-start gap-4 border-2 ${estado == estatus.valor ? "bg-[#f8f1f1] border-red-900" : ""} w-full h-auto`}>
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
                    <Row gutter={[10, 10]}>
                      <Col sm={16} span={24}>
                        <Card className="shadow-sm border-zinc-100 overflow-hidden">
                          <Row justify={"space-between"} align={"middle"} className="mb-6">
                            <Typography.Title level={4} className="flex items-center m-0 text-zinc-800">
                              <Icon icon={"lucide:file-text"} className="mr-3 text-[#731C38] text-2xl" />
                              Resumen del Evento
                            </Typography.Title>
                            <Button
                              type="link"
                              onClick={() => setPasoActual(0)}
                              icon={<Icon icon={"lucide:pencil"} className="text-xs" />}
                              className="text-[#731C38] font-medium hover:text-red-900 flex items-center gap-1"
                            >
                              Editar todo
                            </Button>
                          </Row>

                          <div className="flex flex-col gap-0">
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
                          </div>
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
                        <Button onClick={() => setPasoActual((prev) => Math.max(prev - 1, 0))}>
                          Anterior: {pasosConfig[pasoActual - 1].title}
                        </Button>
                      )}
                    </Col>
                    <Col span={12} className="flex justify-end">
                      {pasoActual < pasosConfig.length - 1 ? (
                        <Button className="bg-[#731C38] text-white" onClick={siguiente}>
                          Siguiente: {pasosConfig[pasoActual + 1].title}
                        </Button>
                      ) : (
                        <Button className="bg-[#731C38] text-white" htmlType="submit">
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
    </PaginaProvider>
  );
}
