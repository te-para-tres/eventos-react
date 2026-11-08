import { EdForm } from "@base/components/form/Form";
import { AntdFormValidation } from "@base/constants/antd-form-validation";
import { Button, Col, Form, Row, Switch } from "antd";
import { useForm } from "antd/lib/form/Form";
import { IFormularioBaseProps } from "@base/interfaces/forms/FormularioBase.interface";
import { TextInput } from "@base/components/form/TextInput/TextInput";
import { TextAreaInput } from "@base/components/form/TextAreaInput/TextAreaInput";
import { useEffect, useState } from "react";
import { NumberInput } from "@base/components/form/NumberInput/NumberInput";

export default function Formulario({
  mostrarSubmit = true,
  submitLabel = "Guardar",
  isLoading = false,
  formProps,
  isGuardando = false,
  modelo,
}: IFormularioBaseProps) {
  const [form] = useForm();
  const [estado, setEstado] = useState<boolean>();

  useEffect(() => {
    if (modelo) {
      setEstado(modelo.estado == "activo")
    }
  }, [modelo])

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
      <Row gutter={[24, 18]}>
        <Col span={24} md={10}>
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[AntdFormValidation.Requerido("El nombre es obligatorio")]}
          >
            <TextInput placeholder="Ej. Cable HDMI, Proyector, etc." />
          </Form.Item>
        </Col>

        <Col span={24} md={10}>
          <Form.Item
            label="Cantidad"
            name="cantidad"
            rules={[AntdFormValidation.Requerido("La cantidad es obligatoria")]}
          >
            <NumberInput placeholder="Ej. 10" type="number"/>
          </Form.Item>
        </Col>

        <Col span={24} md={4}>
          <Form.Item
            label="Estado"
            name="estado"
          >
            <Row>
              <Switch
                aria-label="Estado activo"
                checked={estado ?? false}
                checkedChildren="Activo"
                unCheckedChildren="Inactivo"
                onChange={setEstado}
              />
            </Row>
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="Descripción"
            name="descripcion"
          >
            <TextAreaInput placeholder="Descripción del material" />
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
