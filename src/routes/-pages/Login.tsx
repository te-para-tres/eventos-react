import { useAuth } from "@/hooks/useAuth/useAuth";
import { LockOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import { AntdFormValidation } from "@base/constants/antd-form-validation";
import { Navigate } from "@tanstack/react-router";
import { Button, Col, Form, Input, Row, Spin } from "antd";
import { useEffect } from "react";

export interface ILoginForm {
  correo: string;
  clave: string;
}

const LoginPage = () => {

  const { login, isIniciandoSesion, isAuthenticated } = useAuth();

  const appName = import.meta.env.VITE_APP_NAME;
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const appDescription = import.meta.env.VITE_APP_DESCRIPTION;

  useEffect(() => {
    document.title = appName;
    console.log(appName, appVersion, appDescription);

  }, [appName]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-screen flex">
      <div className="hidden lg:flex w-1/2 h-full bg-[#242424] flex-col justify-between p-10">
        <div className="text-white text-xl font-semibold tracking-tight">
          EventosApp -Hola Hugo
        </div>
        <div className="text-white text-xl font-semibold tracking-tight">
          {appName} Versión-{appVersion} + 1
        </div>
        <div className="text-neutral-400 text-sm">
          © {new Date().getFullYear()} EventosApp. Todos los derechos reservados.
        </div>
      </div>

      <div className="flex-1 h-full flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-lg flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-semibold text-neutral-900">
              Iniciar sesión
            </h1>
            <p className="text-lg text-neutral-500">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <Spin spinning={isIniciandoSesion}>
            <Form
              name="normal_login"
              layout="vertical"
              initialValues={{ remember: false }}
              onFinish={login}
            >
              <Row gutter={[0, 4]}>
                <Col span={24}>
                  <Form.Item
                    name="usuario"
                    label="Correo"
                    rules={[AntdFormValidation.Requerido("El correo es requerido")]}
                  >
                    <Input
                      prefix={<UserOutlined className="text-neutral-400" />}
                      size="large"
                      placeholder="correo@ejemplo.com"
                    />
                  </Form.Item>
                </Col>
                <Col span={24} className="mt-4">
                  <Form.Item
                    name="clave"
                    label="Contraseña"
                    rules={[
                      AntdFormValidation.Requerido("La contraseña es requerida"),
                      AntdFormValidation.LongitudMinima(4, "Mínimo 4 caracteres"),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-neutral-400" />}
                      size="large"
                      autoComplete="off"
                      placeholder="••••••••"
                    />
                  </Form.Item>
                </Col>
                <Col span={24} className="mt-4">
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                    >
                      Ingresar
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
