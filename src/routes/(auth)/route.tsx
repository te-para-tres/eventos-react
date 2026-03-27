import { useAuth } from "@/hooks/useAuth/useAuth";
import {
  createFileRoute,
  Navigate,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { MenuProps } from "antd";
import { useTheme } from "@base/hooks/useTheme/useTheme";
import VITE_ENV from "@/config/constants/vite-env";
import { useLocalApp } from "@base/hooks/useLocalApp/useLocalApp";

import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { RutaAutenticada } from "@/components/validators/RutaAutenticada";
import { AuthenticatedLayout } from "@base/components/layout/authenticated-layout/authenticated-layout";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
//import { AuthSpotsyncLayout } from "@/components/layout/auth-spotsync-layout";

export const Route = createFileRoute("/(auth)")({
  component: RouteComponent,
});

function RouteComponent() {
  const { usuario, logout } = useAuth();
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
        onClick: () => navigate({ to: "/perfil" }),
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
  const { current_menu, breadcrumbs, env, activeKeys } = useLocalApp();

  const LogoRender = (collapsed: boolean) => {
    return (
      <div className="flex items-center gap-3 px-2 py-1">
        <span className="bg-[#741A39] text-white text-xs font-bold px-2.5 py-2.5 rounded-lg tracking-widest select-none">
          UES
        </span>
        {!collapsed && (
          <span className="text-[#741A39] text-lg font-bold tracking-wide">
            Eventues
          </span>
        )}
      </div>
    );
  };

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
      activeKeys={activeKeys}
    >
      <RutaAutenticada handleInvalid={<Navigate to="/login" />}>
        <Outlet />
      </RutaAutenticada>
    </AuthenticatedLayout>
  );
}
