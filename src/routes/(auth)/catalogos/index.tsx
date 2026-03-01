import { PaginaProvider } from "@base/hooks/usePagina/usePagina";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/catalogos/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PaginaProvider titulo="Catálogos">
      <div>Catálogos</div>
    </PaginaProvider>
  );
}
