import { ILocalEnv } from "@base/hooks/useLocalApp/useLocalApp";

const VITE_ENV: ILocalEnv = {
  APP_NAME: import.meta.env.VITE_APP_NAME,
  APP_VERSION: import.meta.env.VITE_APP_VERSION,
  BASE_PATH: import.meta.env.VITE_BASE_PATH,
  BASE_API_URL: import.meta.env.VITE_BASE_API_URL,

  SHOW_DEVTOOLS: import.meta.env.VITE_SHOW_DEVTOOLS === "true",
  IS_DEV: import.meta.env.VITE_IS_DEV === "true",
  VALIDAR_PERMISOS: import.meta.env.VITE_VALIDAR_PERMISOS === "true",
};

Object.freeze(VITE_ENV);

export default VITE_ENV;
