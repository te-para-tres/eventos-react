import { LocalAppProvider } from "@base/hooks/useLocalApp/useLocalApp";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import VITE_ENV from "@/config/constants/vite-env";
import local_menu_items from "@/localMenuItems.gen";
import AuthProvider from "@/hooks/useAuth/useAuth";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => {
    return (
      <AuthProvider>
        {/* si isLocalMenu es false, se cargará desde el backend */}
        <LocalAppProvider
          isLocalMenu={true}
          localMenuItems={local_menu_items}
          env={VITE_ENV}
        >
          {/* rutas privadas => ./(private)/route.tsx  && rutas publicas => ./(public)/public.tsx */}
          <Outlet />
        </LocalAppProvider>
      </AuthProvider>
    );
  },
});
