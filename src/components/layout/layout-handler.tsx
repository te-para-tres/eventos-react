import { useAuth } from "@/hooks/useAuth/useAuth";
import { AuthenticatedLayout } from "@base/components/layout/authenticated-layout/authenticated-layout";
import { PublicLayout } from "@base/components/layout/public-layout/public-layout";
import { Navigate, Outlet, useNavigate } from "@tanstack/react-router";
import { Image, MenuProps } from "antd";
import { useTheme } from "@base/hooks/useTheme/useTheme";
import VITE_ENV from "@/config/constants/vite-env";
import { useLocalApp } from "@base/hooks/useLocalApp/useLocalApp";

import logo from "@/assets/logo_white.png";
import logo_sm from "@/assets/logo_white.png"; // TODO: AGREGAR LOGO SM
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { RutaAutenticada } from "../validators/RutaAutenticada";
import { ItemType, MenuItemType } from "antd/es/menu/interface";

/**
 * Controla el layout de la aplicación en base a la autenticación del usuario y los estados del layout.
 * <LayoutHandler /> // eliminar route.tsx en rutas privadas => ./(private)/route.tsx
 * <LayoutHandler /> // eliminar route.tsx en rutas publicas => ./(public)/public.tsx
 */
export function LayoutHandler() {
  const { isAuthenticated, usuario, token, logout } = useAuth();
  const navigate = useNavigate();

  const userNavMenuItems: MenuProps = {
    items: [
      {
        key: "1",
        label: (
          <span className="flex gap-2 text-sm">
            <UserOutlined /> Mi Perfil
          </span>
        ),
        onClick: () => navigate({ to: "/mi-perfil" }),
      },
      {
        key: "2",
        danger: true,
        label: (
          <span style={{ fontSize: "14px" }}>
            {" "}
            <LogoutOutlined /> Cerrar sesión
          </span>
        ),
        onClick: () => {
          logout();
        },
      },
    ],
  };

  const { theme } = useTheme();
  const { current_menu, breadcrumbs, env } = useLocalApp();

  const LogoRender = (collapsed: boolean) => {
    return (
      <Image
        src={!collapsed ? logo : logo_sm}
        className={"w-full"}
        alt={`logo de ${env.APP_NAME}`}
        preview={false}
      />
    );
  };

  if (!isAuthenticated && !token) {
    return (
      <PublicLayout appVersion={VITE_ENV.APP_VERSION ?? "0.0.1"}>
        <Outlet />
      </PublicLayout>
    );
  }

  return (
    <AuthenticatedLayout
      usuario={usuario}
      theme={theme}
      sidebarMenuItems={current_menu as ItemType<MenuItemType>[]}
      userNavMenuItems={userNavMenuItems}
      breadcrumbItems={breadcrumbs}
      appVersion={VITE_ENV.APP_VERSION ?? "0.0.1"}
      ocultarLayout={false}
      ocultarBreadcrumb={false}
      logoRender={LogoRender}
    >
      <RutaAutenticada handleInvalid={<Navigate to="/login" />}>
        <Outlet />
      </RutaAutenticada>
    </AuthenticatedLayout>
  );
}
