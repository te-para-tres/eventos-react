import { IUsuarioBase } from "@base/interfaces/models/usuario-base.interface";
import {
  Layout,
  Button,
  Breadcrumb,
  MenuProps,
  theme as antdTheme,
  Avatar,
} from "antd";
import { ItemType, MenuItemType } from "antd/lib/menu/interface";
import { SidebarMenu } from "../sidebar-menu";
import React from "react";
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { BreadcrumbItemType } from "antd/lib/breadcrumb/Breadcrumb";
import UserNavOptions from "../user-nav-options";
import { useAuth } from "@/hooks/useAuth/useAuth";

export interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  usuario?: IUsuarioBase;
  sidebarMenuItems: ItemType<MenuItemType>[];
  userNavMenuItems: MenuProps;
  breadcrumbItems: BreadcrumbItemType[];
  theme: "light" | "dark";
  appVersion: string;
  ocultarLayout?: boolean;
  ocultarBreadcrumb?: boolean;
  activeKeys?: string[];
  logoRender: (collapsed: boolean) => React.ReactNode;
}

export function AuthenticatedLayout({
  children,
  usuario,
  sidebarMenuItems,
  userNavMenuItems,
  breadcrumbItems,
  theme,
  appVersion,
  ocultarLayout = false,
  ocultarBreadcrumb = false,
  activeKeys,
  logoRender,
}: AuthenticatedLayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const { logout } = useAuth();

  if (ocultarLayout) {
    return <>{children}</>;
  }

  return (
    <Layout className="min-h-screen">
      <Layout.Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="64px"
        theme={theme}
        width={240}
        className="border-r border-r-neutral-200"
        style={{
          minHeight: "100vh",
          padding: "4px"
        }}
      >
        <div className="h-full w-full flex flex-col">
          <div
            className="flex items-center justify-center mb-3"
            style={{
              height: 60,
              width: "100%",
              borderBottom: "1px solid #E1E1E1",
            }}
          >
            {logoRender(collapsed)}
          </div>
          <div className="w-full">
            <SidebarMenu
              collapsed={collapsed}
              menu={sidebarMenuItems}
              activeKeys={activeKeys ?? []}
            />
          </div>
          <div className="flex p-2 mt-auto">
            <Button icon={<LogoutOutlined />} onClick={() => logout()} danger className="w-full">
              Cerrar sesión
            </Button>
          </div>
        </div>
      </Layout.Sider>
      <Layout>
        {!ocultarBreadcrumb && (
          <Layout.Header
            style={{
              padding: 0,
              background: "#F8F8F8",
              borderBottom: "1px solid #E1E1E1",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 64,
              top: 0,
              zIndex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
                className="hover:bg-stone-100"
              />
              {!ocultarBreadcrumb && (
                <Breadcrumb
                  style={{ margin: "0 0.8rem" }}
                  items={breadcrumbItems}
                />
              )}
            </div>
            <UserNavOptions
              tituloRender={
                <div className="text-sm text-[#000000E0] bold text-left">
                  {usuario?.nombre} {usuario?.apellidos}
                </div>
              }
              subtituloRender={
                <div className="text-sm text-[#000000E0] text-left">
                  {usuario?.correo}
                </div>
              }
              usuario={usuario}
              menuItems={userNavMenuItems}
            />
          </Layout.Header>
        )}
        <Layout.Content
          style={{
            margin: "1rem 1rem",
          }}
        >
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
