import { DefaultContainer } from "@base/components/layout/containers/DefaultContainer";
import { PaginaProvider } from "@base/hooks/usePagina/usePagina";
import { createFileRoute } from "@tanstack/react-router";
import { Badge, Card, Col, Row, Statistic, Table, Tag, Typography } from "antd";
import {
  CalendarOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const Route = createFileRoute("/(auth)/")({
  component: RouteComponent,
});

const proximosEventos = [
  { key: 1, nombre: "Conferencia Tech 2026", fecha: "15 Mar 2026", lugar: "Auditorio Principal", inscritos: 120, capacidad: 200, estado: "activo" },
  { key: 2, nombre: "Taller de Innovación", fecha: "22 Mar 2026", lugar: "Sala B", inscritos: 45, capacidad: 50, estado: "casi_lleno" },
  { key: 3, nombre: "Networking Empresarial", fecha: "01 Abr 2026", lugar: "Terraza", inscritos: 30, capacidad: 100, estado: "activo" },
  { key: 4, nombre: "Hackathon Anual", fecha: "10 Abr 2026", lugar: "Centro de Cómputo", inscritos: 80, capacidad: 80, estado: "lleno" },
];

const columnas = [
  {
    title: "Evento",
    dataIndex: "nombre",
    key: "nombre",
    render: (text: string) => <span className="font-medium">{text}</span>,
  },
  {
    title: "Fecha",
    dataIndex: "fecha",
    key: "fecha",
    render: (text: string) => (
      <span className="text-neutral-500 flex items-center gap-1">
        <ClockCircleOutlined /> {text}
      </span>
    ),
  },
  { title: "Lugar", dataIndex: "lugar", key: "lugar" },
  {
    title: "Inscritos",
    key: "inscritos",
    render: (_: any, record: any) => (
      <span>{record.inscritos} / {record.capacidad}</span>
    ),
  },
  {
    title: "Estado",
    dataIndex: "estado",
    key: "estado",
    render: (estado: string) => {
      const config: Record<string, { color: string; label: string }> = {
        activo:     { color: "green",  label: "Activo" },
        casi_lleno: { color: "orange", label: "Casi lleno" },
        lleno:      { color: "red",    label: "Lleno" },
      };
      const { color, label } = config[estado];
      return <Tag color={color}>{label}</Tag>;
    },
  },
];

const asistenciaReciente = [
  { nombre: "Ana García",    evento: "Conferencia Tech 2026",  hora: "09:02 am" },
  { nombre: "Luis Martínez", evento: "Taller de Innovación",   hora: "09:15 am" },
  { nombre: "María López",   evento: "Conferencia Tech 2026",  hora: "09:21 am" },
  { nombre: "Carlos Ruiz",   evento: "Networking Empresarial", hora: "09:34 am" },
  { nombre: "Sofía Torres",  evento: "Conferencia Tech 2026",  hora: "09:47 am" },
];

function RouteComponent() {
  return (
    <PaginaProvider titulo="Inicio">
      <DefaultContainer className="h-full">
        <div className="flex flex-col gap-6">

          {/* Encabezado */}
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Dashboard
            </Typography.Title>
            <Typography.Text type="secondary">
              Resumen general del sistema
            </Typography.Text>
          </div>

          {/* Tarjetas de estadísticas */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Eventos activos"
                  value={12}
                  prefix={<CalendarOutlined className="text-blue-500" />}
                  valueStyle={{ color: "#09090b" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Usuarios registrados"
                  value={348}
                  prefix={<TeamOutlined className="text-purple-500" />}
                  valueStyle={{ color: "#09090b" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Asistencias hoy"
                  value={87}
                  prefix={<CheckCircleOutlined className="text-green-500" />}
                  valueStyle={{ color: "#09090b" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tasa de asistencia"
                  value={73.4}
                  suffix="%"
                  prefix={<RiseOutlined className="text-orange-500" />}
                  valueStyle={{ color: "#09090b" }}
                  precision={1}
                />
              </Card>
            </Col>
          </Row>

          {/* Tabla + actividad reciente */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card
                title={
                  <span className="flex items-center gap-2">
                    <CalendarOutlined /> Próximos eventos
                  </span>
                }
              >
                <Table
                  dataSource={proximosEventos}
                  columns={columnas}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card
                title={
                  <span className="flex items-center gap-2">
                    <UserOutlined /> Asistencia reciente
                  </span>
                }
              >
                <div className="flex flex-col gap-3">
                  {asistenciaReciente.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge color="green" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium leading-tight">
                            {item.nombre}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {item.evento}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-neutral-400">
                        {item.hora}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>

        </div>
      </DefaultContainer>
    </PaginaProvider>
  );
}
