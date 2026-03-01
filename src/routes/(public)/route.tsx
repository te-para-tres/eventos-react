import VITE_ENV from "@/config/constants/vite-env";
import { PublicLayout } from "@base/components/layout/public-layout/public-layout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PublicLayout appVersion={VITE_ENV.APP_VERSION ?? "0.0.1"}>
      <Outlet />
    </PublicLayout>
  );
}
