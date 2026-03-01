import React, { useEffect } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useLocalApp, ILocalEnv } from "../useLocalApp/useLocalApp";
import { useDocumentTitle } from "@mantine/hooks";
import { BreadcrumbItemType } from "antd/lib/breadcrumb/Breadcrumb";
import { App } from "antd";
import { IRequestParams } from "@base/interfaces/requests/request-params.interface";

interface PaginaContext {
  titulo: string;
  currentUrl: string;
  currentBreadcrumbs: BreadcrumbItemType[];
  router: ReturnType<typeof useRouter>;
  queryParams: any;
  handleVolver: () => void;
  handleAgregar: () => void;
  env: ILocalEnv;
  isEditando: boolean;
}

const PaginaContext = React.createContext<PaginaContext>({
  titulo: "",
  currentBreadcrumbs: [],
  router: undefined as unknown as ReturnType<typeof useRouter>,
  currentUrl: "",
  queryParams: {},
  handleVolver: () => {},
  handleAgregar: () => {},
  env: {} as ILocalEnv,
  isEditando: false,
});

interface PaginaProviderProps {
  children: React.ReactNode;
  titulo: string;
  manualBreadcrumbs?: BreadcrumbItemType[];
}

export function PaginaProvider({
  titulo,
  children,
  manualBreadcrumbs,
}: PaginaProviderProps) {
  const router = useRouter();

  const id = React.useMemo(() => {
    const _queryParams: any = router.state.location.search;
    if (_queryParams?.id) {
      return _queryParams.id;
    }
    return null;
  }, [router.state.location.search]);

  const { env, setBreadcrumbs, obtenerIconoMenuByKey, obtenerMenuLabelByKey } =
    useLocalApp();

  const headTitle = React.useMemo(() => {
    return `${titulo}${env.APP_NAME ? ` | ${env.APP_NAME}` : ""}`;
  }, [titulo, env.APP_NAME]);

  useDocumentTitle(headTitle); //Settea el titulo de la pagina en head

  const currentUrl = React.useMemo(() => {
    return router.state.location.pathname;
  }, [router]);

  const currentBreadcrumbs: BreadcrumbItemType[] = React.useMemo(() => {
    const path = currentUrl.split("/");
    const breadcrumbs: BreadcrumbItemType[] = [];
    let currentPath = "";

    path.forEach((label) => {
      if (label) {
        currentPath += `/${label}`;
        label = label.replace(/-/g, " ");
        label = label.charAt(0).toUpperCase() + label.slice(1);
        breadcrumbs.push({
          // TODO: OBTENER EL ICONO DE CURRENT_MENU DE LOCAL APP
          title: (
            <div className="flex items-center gap-2  hover:bg-stone-100">
              {obtenerIconoMenuByKey(currentPath)}{" "}
              {obtenerMenuLabelByKey(currentPath) ?? label}
            </div>
          ), //TODO: CAMBIAR LABEL POR NOMBRE DEL MENU
          href: currentPath,
        });
      }
    });

    return breadcrumbs;
  }, [currentUrl, obtenerIconoMenuByKey, obtenerMenuLabelByKey]);

  const handleVolver = React.useCallback(() => {
    router.navigate({
      to: "..",
    });
  }, [router]);

  const handleAgregar = React.useCallback(() => {
    router.navigate({
      to: "detalle" as string,
    });
  }, [router]);

  React.useEffect(() => {
    setBreadcrumbs(manualBreadcrumbs ?? currentBreadcrumbs);
  }, [currentBreadcrumbs, manualBreadcrumbs, setBreadcrumbs]);

  return (
    <PaginaContext.Provider
      value={{
        titulo,
        currentUrl,
        currentBreadcrumbs,
        router,
        handleVolver,
        handleAgregar,
        env,
        queryParams: router.state.location.search,
        isEditando: id !== null,
      }}
    >
      {children}
    </PaginaContext.Provider>
  );
}

export function usePagina() {
  const context = React.useContext(PaginaContext);
  const { modal, notification } = App.useApp();
  const [requestParams, setRequestParams] = React.useState<IRequestParams>({});
  const navigate = useNavigate();
  const router = useRouter();

  if (!context) {
    throw new Error("usePagina must be used within a PaginaProvider");
  }
  
  useEffect(() => {
    if (Object.keys(requestParams).length > 0) {
      navigate({
        to: context.currentUrl,
        search: (prev) => ({ ...prev, ...requestParams }),
        replace: true,
      });
    }
  }, [context.currentUrl, navigate, requestParams]);

  useEffect(() => {
    if (router) {
      setRequestParams(router.state.location.search);
    }
  }, [router]);

  return {
    ...context,
    requestParams,
    setRequestParams,
    modal,
    notification,
    navigate,
  };
}
