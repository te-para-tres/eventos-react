import { EdForm } from "@base/components/form/Form";
import { AntdFormValidation } from "@base/constants/antd-form-validation";
import { Button, Col, Form, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { IFormularioBaseProps } from "@base/interfaces/forms/FormularioBase.interface";
import { TextInput } from "@base/components/form/TextInput/TextInput";
import { TextAreaInput } from "@base/components/form/TextAreaInput/TextAreaInput";

export default function Formulario({
  mostrarSubmit = true,
  submitLabel = "Guardar",
  isLoading = false,
  formProps,
  isGuardando = false,
}: IFormularioBaseProps) {
  const [form] = useForm();
  return (
    <EdForm
      {...formProps}
      form={form}
      isLoading={isLoading}
      onFinish={(v) => {
        formProps.onFinish?.(v);
      }}
    >
      <Row gutter={[24, 16]}>
        <Col span={24} md={12}>
          <Form.Item
            label="Clave"
            name="clave"
            rules={[AntdFormValidation.Requerido("La clave es obligatoria")]}
          >
            <TextInput placeholder="Ej. CONF, TALLER, SEMINARIO" />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[AntdFormValidation.Requerido("El nombre es obligatorio")]}
          >
            <TextInput placeholder="Ej. Conferencia, Taller, Seminario" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="Descripción"
            name="descripcion"
          >
            <TextAreaInput placeholder="Breve descripción de la categoría (opcional)..." />
          </Form.Item>
        </Col>

        {mostrarSubmit && (
          <Col span={24}>
            <Button type="primary" htmlType="submit" disabled={isGuardando}>
              {submitLabel}
            </Button>
          </Col>
        )}
      </Row>
    </EdForm>
  );
}
