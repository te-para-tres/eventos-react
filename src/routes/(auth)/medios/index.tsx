import { DefaultContainer } from "@base/components/layout/containers/DefaultContainer";
import { PaginaProvider, usePagina } from "@base/hooks/usePagina/usePagina";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Checkbox, Col, Input, Modal, Row, Select, Typography, Upload } from "antd";
import {
  ClearOutlined,
  CloseOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FileUnknownOutlined,
  FileWordOutlined,
  FolderOpenOutlined,
  MinusOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Media, Media as ModelClass } from "@/models/Media.model";
import useHttp from "@base/hooks/useHttp/useHttp";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth/useAuth";
import VITE_ENV from "@/config/constants/vite-env";
import { TipoArchivo } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@mantine/hooks";


interface Props {
  multiple?: boolean;
  onSelectMedia?: (media: Media) => void;
  onSelectMultiple?: (medias: Media[]) => void;
}

const tiposArchivo: Record<string, TipoArchivo> = {
  pdf: { label: "PDF", Icon: FilePdfOutlined, bg: "bg-red-50", text: "text-red-500", tagBg: "bg-red-100/70 text-red-700" },
  doc: { label: "DOC", Icon: FileWordOutlined, bg: "bg-blue-50", text: "text-blue-500", tagBg: "bg-blue-100/70 text-blue-700" },
  docx: { label: "DOCX", Icon: FileWordOutlined, bg: "bg-blue-50", text: "text-blue-500", tagBg: "bg-blue-100/70 text-blue-700" },
  word: { label: "WORD", Icon: FileWordOutlined, bg: "bg-blue-50", text: "text-blue-500", tagBg: "bg-blue-100/70 text-blue-700" },
  xls: { label: "XLS", Icon: FileExcelOutlined, bg: "bg-emerald-50", text: "text-emerald-500", tagBg: "bg-emerald-100/70 text-emerald-700" },
  xlsx: { label: "XLSX", Icon: FileExcelOutlined, bg: "bg-emerald-50", text: "text-emerald-500", tagBg: "bg-emerald-100/70 text-emerald-700" },
  csv: { label: "CSV", Icon: FileExcelOutlined, bg: "bg-emerald-50", text: "text-emerald-500", tagBg: "bg-emerald-100/70 text-emerald-700" },
  xml: { label: "XML", Icon: FileTextOutlined, bg: "bg-orange-50", text: "text-orange-500", tagBg: "bg-orange-100/70 text-orange-700" },
  pptx: { label: "PPTX", Icon: FilePptOutlined, bg: "bg-orange-50", text: "text-orange-500", tagBg: "bg-orange-100/70 text-orange-700" },
  ppt: { label: "PPT", Icon: FilePptOutlined, bg: "bg-orange-50", text: "text-orange-500", tagBg: "bg-orange-100/70 text-orange-700" },
  txt: { label: "TXT", Icon: FileTextOutlined, bg: "bg-gray-50", text: "text-gray-500", tagBg: "bg-gray-100/70 text-gray-700" },
  png: { label: "PNG" },
  jpg: { label: "JPG" },
  jpeg: { label: "JPEG" },
  webp: { label: "WEBP" },
};

const FALLBACK_META: TipoArchivo = {
  label: "ARCHIVO",
  Icon: FileUnknownOutlined,
  bg: "bg-slate-50",
  text: "text-slate-500",
  tagBg: "bg-slate-100/70 text-slate-700",
};

function getFileTypeMeta(extension?: string): TipoArchivo {
  const ext = extension?.toLowerCase().replace(/^\./, "");
  if (!ext) return FALLBACK_META;
  return tiposArchivo[ext] ?? { ...FALLBACK_META, label: ext.toUpperCase() };
}

export function MediaSelector({ onSelectMedia, onSelectMultiple, multiple = false }: Props) {
  return (
    <PaginaProvider titulo="Medios">
      <RouteComponent onSelectMedia={onSelectMedia} onSelectMultiple={onSelectMultiple} multiple={multiple} />
    </PaginaProvider>
  );
}

export const Route = createFileRoute("/(auth)/medios/")({
  component: () => (
    <PaginaProvider titulo={`Listado de ${ModelClass.CLASS_NAME}s`}>
      <RouteComponent />
    </PaginaProvider>
  ),
});

function RouteComponent({ onSelectMedia, onSelectMultiple, multiple = false }: Props) {
  const { setRequestParams, requestParams, notification } = usePagina();
  const http = useHttp();
  const { token } = useAuth();
  const [mostrar, setMostrar] = useState(false);
  const [buscador, setBuscador] = useState("");
  const [tipoArchivo, setTipoArchivo] = useState("");
  const [vistaPrevia, setVistaPrevia] = useState<InstanceType<typeof ModelClass> | null>(null);
  const [debouncedBuscador] = useDebouncedValue(buscador, 300);
  const [selectedMedias, setSelectedMedias] = useState<Media[]>([]);

  const toggleMedia = (item: Media) => {
    setSelectedMedias(prev => {
      const exists = prev.some(m => m.id === item.id);
      if (exists) return prev.filter(m => m.id !== item.id);
      return [...prev, item];
    });
  };

  useEffect(() => {
    if (!multiple) setSelectedMedias([]);
  }, [multiple]);

  const mediasQuery = useQuery({
    queryKey: [ModelClass.ENDPOINTS.DEFAULT, requestParams],
    queryFn: () => http.get({ endpoint: ModelClass.ENDPOINTS.DEFAULT, params: { ...requestParams, limite: -1 } }),
  });

  const media = useMemo(
    () => ModelClass.fromJsonList(mediasQuery.data?.resultado ?? []),
    [mediasQuery.data]
  );

  const eliminar = (id: string) => {
    http.defaultDelete({
      modalContent: <p>¿Está seguro de querer eliminar este archivo?</p>,
      requestParams: {
        endpoint: ModelClass.ENDPOINTS.DEFAULT,
        params: { id },
        onSuccess: () => mediasQuery.refetch(),
      },
    });
  };

  const handleTipoChange = (value: string) => {
    const v = (value || "").toLowerCase();
    setTipoArchivo(v);
    setRequestParams(prev => {
      const next = { ...prev };
      if (v) {
        next.tipo = v;
      } else {
        delete next.tipo;
      }
      return next;
    });
  };

  const handleLimpiarFiltros = () => {
    setBuscador("");
    setTipoArchivo("");
    setRequestParams(prev => {
      const { buscar: _b, tipo: _t, ...rest } = prev;
      return rest;
    });
  };

  useEffect(() => {
    setRequestParams(prev => {
      if (!debouncedBuscador && !prev.buscar) return prev;
      const next = { ...prev };
      if (debouncedBuscador) {
        next.buscar = debouncedBuscador;
      } else {
        delete next.buscar;
      }
      return next;
    });
  }, [debouncedBuscador, setRequestParams]);

  return (
    <DefaultContainer className="h-full">
      <Row gutter={[24, 16]}>
        <Col span={24}>
          <div>
            <Row justify="space-between" align="middle" className="gap-3">
              <Col>
                <Typography.Title level={3} className="m-0 text-gray-900">
                  Medios
                </Typography.Title>
                <Typography.Text className="mt-1 flex items-center gap-2 text-gray-500">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <Typography.Text strong className="text-gray-700">
                    {media.length}
                  </Typography.Text>
                  {media.length === 1 ? "Archivo" : "Archivos"} en tu biblioteca
                </Typography.Text>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={() => setMostrar(prev => !prev)}
                  icon={mostrar ? <MinusOutlined /> : <PlusOutlined />}
                >
                  {mostrar ? "Cancelar" : "Añadir archivo"}
                </Button>
              </Col>
            </Row>

            {mostrar && (
              <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
                <Typography.Title level={5} className="mb-3 flex items-center gap-2 text-[13px] uppercase tracking-[0.08em] text-gray-700">
                  <CloudUploadOutlined className="text-gray-400 text-xs" />
                  Subir archivos
                </Typography.Title>
                <div className="rounded-md border border-dashed border-gray-300 bg-gray-50/50 px-6 py-10 transition-colors hover:border-gray-400 hover:bg-gray-50">
                  <Upload
                    showUploadList={false}
                    name="archivo"
                    multiple
                    onChange={(v) => {
                      if (v.file.status === "done") {
                        mediasQuery.refetch();
                        notification.success({
                          message: "Archivo subido",
                          description: v.file.name,
                        });
                      }
                    }}
                    action={`${VITE_ENV.BASE_API_URL}/v1/subir-archivo.json`}
                    headers={{ Authorization: `Bearer ${token}`.replace(/"/g, "") }}
                    className="[&_.ant-upload]:!block [&_.ant-upload]:!w-full [&_.ant-upload]:!cursor-pointer [&_.ant-upload]:!bg-transparent [&_.ant-upload]:!border-0 [&_.ant-upload]:!p-0"
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900 text-white transition-transform hover:-translate-y-0.5">
                        <CloudUploadOutlined className="text-2xl" />
                      </div>
                      <div className="space-y-1">
                        <Typography.Text strong className="block text-sm text-gray-900">
                          Haz clic o arrastra archivos aquí
                        </Typography.Text>
                        <Typography.Text className="block text-xs text-gray-500">
                          Soporta carga individual o múltiple · Imágenes, videos y documentos
                        </Typography.Text>
                      </div>
                    </div>
                  </Upload>
                </div>
              </div>
            )}

            <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-4">
                <Typography.Text className="mb-2 block text-xs font-medium uppercase tracking-[0.06em] text-gray-500">
                  Filtros
                </Typography.Text>
                <Row align="middle" gutter={[8, 0]} wrap={false}>
                  <Col>
                    <Input
                      prefix={<SearchOutlined className="text-gray-400 text-xs" />}
                      suffix={
                        buscador ? (
                          <CloseOutlined
                            className="text-gray-400 cursor-pointer hover:text-gray-700 text-xs"
                            onClick={() => setBuscador("")}
                            aria-label="Limpiar búsqueda"
                          />
                        ) : null
                      }
                      value={buscador}
                      onChange={e => setBuscador(e.target.value)}
                      placeholder="Buscar..."
                      className="w-52 text-sm"
                    />
                  </Col>
                  <Col>
                    <Select
                      value={tipoArchivo || ""}
                      onChange={handleTipoChange}
                      options={[
                        { value: "", label: "Todos" },
                        ...Object.entries(tiposArchivo).map(([value, { label }]) => ({ value, label })),
                      ]}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label as string ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                      placeholder="Tipo de archivo"
                      style={{ minWidth: 160 }}
                    />
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      icon={<ClearOutlined />}
                      onClick={handleLimpiarFiltros}
                    />
                  </Col>
                </Row>
              </div>

              {media.length === 0 && !mediasQuery.isLoading ? (
                <div className="rounded-md border border-dashed border-gray-200 px-6 py-14 text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                    <FolderOpenOutlined style={{ fontSize: 18 }} />
                  </div>
                  <Typography.Text strong className="block text-sm text-gray-700">
                    La biblioteca está vacía
                  </Typography.Text>
                  <Typography.Text className="block mt-0.5 text-xs text-gray-400">
                    Los archivos que subas aparecerán aquí
                  </Typography.Text>
                </div>
              ) : (
                <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                  {media.map((item) => {
                    const fileMeta = getFileTypeMeta(item.extension);
                    const hasIcon = !!fileMeta.Icon;
                    const FileIcon = hasIcon ? fileMeta.Icon! : FileImageOutlined;

                    return (
                      <article
                        key={item.id}
                        className={`group relative overflow-hidden rounded-md border bg-white transition-all ${multiple ? 'cursor-pointer' : ''} ${multiple && selectedMedias.some(m => m.id === item.id) ? 'border-sky-500 ring-2 ring-sky-200' : 'border-gray-200'} hover:border-gray-300 hover:shadow-[0_12px_24px_-16px_rgba(0,0,0,0.15)]`}
                        onClick={() => {
                          if (multiple) toggleMedia(item);
                        }}
                      >
                        <div className={`relative aspect-square overflow-hidden ${hasIcon ? fileMeta.bg : "bg-gray-50"}`}>
                          {multiple && (
                            <div className="absolute left-2 top-2 z-20">
                              <Checkbox
                                checked={selectedMedias.some(m => m.id === item.id)}
                                onClick={(e) => e.stopPropagation()}
                                onChange={() => toggleMedia(item)}
                              />
                            </div>
                          )}
                          {hasIcon ? (
                            item.extension?.toLowerCase().replace(/^\./, "") === "pdf" ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  if (multiple) e.stopPropagation();
                                  setVistaPrevia(item);
                                }}
                                className="flex h-full w-full flex-col items-center justify-center gap-2 transition-transform duration-500 ease-out group-hover:scale-105 hover:cursor-pointer focus:outline-none"
                                aria-label={`Vista previa de ${item.nombre}`}
                              >
                                <FileIcon className={`text-5xl drop-shadow-sm ${fileMeta.text}`} />
                                <Typography.Text className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] ${fileMeta.tagBg}`}>
                                  {fileMeta.label}
                                </Typography.Text>
                              </button>
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-2 transition-transform duration-500 ease-out group-hover:scale-105">
                                <FileIcon className={`text-5xl drop-shadow-sm ${fileMeta.text}`} />
                                <Typography.Text className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] ${fileMeta.tagBg}`}>
                                  {fileMeta.label}
                                </Typography.Text>
                              </div>
                            )
                          ) : (
                            <img
                              src={`${VITE_ENV.BASE_API_URL}/recursos/${item.ruta}`}
                              alt={item.nombre}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                          )}

                          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-gray-900/75 via-gray-900/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                          <div className="absolute inset-x-2 bottom-2 flex translate-y-2 items-center gap-1.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (multiple) {
                                  toggleMedia(item);
                                } else {
                                  onSelectMedia?.(item);
                                }
                              }}
                              className="flex-1 rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-900 hover:text-white"
                            >
                              Seleccionar
                            </button>
                            <button
                              onClick={(e) => {
                                if (multiple) e.stopPropagation();
                                eliminar(item.id!);
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-gray-600 shadow-sm transition-colors hover:bg-red-500 hover:text-white"
                              aria-label="Eliminar"
                            >
                              <DeleteOutlined style={{ fontSize: 10 }} />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-2.5 py-2">
                          <Typography.Text
                            className="truncate text-xs font-medium text-gray-700"
                            title={item.nombre}
                          >
                            {item.nombre}
                          </Typography.Text>
                          <FileIcon className="shrink-0 text-[10px] text-gray-300 transition-colors group-hover:text-gray-500" />
                        </div>
                      </article>
                    );
                  })}
                </div>
                {multiple && selectedMedias.length > 0 && (
                  <div className="sticky bottom-0 mt-4 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                    <Row align="middle" justify="space-between">
                      <Col>
                        <Typography.Text strong className="text-sm text-gray-700">
                          {selectedMedias.length} seleccionados
                        </Typography.Text>
                      </Col>
                      <Col>
                        <Row gutter={[8, 0]}>
                          <Col>
                            <Button onClick={() => setSelectedMedias([])}>
                              Limpiar selección
                            </Button>
                          </Col>
                          <Col>
                            <Button type="primary" onClick={() => onSelectMultiple?.(selectedMedias)}>
                              Confirmar selección
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                )}
              </>
              )}
            </div>

            <Modal
              open={!!vistaPrevia}
              onCancel={() => setVistaPrevia(null)}
              footer={null}
              width="90vw"
              style={{ maxWidth: 1024 }}
              styles={{ body: { padding: 0, height: "calc(85vh - 55px)", overflow: "hidden", background: "#f3f4f6" } }}
              title={
                <span className="flex items-center gap-2">
                  <FilePdfOutlined className="text-red-500" />
                  <Typography.Text strong className="truncate text-sm text-gray-800">
                    {vistaPrevia?.nombre}
                  </Typography.Text>
                </span>
              }
            >
              {vistaPrevia && (
                <iframe
                  src={`${VITE_ENV.BASE_API_URL}/recursos/${vistaPrevia.ruta}`}
                  title={vistaPrevia.nombre}
                  className="w-full border-0"
                  style={{ height: "calc(85vh - 55px)" }}
                />
              )}
            </Modal>

          </div>
        </Col>
      </Row>
    </DefaultContainer>
  );
}
