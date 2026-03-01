import { EdForm } from "@base/components/form/Form";
import { AntdFormValidation } from "@base/constants/antd-form-validation";
import { Button, Col, Form, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { IFormularioBaseProps } from "@base/interfaces/forms/FormularioBase.interface";
import { TextInput } from "@base/components/form/TextInput/TextInput";

export default function Formulario({
  mostrarSubmit = true,
  submitLabel = "Guardar",
  isLoading = false,
  formProps,
  isGuardando = false,
}: IFormularioBaseProps) {
  const [form] = useForm();

  return (
    <EdForm {...formProps} form={form} isLoading={isLoading}>
      <Row gutter={[24, 16]}>
        <Col span={24} md={12}>
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[
              AntdFormValidation.Requerido("El nombre es obligatorio"),
              AntdFormValidation.LongitudMaxima(128),
            ]}
          >
            <TextInput placeholder="Nombre" />
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
