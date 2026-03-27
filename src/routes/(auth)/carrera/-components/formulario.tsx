import { EdForm } from "@base/components/form/Form";
import { AntdFormValidation } from "@base/constants/antd-form-validation";
import { Button, Checkbox, Col, Form, Row, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { IFormularioBaseProps } from "@base/interfaces/forms/FormularioBase.interface";
import { TextInput } from "@base/components/form/TextInput/TextInput";
import { TextAreaInput } from "@base/components/form/TextAreaInput/TextAreaInput";
import { useEffect, useState } from "react";
import { SelectorQuery } from "@base/components/form/SelectorQuery/SelectorQuery";
import { UnidadAcademica } from "@/models/UnidadAcademica.model";

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
  const tipos = [
    {
      label: "Licenciatura",
      value: "licenciatura"
    },
    {
      label: "Ingeniería",
      value: "ingenieria"
    }
  ];

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
      <Row gutter={[24, 16]}>
        <Col span={24} md={12}>
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[AntdFormValidation.Requerido("El nombre es obligatorio")]}
          >
            <TextInput placeholder="Ej. Ingeniería Mecatrónica" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Tipo"
            name="tipo"
            rules={[AntdFormValidation.Requerido("El tipo es obligatorio")]}
          >
            <Select options={tipos} placeholder="Seleccione un tipo" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Unidad Académica"
            name="idUnidadAcademica"
            rules={[AntdFormValidation.Requerido("La unidad académica es obligatoria")]}
          >
            <SelectorQuery
              queryProps={{
                endpoint: UnidadAcademica.ENDPOINTS.DEFAULT,
                enabled: true,
                extraParams: {
                  ordenar: "nombre-asc",
                },
              }}
            />
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
