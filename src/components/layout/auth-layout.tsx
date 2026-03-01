import {
  Layout,
  Button,
  Breadcrumb,
  MenuProps,
  theme as antdTheme,
} from "antd";
import { ItemType, MenuItemType } from "antd/lib/menu/interface"; 
import React from "react";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { BreadcrumbItemType } from "antd/lib/breadcrumb/Breadcrumb";
import UserNavOptions from "@base/components/layout/user-nav-options";
import { Usuario } from "@/models/Usuario.model";
import { SidebarMenu } from "@base/components/layout/sidebar-menu";

export interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  usuario?: Usuario;
  sidebarMenuItems: ItemType<MenuItemType>[];
  userNavMenuItems: MenuProps;
  breadcrumbItems: BreadcrumbItemType[];
  theme: "light" | "dark";
  appVersion: string;
  ocultarLayout?: boolean;
  ocultarBreadcrumb?: boolean;
  logoRender: (collapsed: boolean) => React.ReactNode;
}

export function AuthLayout({
  children,
  usuario,
  sidebarMenuItems,
  userNavMenuItems,
  breadcrumbItems,
  theme,
  appVersion,
  ocultarLayout = false,
  ocultarBreadcrumb = false,
  logoRender,
}: AuthenticatedLayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const {
    token: { colorBgContainer, borderRadius },
  } = antdTheme.useToken();

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
        style={{
          minHeight: "100vh",
        }}
      >
        <div className="px-4 py-2">{logoRender(collapsed)}</div>
        <SidebarMenu menu={sidebarMenuItems} activeKeys={[]} />
      </Layout.Sider>
      <Layout>
        <Layout.Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            // position: "sticky",
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
                {""}
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
        <Layout.Content
          style={{
            margin: "1rem 1rem",
            borderRadius: borderRadius,
            flex: 1,
          }}
        >
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
