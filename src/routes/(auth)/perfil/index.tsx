//import { PerfilUsuario /*as ModeloBase*/ } from "@/app/models/Perfil.model";
import { useAuth } from "@/hooks/useAuth/useAuth";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultContainer } from "@base/components/layout/containers/DefaultContainer";
import { CrudHeader } from "@base/components/layout/crud/CrudHeader";
import { Perfil as ModelClass } from "@/models/Perfil.model";

import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Popconfirm,
  QRCode,
  Row,
  Tag,
  Typography,
} from "antd";
//import { Usuario } from "@/models/Usuario.model";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditFilled,
  QrcodeOutlined,
  SmileFilled,
} from "@ant-design/icons";
import { usePagina } from "@base/hooks/usePagina/usePagina";
import { useState } from "react";
import useHttp from "@base/hooks/useHttp/useHttp";
import { useForm } from "antd/es/form/Form";

export const Route = createFileRoute("/(auth)/perfil/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { usuario, refrescarUsuario } = useAuth();
  const { navigate } = usePagina();
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [confirmado, setConfirmado] = useState(false);
  const [form] = useForm();

  const { get, post } = useHttp();

  const handleEditar = () => {
    navigate({
      to: `${ModelClass.BASE_ROUTE}/detalle`,
    });
  };

  const getQr = async () => {
    try {
      await get({
        endpoint: "admin/usuario/generate-qr.json",
        onSuccess: (data) => {
          if (data?.detalle) {
            setQrUrl(data?.detalle);
          }
        },
      });
    } catch (e) {
      return e;
    }
  };

  const postCodigo = async () => {
    const values = await form.validateFields();

    try {
      await post({
        endpoint: "admin/usuario/verify.json",
        body: values,
        onSuccess: () => {
          setConfirmado(true);
        },
      });
    } catch (e) {
      return e;
    }
  };

  const desacctivarTotp = async () => {
    try {
      await post({
        endpoint: "admin/usuario/disable-totp.json",
        onSuccess: () => {
          refrescarUsuario();
        },
      });
    } catch (e) {
      return e;
    }
  };

  return (
    <DefaultContainer className="h-full w-full flex flex-row align-middle justify-center items-center">
      <Card className="h-4/5 w-4/5">
        <Form form={form}>
          <Row gutter={[24, 16]}>
            <div className="mx-auto w-full p-6 flex flex-col gap-6">
              <section className="flex gap-2 text-2xl font-semibold">
                Perfil
              </section>
              <section className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                  <Avatar
                    size={128}
                    icon={<SmileFilled />}
                    className="bg-[#d58145] text-white"
                    src={usuario?.foto}
                  />
                  <div>
                    <Typography.Title level={3}>
                      {usuario?.getNombreCompleto()}
                    </Typography.Title>
                    <Tag color="orange">{usuario?.rol}</Tag>
                  </div>
                  <div className="ml-10 border border-neutral-200 p-2 rounded-md w-2/3">
                    <section>
                      <Typography.Title level={5} className="mb-2">
                        Contácto
                      </Typography.Title>
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2 text-neutral-700">
                          <MailOutlined /> {usuario?.correo}
                        </span>
                        <span className="flex items-center gap-2 text-neutral-700">
                          <PhoneOutlined />{" "}
                          {usuario?.telefono
                            ? usuario?.telefono
                            : "No disponible"}
                        </span>
                      </div>
                    </section>
                  </div>
                </div>
              </section>

              {!usuario?.otp && !qrUrl && (
                <section>
                  <Typography.Title level={5} className="mb-2">
                    Códgio de Verificación
                  </Typography.Title>
                  <div className="flex flex-col gap-1">
                    <Button
                      type="primary"
                      size="large"
                      icon={<QrcodeOutlined />}
                      onClick={getQr}
                    >
                      Activar Código
                    </Button>
                  </div>
                </section>
              )}
              {qrUrl && !usuario?.otp && !confirmado && (
                <section>
                  <Typography.Title level={5} className="mb-2">
                    Escanee su QR e ingrese el codigo
                  </Typography.Title>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-center">
                      <Image src={qrUrl} preview={false} />
                    </div>
                    <div className="flex flex-row justify-center">
                      <Form.Item name={"codigo"} required>
                        <Input.OTP length={6} />
                      </Form.Item>
                    </div>
                    <div className="flex flex-row justify-center">
                      <Button type="primary" size="large" onClick={postCodigo}>
                        Confirmar
                      </Button>
                    </div>
                  </div>
                </section>
              )}
              {confirmado && (
                <section>
                  <Typography.Title level={5} className="mb-2">
                    Su codigo ha sido confirmado
                  </Typography.Title>
                  <div className="flex flex-col gap-2">
                    <Button
                      type="primary"
                      size="large"
                      onClick={refrescarUsuario}
                    >
                      Continuar
                    </Button>
                  </div>
                </section>
              )}
              {usuario?.otp && !qrUrl && (
                <section>
                  <Typography.Title level={5} className="mb-2">
                    Códgio de Verificación
                  </Typography.Title>
                  <div className="flex flex-col gap-1">
                    <Popconfirm
                      title="¿Eliminar documento?"
                      onConfirm={desacctivarTotp}
                      okText="Sí"
                      cancelText="No"
                    >
                      <Button
                        type="primary"
                        size="large"
                        icon={<QrcodeOutlined />}
                        danger
                      >
                        Desactivar Código
                      </Button>
                    </Popconfirm>
                  </div>
                </section>
              )}
            </div>
          </Row>
        </Form>
      </Card>
    </DefaultContainer>
  );
}
