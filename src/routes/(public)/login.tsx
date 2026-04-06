import { createFileRoute } from "@tanstack/react-router";
import Login from "../-pages/Login";
import { PaginaProvider } from "@base/hooks/usePagina/usePagina";
import { useEffect } from "react";

export const Route = createFileRoute("/(public)/login")({
  component: RouteComponent,
});

function RouteComponent() {

  return (
    <PaginaProvider titulo="Iniciar Sesión">
      <Login />
    </PaginaProvider>
  );
}
