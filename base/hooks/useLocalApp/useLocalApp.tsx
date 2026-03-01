import React from "react";
import { BreadcrumbItemType } from "antd/lib/breadcrumb/Breadcrumb";
import { useAuth } from "../../../src/hooks/useAuth/useAuth";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Icon } from "@iconify/react/dist/iconify.js";

export interface LocalMenuItem {
  key: string;
  label: string;
  icon: string | React.ReactNode;
  permiso?: string; //Permiso necesario para ver el item
  visible?: boolean; //Visible en el menu lateral
  children?: LocalMenuItem[];
}

interface LocalAppContextType {
  current_menu: LocalMenuItem[];
  breadcrumbs: BreadcrumbItemType[];
  env: ILocalEnv;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItemType[]) => void;
  obtenerIconoMenuByKey: (key: string) => React.ReactNode;
  obtenerMenuLabelByKey: (key: string) => string | undefined;
  activeKeys: string[];
}

export interface ILocalEnv {
  APP_NAME: string;
  APP_VERSION: string;
  BASE_PATH: string;
  BASE_API_URL: string;

  SHOW_DEVTOOLS: boolean;
  IS_DEV: boolean;
  VALIDAR_PERMISOS: boolean;

  [key: string]: any;
}

const LocalAppContext = React.createContext<LocalAppContextType>({
  current_menu: [],
  breadcrumbs: [],
  env: {} as ILocalEnv,
  setBreadcrumbs: () => {},
  obtenerIconoMenuByKey: () => null,
  obtenerMenuLabelByKey: () => undefined,
  activeKeys: [],
});

export interface LocalAppProviderProps {
  children: React.ReactNode;
  isLocalMenu?: boolean;
  localMenuItems: LocalMenuItem[];
  env: ILocalEnv;
}

export const IconRender = (icon: string | React.ReactNode) => {
  if (typeof icon === "string") {
    return <Icon icon={icon} />;
  }
  return icon;
};

export function LocalAppProvider({
  children,
  localMenuItems,
  isLocalMenu = true,
  env,
}: LocalAppProviderProps) {
  const { validarPermiso } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbItemType[]>(
    []
  );
  const [activeKeys, setActiveKeys] = React.useState<string[]>([]);
  const [api_menu] = React.useState<LocalMenuItem[]>([]);

  const mappearMenu = React.useCallback(
    (menu?: LocalMenuItem[]): LocalMenuItem[] | undefined => {
      if (!menu) {
        return undefined;
      }

      return menu
        .filter((item) => item.visible)
        .map((item) => {
          if (item.permiso && !validarPermiso(item.permiso)) {
            return null;
          }

          const children =
            item.children && item.children.length > 0
              ? mappearMenu(item.children)
              : undefined;

          return {
            key: item.key,
            label: item.label,
            icon: IconRender(item.icon),
            children,
            onClick: () => {
              if (!children) {
                navigate({ to: item.key as string });
              }
            },
          };
        })
        .filter(Boolean) as LocalMenuItem[];
    },
    [validarPermiso, navigate]
  );

  const obtenerFlatMenu = React.useCallback(
    (menu?: LocalMenuItem[]): LocalMenuItem[] => {
      const flatMenu: LocalMenuItem[] = [];

      menu?.forEach((item) => {
        flatMenu.push(item);
        if (item.children && item.children.length > 0) {
          flatMenu.push(...obtenerFlatMenu(item.children));
        }
      });

      return flatMenu;
    },
    []
  );

  const local_menu = React.useMemo(() => {
    return mappearMenu(localMenuItems);
  }, [localMenuItems, mappearMenu]);

  const local_menu_flat = React.useMemo(() => {
    return obtenerFlatMenu(local_menu);
  }, [local_menu, obtenerFlatMenu]);

  const obtenerIconoMenuByKey = React.useCallback(
    (key: string) => {
      const item = local_menu_flat.find((item) => item.key === key);
      return item?.icon;
    },
    [local_menu_flat]
  );

  const obtenerMenuLabelByKey = React.useCallback(
    (key: string) => {
      const item = local_menu_flat.find((item) => item.key === key);
      return item?.label;
    },
    [local_menu_flat]
  );

  const current_menu = React.useMemo(() => {
    if (!isLocalMenu) {
      return api_menu;
    }
    return local_menu;
  }, [isLocalMenu, local_menu, api_menu]);

  React.useEffect(() => {
    const current_path = pathname.split("/").filter((item) => item !== "");
    const activeKeysArray: string[] = [];

    for (let i = 0; i < current_path.length; i++) {
      const pathKey = "/" + current_path.slice(0, i + 1).join("/");
      activeKeysArray.push(pathKey);
    }

    setActiveKeys(activeKeysArray);
  }, [pathname]);

  return (
    <LocalAppContext.Provider
      value={{
        current_menu: current_menu ?? [],
        breadcrumbs,
        setBreadcrumbs,
        env,
        obtenerIconoMenuByKey,
        obtenerMenuLabelByKey,
        activeKeys,
      }}
    >
      {children}
    </LocalAppContext.Provider>
  );
}

export function useLocalApp() {
  if (!LocalAppContext) {
    throw new Error("useLocalApp must be used within an LocalAppProvider");
  }
  return React.useContext(LocalAppContext);
}
