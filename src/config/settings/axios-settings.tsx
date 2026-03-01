import axios from "axios";
import VITE_ENV from "../constants/vite-env";
import LocalStorageManager from "../constants/localstorage-manager";

const httpService = axios.create({
  baseURL: VITE_ENV.BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

httpService.interceptors.request.use((config) => {
  let token: string = localStorage.getItem(LocalStorageManager.TOKEN) ?? "";

  //quitar comillas dobles
  token = token.replace(/^"|"$/g, "");

  if (token != "") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpService.interceptors.response.use((response) => {
  return response;
});

//TODO: IMPLEMENTAR INTERCEPTOR DE REFRESH TOKEN

//TODO: VER COMO PASAR LA CONFIGURACION DE AXIOS A LA LIBRERIA

export default httpService;
