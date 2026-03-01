import { EdForm } from "@base/components/form/Form";
import { AntdFormValidation } from "@base/constants/antd-form-validation";
import { Button, Col, Form, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { IFormularioBaseProps } from "@base/interfaces/forms/FormularioBase.interface";
import { TextInput } from "@base/components/form/TextInput/TextInput";

import { TextAreaInput } from "@base/components/form/TextAreaInput/TextAreaInput";
import { SelectorQuery } from "@base/components/form/SelectorQuery/SelectorQuery";
import { Modulo } from "@/models/Modulo.model";

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
            label="Clave"
            name="id"
            rules={[
              AntdFormValidation.Requerido("la clave es obligatoria"),
              AntdFormValidation.LongitudMaxima(128),
            ]}
          >
            <TextInput placeholder="Clave" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Módulo"
            name="idModulo"
            rules={[AntdFormValidation.Requerido("El módulo es obligatorio")]}
          >
            <SelectorQuery
              queryProps={{
                endpoint: Modulo.ENDPOINTS.DEFAULT,
                enabled: true,
              }}
              selectProps={{
                placeholder: "Módulo",
              }}
            />
          </Form.Item>
        </Col>

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

        <Col span={24}>
          <Form.Item
            name="descripcion"
            rules={[
              AntdFormValidation.Requerido("La descripción es obligatoria"),
              AntdFormValidation.LongitudMaxima(128),
            ]}
          >
            <TextAreaInput placeholder="Descripción" />
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
