import { Alert, Form as AntdForm, FormInstance, FormProps } from "antd";
import { Spinner } from "../loaders/Spinner";

export interface EDFormProps extends FormProps {
  children: React.ReactNode;
  form?: FormInstance;
  initialValues?: any;
  isLoading?: boolean;
  isEditando?: boolean;
  hasErrors?: boolean;

  autoComplete?: "off" | "on" | string;
  onSubmit?: (values: any) => void;
}

/**
 * Componente Formulario
 * @param children - Componentes hijos
 * @param form - Instancia del formulario
 * @param formProps - Propiedades del formulario
 * -- layout: "horizontal" | "vertical" | "inline"; // default: horizontal
 * -- autoComplete: "off" | "on";  default: off
 * -- initialValues: Valores iniciales del formulario
 * -- onFinish: Función que se ejecuta al enviar el formulario
 * -- onFinishFailed: Función que se ejecuta al enviar el formulario y fallar
 * @returns Componente Formulario
 */

export function EdForm({
  children,
  form,
  initialValues,
  autoComplete = "off",
  isLoading,
  isEditando,
  hasErrors,
  ...props
}: EDFormProps) {
  if (isLoading) {
    return <Spinner />;
  }
  if (hasErrors) {
    return <Alert message="Error" type="error" />;
  }

  return (
    <AntdForm
      {...props}
      form={form}
      initialValues={initialValues}
      layout={props?.layout ?? "vertical"}
      autoComplete={autoComplete ?? "off"}
      className="p-2 rounded-lg border border-neutral-300"
    >
      {children}
    </AntdForm>
  );
}
