import Formulario from "./-components/formulario";
import { UnidadAcademica as ModelClass } from "@/models/UnidadAcademica.model";
import {
  PaginaProvider,
  usePagina,
} from "@base/hooks/usePagina/usePagina";
import { createFileRoute } from "@tanstack/react-router";
import { DetalleLayout } from "@base/components/layout/crud/DetalleLayout";

export const Route = createFileRoute("/(auth)/unidad-academica/detalle")(
  {
    component: () => (
      <PaginaProvider titulo={`Detalle de ${ModelClass.CLASS_NAME}`}>
        <RouteComponent />
      </PaginaProvider>
    ),
  }
);

function RouteComponent() {
  const { handleVolver, queryParams, isEditando } = usePagina();

  return (
    <DetalleLayout
      handleVolver={handleVolver}
      queryParams={queryParams}
      isEditando={isEditando}
      nombrePlural={`${ModelClass.CLASS_NAME}s`}
      nombreSingular={ModelClass.CLASS_NAME}
      queryProps={{
        endpoint: ModelClass.ENDPOINTS.DEFAULT,
        extraParams: {
          id: queryParams?.id,
        },
        enabled: !!queryParams?.id,
      }}
      Formulario={Formulario}
    />
  );
}
