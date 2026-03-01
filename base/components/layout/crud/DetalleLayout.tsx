import QueryProps from "@base/interfaces/requests/query-props.interface";
import { CrudHeader } from "./CrudHeader";
import { DefaultContainer } from "../containers/DefaultContainer";
import { Col, Row } from "antd";
import { useDetalle } from "@base/hooks/useDetalle/useDetalle";
import { IFormularioBaseProps } from "@base/interfaces/forms/FormularioBase.interface";

export interface DetalleLayoutProps {
  handleVolver: () => void;
  queryParams: any;
  isEditando: boolean;
  nombrePlural: string;
  nombreSingular: string;
  queryProps: QueryProps;
  formQueryProps?: QueryProps;
  Formulario?: React.ComponentType<IFormularioBaseProps>;
  children?: React.ReactNode;
  showHeader?: boolean;
}

export function DetalleLayout({
  handleVolver,
  isEditando,
  nombrePlural,
  nombreSingular,
  queryProps,
  formQueryProps,
  Formulario,
  children,
  showHeader = true,
}: DetalleLayoutProps) {
  const {
    modelo,
    titulo,
    submitLabel,
    isFormLoading,
    defaultGuardar,
    isGuardando,
  } = useDetalle({
    nombreSingular,
    nombrePlural,
    queryProps,
    isEditando,
  });

  return (
    <DefaultContainer className="h-full">
      <Row gutter={[24, 16]}>
        {showHeader && (
          <Col span={24}>
            <CrudHeader titulo={titulo} onVolver={handleVolver} />
          </Col>
        )}

        <Col span={24}>
          {Formulario && (
            <Formulario
              formProps={{
                initialValues: modelo,
                onFinish: defaultGuardar,
              }}
              submitLabel={submitLabel}
              isLoading={isFormLoading}
              isEditando={isEditando}
              isGuardando={isGuardando}
              queryProps={formQueryProps}
              modelo={modelo}
            />
          )}

          {children}
        </Col>
      </Row>
    </DefaultContainer>
  );
}
