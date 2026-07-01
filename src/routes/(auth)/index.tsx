import { Evento as ModelClass } from "@/models/Evento.model";
import useHttp from "@base/hooks/useHttp/useHttp";
import { PaginaProvider } from "@base/hooks/usePagina/usePagina";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Skeleton, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/es";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import {
  ArrowRightOutlined,
  CalendarOutlined,
  EyeOutlined,
  PictureOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import VITE_ENV from "@/config/constants/vite-env";

dayjs.locale("es");

export const Route = createFileRoute("/(auth)/")({
  component: () => (
    <PaginaProvider titulo="Inicio">
      <RouteComponent />
    </PaginaProvider>
  ),
});

const PRIMARY = "#731C38";
const PRIMARY_SOFT = "rgba(115, 28, 56, 0.1)";
const PRIMARY_SOFTER = "rgba(115, 28, 56, 0.06)";

function StatCard({
  title,
  value,
  loading,
}: {
  title: string;
  value: number;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <Typography.Text className="block text-xs font-medium capitalize tracking-normal text-stone-500">
        {title}
      </Typography.Text>
      {loading ? (
        <Skeleton.Input active size="large" style={{ width: 80, marginTop: 8 }} />
      ) : (
        <div className="mt-2 text-3xl font-bold tracking-tight text-stone-800">
          {value.toLocaleString("es-MX")}
        </div>
      )}
    </div>
  );
}

function EventosPorMesChart({
  data,
}: {
  data: { label: string; count: number }[];
}) {
  const labels = data.map((d) => d.label);
  const series = [{ name: "Eventos", data: data.map((d) => d.count) }];
  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
      foreColor: "#57534e",
    },
    plotOptions: { bar: { borderRadius: 8, columnWidth: "55%" } },
    colors: [PRIMARY],
    xaxis: {
      categories: labels,
      labels: { style: { colors: "#78716c", fontWeight: 500 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#a8a29e" } },
      axisBorder: { show: false },
    },
    dataLabels: { enabled: false },
    grid: { borderColor: "#f5f5f4", strokeDashArray: 4 },
    tooltip: { theme: "light" },
  };
  return (
    <ReactApexChart
      type="bar"
      series={series}
      options={options}
      height={280}
    />
  );
}

function TopEventosChart({
  data,
}: {
  data: { nombre: string; total: number; id: string | number }[];
}) {
  const ordered = [...data].sort((a, b) => a.total - b.total);
  const labels = ordered.map((d) =>
    d.nombre.length > 22 ? `${d.nombre.slice(0, 22)}…` : d.nombre
  );
  const series = [{ name: "Asistentes", data: ordered.map((d) => d.total) }];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
      foreColor: "#57534e",
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: true,
        barHeight: "60%",
        distributed: false,
      },
    },
    colors: [PRIMARY],
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      offsetX: 0,
      style: { colors: ["#44403c"], fontWeight: 600, fontSize: "12px" },
    },
    xaxis: {
      labels: { style: { colors: "#a8a29e" } },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#57534e", fontWeight: 500 } },
    },
    grid: { borderColor: "#f5f5f4", strokeDashArray: 4 },
    tooltip: { theme: "light" },
  };
  return (
    <ReactApexChart
      type="bar"
      series={series}
      options={{ ...options, xaxis: { ...options.xaxis, categories: labels } }}
      height={Math.max(280, ordered.length * 44)}
    />
  );
}

function RecentEventsList({ eventos }: { eventos: any[] }) {
  return (
    <ul className="divide-y divide-stone-100">
      {eventos.map((evt) => {
        const imgSrc = evt.imagenDestacada?.ruta
          ? `${VITE_ENV.BASE_API_URL}/recursos/${evt.imagenDestacada.ruta}`
          : null;
        return (
          <li key={evt.id}>
            <Link
              to="/eventos/detalle"
              search={{ id: evt.id }}
              className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-stone-50"
            >
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={evt.nombre}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{ background: PRIMARY_SOFTER, color: PRIMARY }}
                  >
                    <CalendarOutlined style={{ fontSize: 20 }} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Typography.Text
                  strong
                  className="block truncate text-sm text-stone-800"
                >
                  {evt.nombre}
                </Typography.Text>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                  {evt.fechaInicio && (
                    <span className="inline-flex items-center gap-1">
                      <CalendarOutlined style={{ fontSize: 11 }} />
                      {dayjs(evt.fechaInicio).format("DD MMM YYYY")}
                    </span>
                  )}
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                    style={{ background: PRIMARY_SOFT, color: PRIMARY }}
                  >
                    <EyeOutlined style={{ fontSize: 10 }} />
                    {evt.visibilidad === "publico"
                      ? "Público"
                      : evt.visibilidad === "unidad academica"
                      ? "Unidad Académica"
                      : "Carrera"}
                  </span>
                </div>
              </div>
              <ArrowRightOutlined
                className="text-stone-300 transition-colors group-hover:text-stone-500"
                style={{ fontSize: 14 }}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function MediaRecienteGallery({ medios }: { medios: any[] }) {
  if (!medios || medios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-200 bg-stone-50 px-6 py-12 text-center">
        <div
          className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ background: PRIMARY_SOFT, color: PRIMARY }}
        >
          <PictureOutlined style={{ fontSize: 20 }} />
        </div>
        <Typography.Text strong className="block text-sm text-stone-700">
          Aún no hay medios
        </Typography.Text>
        <Typography.Text className="mt-0.5 block text-xs text-stone-500">
          Sube imágenes y archivos en la sección de Medios
        </Typography.Text>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {medios.map((media: any) => {
        const ruta = media.ruta;
        if (!ruta) return null;
        const src = `${VITE_ENV.BASE_API_URL}/recursos/${ruta}`;
        const isImg =
          media.extension &&
          ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
            media.extension.toLowerCase().replace(/^\./, "")
          );
        return (
          <a
            key={media.id}
            href={src}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square overflow-hidden rounded-xl border border-stone-200 bg-stone-100"
          >
            {isImg ? (
              <img
                src={src}
                alt={media.nombre ?? "Imagen"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center"
                style={{ background: PRIMARY_SOFTER, color: PRIMARY }}
              >
                <PictureOutlined style={{ fontSize: 24 }} />
                <span className="line-clamp-2 text-xs font-medium text-stone-700">
                  {media.nombre ?? "Archivo"}
                </span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="block truncate text-xs font-medium text-white">
                {media.nombre ?? "Sin nombre"}
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}

function EmptyCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-200 bg-stone-50 px-6 py-10 text-center">
      <div
        className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: PRIMARY_SOFT, color: PRIMARY }}
      >
        {icon}
      </div>
      <Typography.Text strong className="block text-sm text-stone-700">
        {title}
      </Typography.Text>
      <Typography.Text className="mt-0.5 block text-xs text-stone-500">
        {subtitle}
      </Typography.Text>
    </div>
  );
}

function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
        <h2 className="text-base font-semibold tracking-tight text-stone-800">
          {title}
        </h2>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function RouteComponent() {
  const http = useHttp();
  const fechaDesde = dayjs().subtract(11, "month").startOf("month").toISOString();

  const eventosQuery = useQuery({
    queryKey: ["dashboard-eventos", http, fechaDesde],
    queryFn: () =>
      http.get({
        endpoint: ModelClass.ENDPOINTS.DEFAULT,
        params: {
          ordenar: "id-desc",
          limite: 200,
          fechaDesde,
          expand: ModelClass.EXPAND.DEFAULT,
        },
      }),
  });

  const mediosQuery = useQuery({
    queryKey: ["dashboard-medios", http],
    queryFn: () =>
      http.get({
        endpoint: "/v1/media.json",
        params: { ordenar: "id-desc", limite: 12 },
      }),
  });

  const eventosRaw: any[] = eventosQuery.data?.resultado ?? [];
  const mediosRaw: any[] = mediosQuery.data?.resultado ?? [];

  const totalEventos = eventosQuery.data?.paginacion?.total ?? eventosRaw.length;

  const now = dayjs();
  const eventosPorMes: { label: string; count: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = now.subtract(i, "month");
    const raw = d.format("MMM YYYY");
    const label = raw.charAt(0).toUpperCase() + raw.slice(1);
    eventosPorMes.push({ label, count: 0 });
  }
  for (const evt of eventosRaw) {
    if (!evt.fechaInicio) continue;
    const keyRaw = dayjs(evt.fechaInicio).format("MMM YYYY");
    const key = keyRaw.charAt(0).toUpperCase() + keyRaw.slice(1);
    const bucket = eventosPorMes.find((m) => m.label === key);
    if (bucket) bucket.count += 1;
  }

  const eventosPorAnio = eventosRaw.reduce<Record<string, number>>((acc, evt) => {
    if (evt.fechaInicio) {
      const anio = dayjs(evt.fechaInicio).year().toString();
      acc[anio] = (acc[anio] ?? 0) + 1;
    }
    return acc;
  }, {});

  const topConAsistentes = eventosRaw
    .filter((e) => (e.asistentes?.length ?? 0) > 0)
    .map((e) => ({
      id: e.id,
      nombre: e.nombre ?? "Sin nombre",
      total: e.asistentes?.length ?? 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const eventosRecientes = eventosRaw.slice(0, 5);

  const totalAsistentes = eventosRaw.reduce(
    (acc, e) => acc + (e.asistentes?.length ?? 0),
    0
  );

  const loadingEventos = eventosQuery.isLoading;
  const loadingMedios = mediosQuery.isLoading;

  return (
    <div className="space-y-5 p-1">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Eventos totales"
          value={totalEventos}
          loading={loadingEventos}
        />
        <StatCard
          title="Eventos este año"
          value={eventosPorAnio[dayjs().year().toString()] ?? 0}
          loading={loadingEventos}
        />
        <StatCard
          title="Asistentes registrados"
          value={totalAsistentes}
          loading={loadingEventos}
        />
        <StatCard
          title="Archivos en biblioteca"
          value={mediosRaw.length}
          loading={loadingMedios}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title="Eventos creados por mes">
            {loadingEventos ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : eventosPorMes.every((m) => m.count === 0) ? (
              <EmptyCard
                icon={<CalendarOutlined style={{ fontSize: 20 }} />}
                title="Sin datos todavía"
                subtitle="Crea tu primer evento para ver las estadísticas mensuales"
              />
            ) : (
              <EventosPorMesChart data={eventosPorMes} />
            )}
          </SectionCard>
        </div>

        <div className="lg:col-span-1">
          <SectionCard
            title="Eventos recientes"
            action={
              <Link
                to="/eventos/"
                className="inline-flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-80"
                style={{ color: PRIMARY }}
              >
                Ver todos
                <ArrowRightOutlined style={{ fontSize: 11 }} />
              </Link>
            }
          >
            {loadingEventos ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : eventosRecientes.length === 0 ? (
              <EmptyCard
                icon={<CalendarOutlined style={{ fontSize: 20 }} />}
                title="Sin eventos recientes"
                subtitle="Aún no se han creado eventos"
              />
            ) : (
              <RecentEventsList eventos={eventosRecientes} />
            )}
          </SectionCard>
        </div>
      </div>

      <SectionCard
        title="Eventos con más asistentes"
      >
        {loadingEventos ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : topConAsistentes.length === 0 ? (
          <EmptyCard
            icon={<TeamOutlined style={{ fontSize: 20 }} />}
            title="Aún sin asistentes"
            subtitle="Los eventos con registros de asistentes aparecerán aquí"
          />
        ) : (
          <TopEventosChart data={topConAsistentes} />
        )}
      </SectionCard>

      <SectionCard
        title="Medios recientes"
        action={
          <Link
            to="/medios/"
            className="inline-flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-80"
            style={{ color: PRIMARY }}
          >
            Ver biblioteca
            <ArrowRightOutlined style={{ fontSize: 11 }} />
          </Link>
        }
      >
        {loadingMedios ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : (
          <MediaRecienteGallery medios={mediosRaw} />
        )}
      </SectionCard>
    </div>
  );
}
