import { EdForm } from "@base/components/form/Form";
import { AntdFormValidation } from "@base/constants/antd-form-validation";
import { Button, Col, DatePicker, Form, InputNumber, Row, Steps } from "antd";
import { useForm } from "antd/lib/form/Form";
import { IFormularioBaseProps } from "@base/interfaces/forms/FormularioBase.interface";
import { TextInput } from "@base/components/form/TextInput/TextInput";
import { TextAreaInput } from "@base/components/form/TextAreaInput/TextAreaInput";
import dayjs from "dayjs";
import { useState } from "react";

export default function Formulario({
  mostrarSubmit = true,
  submitLabel = "Guardar",
  isLoading = false,
  formProps,
  isGuardando = false,
}: IFormularioBaseProps) {
  const [form] = useForm();
  const [current, setCurrent] = useState(0);
  const { RangePicker } = DatePicker;
  const onChange = (value: number) => {
    console.log('onChange:', value);
    setCurrent(value);
  };

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


        <Steps
          current={current}
          onChange={onChange}
          items={[
            {
              title: 'Step 1',
            },
            {
              title: 'Step 2',
            },
            {
              title: 'Step 3',
              
            },
          ]}
        />

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
