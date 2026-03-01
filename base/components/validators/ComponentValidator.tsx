import { Spin } from "antd";

export interface ComponentValidatorProps {
  isValid: boolean;
  children: React.ReactNode;
  isLoading?: boolean;
  loadingRender?: React.ReactNode;
  handleInvalid: React.ReactNode;
}

export function ComponentValidator({
  isValid,
  children,
  handleInvalid,
  loadingRender,
  isLoading = false,
}: ComponentValidatorProps) {
  if (isLoading) {
    return (
      loadingRender ?? (
        <div className="flex justify-center items-center h-screen">
          <Spin /> Cargando...
        </div>
      )
    );
  }

  if (!isValid) {
    return handleInvalid;
  }

  return children;
}
