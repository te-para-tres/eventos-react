import { useAuth } from "@/hooks/useAuth/useAuth";
import { LockOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import { AntdFormValidation } from "@base/constants/antd-form-validation";
import { Navigate } from "@tanstack/react-router";
import { Button, Col, Form, Input, Row, Spin } from "antd";

export interface ILoginForm {
  correo: string;
  clave: string;
}

const LoginPage = () => {
  const { login, isIniciandoSesion, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-screen flex flex-row justify-between">
      <div className="w-1/2 h-full bg-[#242424]"></div>
      <div className="h-full w-1/2 p-4 flex items-center justify-center">
        <div className="w-3/4 h-3/4 flex flex-col">
          <div className="h-1/4">
            <h1 className="text-6xl  font-semibold">Iniciar Sesión</h1>
          </div>
          <div className="h-3/4">
            <Spin spinning={isIniciandoSesion}>
              <Form
                name="normal_login"
                className="login-form"
                layout="vertical"
                initialValues={{
                  remember: false,
                }}
                onFinish={login}
              >
                <Row gutter={[10, 30]}>
                  <Col span={24}>
                    <Form.Item
                      name="usuario"
                      label="Usuario"
                      rules={[
                        AntdFormValidation.Requerido("Usuario es requerido"),
                      ]}
                    >
                      <Input
                        prefix={
                          <UserOutlined className="site-form-item-icon" />
                        }
                        variant="filled"
                        size="large"
                        placeholder="correo@ejemplo.com"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="clave"
                      label="Contraseña"
                      rules={[
                        AntdFormValidation.Requerido(
                          "La contraseña es requerida"
                        ),
                        AntdFormValidation.LongitudMinima(
                          4,
                          "La contraseña debe tener al menos 4 caracteres"
                        ),
                      ]}
                    >
                      <Input.Password
                        variant="filled"
                        prefix={
                          <LockOutlined className="site-form-item-icon" />
                        }
                        size="large"
                        type="new-password"
                        autoComplete="off"
                        autoCorrect="off"
                        placeholder="Contraseña"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                        className="login-form-button"
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
    </div>
  );
};

export default LoginPage;
