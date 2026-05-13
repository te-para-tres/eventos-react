import Formulario from "./-components/formulario";
import { Evento as ModelClass } from "@/models/Evento.model";
import {
  PaginaProvider,
  usePagina,
} from "@base/hooks/usePagina/usePagina";
import { createFileRoute } from "@tanstack/react-router";
import { DetalleLayout } from "@base/components/layout/crud/DetalleLayout";

export const Route = createFileRoute("/(auth)/eventos/detalle")(
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
          expand: ModelClass.EXPAND.DEFAULT,
        },
        enabled: !!queryParams?.id, //Solo se ejecuta si existe el id
      }}
      Formulario={Formulario}
    />
  );
}
