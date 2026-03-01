import { PaginaProvider } from "@base/hooks/usePagina/usePagina";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/administracion/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PaginaProvider titulo="Administración">
      <div>Administración</div>
    </PaginaProvider>
  );
}
