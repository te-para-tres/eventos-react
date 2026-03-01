import { App, ConfigProvider, ThemeConfig } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import es_ES from "antd/locale/es_ES";

const theme: ThemeConfig = {
  token: {
    // Colores principales
    colorPrimary: "#242424", // zinc-950 de shadcn
    colorSuccess: "#16a34a",
    colorWarning: "#ea580c",
    colorError: "#dc2626",
    colorInfo: "#0ea5e9",
    colorLink: "black",

    // Colores de texto
    colorText: "#09090b",
    colorTextSecondary: "#71717a",
    colorTextTertiary: "#a1a1aa",
    colorTextQuaternary: "#d4d4d8",

    // Colores de fondo
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBgLayout: "#fafafa",
    colorBgSpotlight: "black",

    // Bordes - más sutiles como shadcn
    colorBorder: "#e4e4e7",
    colorBorderSecondary: "#f4f4f5",
    borderRadius: 6,

    // Tipografía
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 16,
    fontSizeHeading1: 36,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,

    // Espaciado
    padding: 16,
    margin: 16,

    // Sombras - más sutiles
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    boxShadowSecondary:
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",

    // Altura de controles
    controlHeight: 36,
    controlHeightLG: 40,
    controlHeightSM: 32,
  },

  components: {
    Button: {
      // Botones con estilo shadcn
      controlHeight: 36,
      borderRadius: 6,
      primaryShadow: "none",
      defaultShadow: "none",
      dangerShadow: "none",
      fontWeight: 500,
      // Botón primario (default en shadcn)
      colorPrimary: "#09090b",
      colorPrimaryHover: "#18181b",
      colorPrimaryActive: "#27272a",
      // Botón outline
      defaultBorderColor: "#e4e4e7",
      defaultColor: "#09090b",
      colorBorder: "#e4e4e7",
    },

    Input: {
      controlHeight: 36,
      borderRadius: 6,
      colorBorder: "#e4e4e7",
      colorBgContainer: "#ffffff",
      colorTextPlaceholder: "#a1a1aa",
      activeBorderColor: "#09090b",
      hoverBorderColor: "#a1a1aa",
      activeShadow: "0 0 0 3px rgba(9, 9, 11, 0.1)",
    },
    InputNumber: {
      controlHeight: 36,
      borderRadius: 6,
      colorBorder: "#e4e4e7",
      colorBgContainer: "#ffffff",
      colorTextPlaceholder: "#a1a1aa",
      activeBorderColor: "#09090b",
      hoverBorderColor: "#a1a1aa",
      activeShadow: "0 0 0 3px rgba(9, 9, 11, 0.1)",
    },
    Select: {
      colorBorder: "#e4e4e7",
      borderRadius: 6,
      activeBorderColor: "#09090b",
      hoverBorderColor: "#a1a1aa",
      colorBgContainer: "#ffffff",
      optionSelectedBg: "#f4f4f5",
      optionActiveBg: "#f4f4f5",
      selectorBg: "#ffffff",
    },
    Card: {
      borderRadius: 8,
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
      colorBorderSecondary: "#e4e4e7",
    },

    Table: {
      borderRadius: 6,
      colorBorderSecondary: "#e4e4e7",
      headerBg: "#fafafa",
      headerColor: "#71717a",
    },

    Modal: {
      borderRadius: 8,
      contentBg: "#ffffff",
      headerBg: "#ffffff",
    },
    Typography: {
      titleMarginBottom: 1,
      titleMarginTop: 1,
    },
    Drawer: {
      colorBgElevated: "#ffffff",
    },
    Menu: {
      itemBg: "#f9f9f9",
      itemBorderRadius: 0,
      itemHoverBg: "#e0e0e0",
      itemHoverColor: "black",
      itemSelectedBg: "#d8b8c8",
      itemSelectedColor: "#242424",
      itemActiveBg: "transparent",
      subMenuItemSelectedColor: "#242424",
      subMenuItemBg: "#f9f9f9",
      colorText: "black",
    },
    Layout: {
      headerBg: "#139dc0",
      headerColor: "#ffff",
      siderBg: "#f9f9f9",
      lightSiderBg: "#f9f9f9",
      lightTriggerColor: "#f9f9f9",
    },
    Tabs: {
      colorBorderSecondary: "#e4e4e7",
      colorText: "#71717a",
      colorPrimary: "#09090b",
    },

    Switch: {
      colorPrimary: "#09090b",
      colorPrimaryHover: "#18181b",
    },
    DatePicker: {
      controlHeight: 36,
      borderRadius: 6,
      colorBorder: "#e4e4e7",
      colorBgContainer: "#ffffff",
      activeShadow: "0 0 0 3px rgba(9, 9, 11, 0.1)",
      activeBorderColor: "#09090b",
      hoverBorderColor: "#a1a1aa",
      
      // Panel/dropdown
      cellActiveWithRangeBg: "#f4f4f5",
      cellHoverBg: "#f4f4f5",
      cellHoverWithRangeBg: "#e4e4e7",
      colorPrimary: "#09090b",
      colorPrimaryBorder: "#09090b",
      colorIcon: "#71717a",
      colorIconHover: "#09090b",
      controlItemBgActive: "#09090b",
      colorTextLightSolid: "#ffffff",
    },
    Checkbox: {
      borderRadius: 4,
      colorPrimary: "#09090b",
      colorPrimaryHover: "#18181b",
      colorBorder: "#e4e4e7",
    },
    Radio: {
      colorPrimary: "#09090b",
      colorPrimaryHover: "#18181b",
      colorBorder: "#e4e4e7",
    },
    Alert: {
      borderRadius: 6,
    },
  },
};

export function AntdConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StyleProvider layer>
      <ConfigProvider theme={theme} locale={es_ES}>
        <App
          notification={{ placement: "bottomRight" }}
          message={{ maxCount: 1 }}
        >
          {children}
        </App>
      </ConfigProvider>
    </StyleProvider>
  );
}
