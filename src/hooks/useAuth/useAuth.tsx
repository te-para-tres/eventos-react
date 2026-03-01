import LocalStorageManager from "@/config/constants/localstorage-manager";
import { Usuario } from "@/models/Usuario.model";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import useHttp from "@base/hooks/useHttp/useHttp";
import { useLocalStorage } from "@mantine/hooks";
import { useNavigate } from "@tanstack/react-router";
import { App } from "antd";
import React from "react";

export interface AuthContextType {
  token: string | undefined;
  usuario: Usuario | undefined;
  isMounted: boolean;
  isAuthenticated: boolean;
  isRefrescandoUsuario: boolean;
  isIniciandoSesion: boolean;
  login: (values: { correo: string; clave: string }) => Promise<void>;
  logout: (notification?: boolean) => void;
  refrescarUsuario: () => void;
  validarPermiso: (permiso: string) => boolean;
}

const AuthContext = React.createContext<AuthContextType>({
  token: undefined,
  usuario: undefined,
  isMounted: false,
  isAuthenticated: false,
  isRefrescandoUsuario: false,
  isIniciandoSesion: false,
  login: async () => {
    return undefined;
  },
  logout: () => {},
  refrescarUsuario: () => {},
  validarPermiso: () => false,
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { modal } = App.useApp();
  const [usuario, setUser] = React.useState<Usuario | undefined>(undefined);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isRefrescandoUsuario, setIsRefrescandoUsuario] = React.useState(false);
  const [isIniciandoSesion, setIsIniciandoSesion] = React.useState(false);

  const [token, setToken] = useLocalStorage<string>({
    key: LocalStorageManager.TOKEN,
    defaultValue: "N/A",
  });

  const http = useHttp();

  const navigate = useNavigate();

  const isAuthenticated = React.useMemo(() => {
    if (usuario && isMounted && !isRefrescandoUsuario) {
      return true;
    }

    return false;
  }, [usuario, isMounted, isRefrescandoUsuario]);

  const login = React.useCallback(
    async (values: { correo: string; clave: string }): Promise<void> => {
      setIsIniciandoSesion(true);
      await http.post({
        endpoint: Usuario.ENDPOINTS.INICIAR_SESION,
        body: values,
        onSuccess: (r) => {
          const usuario = r.detalle;
          if (usuario) {
            setToken(usuario.token);
            if (!usuario.oauth) {
              setUser(usuario);
            }
            setTimeout(() => {
              navigate({ to: "/" });
            }, 0);
          }
        },
        onFinish: () => {
          setIsIniciandoSesion(false);
          setIsMounted(true);
        },
      });
    },
    [http, navigate, setUser, setToken]
  );

  const logout = React.useCallback(
    (notification: boolean = true) => {
      if (notification) {
        modal.confirm({
          title: "Atención",
          icon: <ExclamationCircleOutlined />,
          content: "¿Desea cerrar sesión?",
          okButtonProps: {
            danger: true,
          },
          okText: "Cerrar Sesión",
          cancelText: "Cancelar",
          onOk() {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");

            setToken("");
            setUser(undefined);

            navigate({ to: "/login" });
          },
        });
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        setToken("");
        setUser(undefined);

        navigate({ to: "/login" });
      }
    },
    [modal, navigate, setToken]
  );

  const refrescarUsuario = React.useCallback(async () => {
    setIsRefrescandoUsuario(true);
    await http.get({
      endpoint: Usuario.ENDPOINTS.REFERESCAR_USUARIO,
      onSuccess: (r) => {
        const usuario: any = r.detalle;
        const token = usuario.token ?? "";

        setUser(Usuario.fromJson(usuario));
        setToken(token);
      },
      onError: () => {
        logout(false);
      },
      onFinish: () => {
        setIsRefrescandoUsuario(false);
      },
    });
  }, [http, logout, setUser, setToken]);

  const validarPermiso = React.useCallback(
    (permiso: string | string[]) => {
      if (usuario) {
        const validado = Array.isArray(permiso)
          ? usuario.validarPermisos(permiso)
          : usuario?.validarPermiso(permiso);
        if (!validado) {
          return false;
        }
        return true;
      }
      return false;
    },
    [usuario]
  );

  React.useEffect(() => {
    const hasToken = token && token !== "";

    if (isMounted) return;
    if (isRefrescandoUsuario) return;
    if (usuario) return;

    if (hasToken && token !== "" && !usuario) {
      refrescarUsuario();
    }

    if (token !== "N/A") {
      logout(false);
    }

    setIsMounted(true);
  }, [
    refrescarUsuario,
    token,
    isMounted,
    isRefrescandoUsuario,
    usuario,
    logout,
  ]);

  return (
    <AuthContext.Provider
      value={{
        isMounted,
        token,
        usuario,
        refrescarUsuario,
        login,
        logout,
        validarPermiso,
        isAuthenticated,
        isRefrescandoUsuario,
        isIniciandoSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
}
