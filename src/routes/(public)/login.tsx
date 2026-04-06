import { createFileRoute } from "@tanstack/react-router";
import Login from "../-pages/Login";
import { PaginaProvider } from "@base/hooks/usePagina/usePagina";
import { useEffect } from "react";

export const Route = createFileRoute("/(public)/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const appName = import.meta.env.VITE_APP_NAME;
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const appDescription = import.meta.env.VITE_APP_DESCRIPTION;
  useEffect(() => {
    document.title = appName;
    console.log(appName, appVersion, appDescription);

  }, [appName]);

  return (
    <PaginaProvider titulo="Iniciar Sesión">
      <Login />
    </PaginaProvider>
  );
}
