import { useAuth } from "@/hooks/useAuth/useAuth";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultContainer } from "@base/components/layout/containers/DefaultContainer";
import {
  Avatar,
  Button,
  Card,
  Form,
  Tag,
  Typography,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  SmileFilled,
  LogoutOutlined,
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

export const Route = createFileRoute("/(auth)/perfil/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { usuario, logout } = useAuth();
  const [form] = useForm();


  return (
    <DefaultContainer className="h-full w-full flex flex-col justify-start items-center pt-10">
      <Card className="w-full max-w-3xl">
        <Form form={form}>
          <div className="flex flex-col gap-6">
            <section className="flex items-center gap-4 pb-5 border-b border-neutral-200">
              <Avatar
                size={80}
                icon={<SmileFilled />}
                className="bg-[#d58145] text-white shrink-0"
                src={usuario?.foto}
              />
              <div className="flex flex-col gap-1">
                <Typography.Title level={3} style={{ margin: 0 }}>
                  {usuario?.getNombreCompleto()}
                </Typography.Title>
                <Tag color="orange" style={{ width: "fit-content" }}>
                  {usuario?.rol}
                </Tag>
              </div>
            </section>

            <div className="flex justify-center items-center flex-row gap-6 w-full h-auto">
              <section className="flex flex-col justify-between items-center gap-3 flex-1 border border-neutral-200 rounded-lg p-4 w-full h-auto max-w-xl">
                <Typography.Title level={5} style={{ margin: 0, }}>
                  <MailOutlined className="mr-2 text-neutral-400" />
                  Contacto
                </Typography.Title>
                <div className="flex flex-col gap-2 text-neutral-600">
                  <span className="flex items-center gap-2">
                    <MailOutlined /> {usuario?.correo}
                  </span>
                  <span className="flex items-center gap-2">
                    <PhoneOutlined />
                    {usuario?.telefono ?? "No disponible"}
                  </span>
                </div>
                <Button icon={<LogoutOutlined />} danger onClick={() => logout()} className="w-full mt-6">
                  Cerrar sesión
                </Button>
              </section>
            </div>
          </div>
        </Form>
      </Card>
    </DefaultContainer>
  );
}
