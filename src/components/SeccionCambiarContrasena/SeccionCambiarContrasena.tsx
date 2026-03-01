import { AntdFormValidation } from "@base/constants/antd-form-validation";
import { Col, Form } from "antd";
import { InputPassword } from "@base/components/form/InputPassword/InputPassword";

const SeccionCambiarContrasena = ({
  formName,
  required = true,
}: {
  formName?: string;
  required?: boolean;
}) => {
  const form = Form.useFormInstance();

  return (
    <>
      {formName === "mi-perfil" && (
        <>
          <Col span={24} md={12}>
            <Form.Item
              label="Contraseña actual"
              name="clave"
              hasFeedback
              rules={[
                ...(required
                  ? [AntdFormValidation.Requerido("La contraseña actual es obligatoria")]
                  : []),
                AntdFormValidation.LongitudMinima(4),
              ]}
            >
              <InputPassword placeholder="Contraseña actual" />
            </Form.Item>
          </Col>

          <Col span={0} md={12}>
            {/* columna de espaciado */}
          </Col>
        </>
      )}
      <Col span={24} md={12}>
        <Form.Item
          label="Nueva contraseña"
          name="pwd"
          hasFeedback
          rules={[
            ...(required
              ? [AntdFormValidation.Requerido("Escriba la nueva contraseña")]
              : []),
            AntdFormValidation.LongitudMinima(4),
          ]}
        >
          <InputPassword placeholder="Nueva contraseña" />
        </Form.Item>
      </Col>

      <Col span={24} md={12}>
        <Form.Item
          label="Confirmar contraseña"
          name="pwdConfirm"
          dependencies={["pwd"]}
          hasFeedback
          rules={[
            ...(required
              ? [
                AntdFormValidation.Requerido(
                  "Confirme la nueva contraseña"
                ),
              ]
              : []),
            AntdFormValidation.ConfirmarContrasena(form, "pwd"),
          ]}
        >
          <InputPassword placeholder="Confirmar Contraseña" />
        </Form.Item>
      </Col>
    </>
  );
};

export default SeccionCambiarContrasena;
