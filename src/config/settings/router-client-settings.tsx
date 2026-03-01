import { routeTree } from "@/routeTree.gen";
import { createRouter } from "@tanstack/react-router";
import queryClient from "./query-client-settings";
import VITE_ENV from "../constants/vite-env";
import { NotFoundPage } from "@/routes/-pages/NotFoundPage";

// Create a new router instance
const router = createRouter({
  basepath: VITE_ENV.BASE_PATH,

  routeTree,
  context: { queryClient },
  defaultPreload: false,
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: NotFoundPage,
});

// Registrar router para obtener el tipado de las rutas
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
