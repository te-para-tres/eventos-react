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
import { UserOutlined } from "@ant-design/icons";
import { BreadcrumbItemType } from "antd/lib/breadcrumb/Breadcrumb";

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
        }}
      >
        <div className="h-full w-full flex flex-col">
          <div className="flex p-2 my-2">
            <div className="h-full flex flex-row align-middle items-center">
              <Button
                type="text"
                onClick={() => setCollapsed((prev) => !prev)}
                style={{
                  height: "100%",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                }}
              >
                <Avatar
                  icon={<UserOutlined />}
                  style={{ border: "1px solid black", color: "black" }}
                />
              </Button>
            </div>
            {!collapsed && (
              <div className="flex flex-col justify-center align-bottom">
                <div className="text-md text-black font-bold bold">
                  {usuario?.nombre ?? ""} {usuario?.apellidos ?? ""}
                </div>
                <div className="text-sm text-black">{usuario?.correo}</div>
              </div>
            )}
          </div>
          <div className="w-full">
            <SidebarMenu
            collapsed={collapsed}
              menu={sidebarMenuItems}
              activeKeys={activeKeys ?? []}
            />
          </div>
          <div
            className="w-full flex flex-row justify-center"
            style={{
              padding: "2px 0",
            }}
          >
            {/* <LogoIcon /> */}
          </div>
        </div>
      </Layout.Sider>
      <Layout>
        <Layout.Content
          className="p-4"
          style={{
            margin: "1rem 1rem",
            flex: 1,
          }}
        >
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
