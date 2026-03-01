import { FormProps } from "antd";
import QueryProps from "../requests/query-props.interface";

export interface IFormularioBaseProps<T = any> {
  queryProps?: QueryProps;
  formProps: FormProps;
  mostrarSubmit?: boolean;
  submitLabel?: string;
  isLoading?: boolean;
  isEditando?: boolean;
  isGuardando?: boolean;
  modelo?: T;
}
