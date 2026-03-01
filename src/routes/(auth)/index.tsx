import { DefaultContainer } from "@base/components/layout/containers/DefaultContainer";
import useHttp from "@base/hooks/useHttp/useHttp";
import { PaginaProvider } from "@base/hooks/usePagina/usePagina";
import { createFileRoute } from "@tanstack/react-router";
import { Row } from "antd";

export const Route = createFileRoute("/(auth)/")({
  component: RouteComponent,
});

function RouteComponent() {
  const http = useHttp();

  return (
    <PaginaProvider titulo="Inicio">
      <DefaultContainer className="h-full">
        <Row gutter={[10, 10]} justify={"space-between"}>
          
        </Row>
      </DefaultContainer>
    </PaginaProvider>
  );
}
