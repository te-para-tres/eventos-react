import { EdForm } from "@base/components/form/Form";
import { AntdFormValidation } from "@base/constants/antd-form-validation";
import { Button, Checkbox, Col, Form, InputNumber, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { IFormularioBaseProps } from "@base/interfaces/forms/FormularioBase.interface";
import { TextInput } from "@base/components/form/TextInput/TextInput";
import { TextAreaInput } from "@base/components/form/TextAreaInput/TextAreaInput";
import { useState } from "react";

export default function Formulario({
  mostrarSubmit = true,
  submitLabel = "Guardar",
  isLoading = false,
  formProps,
  isGuardando = false,
}: IFormularioBaseProps) {
  const [form] = useForm();
  const [estado, setEstado] = useState(formProps.initialValues?.estado === "activo");
  return (
    <EdForm
      {...formProps}
      form={form}
      isLoading={isLoading}
      onFinish={(v) => {
        v.estado = estado == true ? "activo" : "inactivo"
        formProps.onFinish?.(v);
      }}
    >
      <Row gutter={[24, 16]}>
        <Col span={24} md={12}>
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[AntdFormValidation.Requerido("El nombre es obligatorio")]}
          >
            <TextInput placeholder="Ej. Facultad de Ingeniería" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Correo"
            name="correo"
            rules={[AntdFormValidation.Requerido("El correo es obligatorio"), AntdFormValidation.Correo()]}
          >
            <TextInput placeholder="Ej. contacto@universidad.edu.mx" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Teléfono"
            name="telefono"
            rules={[AntdFormValidation.Requerido("El teléfono es obligatorio"), AntdFormValidation.Telefono()]}
          >
            <TextInput placeholder="Ej. 6621234567" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Estado"
            name="estado"
          >
            <Row>
              <Checkbox
                checked={estado}
                onChange={() => setEstado((prev) => !prev)}
              />
              <p style={{ marginLeft: "10px" }}>Activo</p>
            </Row>
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="Descripción"
            name="descripcion"
          >
            <TextAreaInput placeholder="Descripción de la unidad académica" />
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
