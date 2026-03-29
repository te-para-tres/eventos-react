import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import "./index.css";
import VITE_ENV from "./config/constants/vite-env";
import queryClient from "./config/settings/query-client-settings";
import router from "./config/settings/router-client-settings";
import { AntdConfigProvider } from "./config/settings/antd-config-provider";

import "./index.css";
import { ThemeProvider } from "@base/hooks/useTheme/useTheme";
import TanstackDevtoolsProvider from "@base/components/devtools/tanstack-devtools-provider";

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-theme">
          <AntdConfigProvider>
            <RouterProvider router={router} />
            <TanstackDevtoolsProvider
              show={VITE_ENV.IS_DEV && VITE_ENV.SHOW_DEVTOOLS}
              router={router}
            />
          </AntdConfigProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
