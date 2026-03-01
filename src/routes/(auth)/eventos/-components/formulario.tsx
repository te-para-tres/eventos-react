import { EdForm } from "@base/components/form/Form";
import { AntdFormValidation } from "@base/constants/antd-form-validation";
import { Button, Col, DatePicker, Form, InputNumber, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { IFormularioBaseProps } from "@base/interfaces/forms/FormularioBase.interface";
import { TextInput } from "@base/components/form/TextInput/TextInput";
import { TextAreaInput } from "@base/components/form/TextAreaInput/TextAreaInput";
import dayjs from "dayjs";

export default function Formulario({
  mostrarSubmit = true,
  submitLabel = "Guardar",
  isLoading = false,
  formProps,
  isGuardando = false,
}: IFormularioBaseProps) {
  const [form] = useForm();
  const { RangePicker } = DatePicker;

  return (
    <EdForm
      {...formProps}
      form={form}
      isLoading={isLoading}
      onFinish={(v) => {
        const rango = form.getFieldValue("rango");
        v.inicio = rango[0];
        v.fin = rango[1];
        formProps.onFinish?.(v);
      }}
      initialValues={{
        ...formProps?.initialValues,
        rango: [
          formProps?.initialValues?.inicio
            ? dayjs(formProps?.initialValues?.inicio)
            : null,
          formProps?.initialValues?.fin
            ? dayjs(formProps?.initialValues?.fin)
            : null,
        ],
      }}
    >
      <Row gutter={[24, 16]}>
        <Col span={24} md={12}>
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[AntdFormValidation.Requerido("El nombre es obligatorio")]}
          >
            <TextInput placeholder="Nombre" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Fecha evento"
            name="rango"
            rules={[
              AntdFormValidation.Requerido("La fecha evento es obligatorio"),
            ]}
          >
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Latitud"
            name="latitud"
            rules={[AntdFormValidation.Maximo(999.9999999)]}
          >
            <InputNumber
              step={0.0000001}
              max={999.9999999}
              placeholder="Latitud"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Longitud"
            name="longitud"
            rules={[AntdFormValidation.Maximo(999.9999999)]}
          >
            <InputNumber
              step={0.0000001}
              max={999.9999999}
              placeholder="Longitud"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="Ubicación"
            name="ubicacion"
            rules={[AntdFormValidation.Requerido("La ubicación es requerida")]}
          >
            <TextInput placeholder="Ubicación" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="Descripción"
            name="descripcion"
            rules={[AntdFormValidation.LongitudMaxima(128)]}
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
