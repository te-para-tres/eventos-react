import { Layout } from "antd";

export interface PublicLayoutProps {
  children: React.ReactNode;
  appVersion: string;
}

export function PublicLayout({ children, appVersion }: PublicLayoutProps) {
  return (
    <Layout className="h-screen">
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
}
