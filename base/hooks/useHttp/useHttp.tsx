import httpService from "@/config/settings/axios-settings";
import { IRequestParams } from "@base/interfaces/requests/request-params.interface";
import { Response } from "@base/interfaces/requests/response.interface";
import { Icon } from "@iconify/react/dist/iconify.js";
import { App } from "antd";

export interface IHttpRequest {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: any;
  params?: IRequestParams;
  showNotificacion?: boolean;
  onSuccess?: (resp: Response) => void;
  onError?: (resp: Response) => void;
  onFinish?: (resp: Response) => void;
}

function useHttp() {
  const { modal, notification } = App.useApp();

  const showSuccessNotification = (mensaje: string) => {
    notification.success({
      message: "Éxito",
      description: mensaje,
    });
  };

  const showErrorNotification = (mensaje: string) => {
    notification.error({
      message: "Error",
      description: mensaje,
    });
  };

  async function get({
    endpoint,
    params,
    onSuccess,
    onError,
    onFinish,
    showNotificacion = false,
  }: IHttpRequest): Promise<Response> {
    let response: Response = { resultado: [] };
    try {
      const { data, status } = await httpService.get<Response>(endpoint, {
        params,
      });
      response = data;
      if (status === 200) {
        if (onSuccess) onSuccess(response);
        if (showNotificacion && response.mensaje) {
          showSuccessNotification(response.mensaje);
        }
      }
    } catch (error) {
      handleError(response, error, showNotificacion);
      if (onError) onError(response);
    } finally {
      if (onFinish) onFinish(response);
    }
    return response;
  }

  async function post({
    endpoint,
    body,
    headers,
    onSuccess,
    onError,
    onFinish,
    showNotificacion = true,
  }: IHttpRequest): Promise<Response> {
    let response: Response = { resultado: [] };
    try {
      const { data, status } = await httpService.post<Response>(
        endpoint,
        body,
        { headers }
      );
      response = data;
      if (status === 200) {
        if (onSuccess) onSuccess(response);
        if (showNotificacion && response.mensaje) {
          showSuccessNotification(response.mensaje);
        }
      }
    } catch (error) {
      handleError(response, error, showNotificacion);
      if (onError) onError(response);
    } finally {
      if (onFinish) onFinish(response);
    }
    return response;
  }

  async function put({
    endpoint,
    body,
    headers,
    onSuccess,
    onError,
    onFinish,
    showNotificacion = true,
  }: IHttpRequest): Promise<Response> {
    let response: Response = { resultado: [] };
    try {
      const { data, status } = await httpService.put<Response>(
        endpoint,
        body,
        { headers }
      );
      response = data;
      if (status === 200) {
        if (onSuccess) onSuccess(response);
        if (showNotificacion && response.mensaje) {
          showSuccessNotification(response.mensaje);
        }
      }
    } catch (error) {
      handleError(response, error, showNotificacion);
      if (onError) onError(response);
    } finally {
      if (onFinish) onFinish(response);
    }
    return response;
  }

  async function del({
    endpoint,
    params,
    body,
    headers,
    onSuccess,
    onError,
    onFinish,
    showNotificacion = true,
  }: IHttpRequest): Promise<Response> {
    let response: Response = { resultado: [] };
    try {
      const { data, status } = await httpService.delete(endpoint, {
        params,
        headers,
        data: body ?? params,
      });
      response = data;
      if (status === 200) {
        if (onSuccess) onSuccess(response);
        if (showNotificacion && response.mensaje) {
          showSuccessNotification(response.mensaje);
        }
      }
    } catch (error) {
      handleError(response, error, showNotificacion);
      if (onError) onError(response);
    } finally {
      if (onFinish) onFinish(response);
    }
    return response;
  }

  async function downloadFile({
    endpoint,
    params,
    headers,
  }: IHttpRequest): Promise<void> {
    try {
      const response = await httpService.get(endpoint, {
        params,
        headers,
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;

      const disposition = response.headers["content-disposition"];
      const filename =
        disposition?.match(/filename="?(.+)"?/i)?.[1] || "archivo-descargado";

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      handleError({ resultado: [] }, error, true);
    }
  }

  function handleError(
    response: Response,
    error: any,
    showNotificacion: boolean = false
  ): void {
    let errormensaje =
      error?.response?.data?.mensaje || "Ha ocurrido un error en la solicitud.";
    const errorDetails = error?.response?.data?.errores || "Error inesperado";

    response.errores = [errorDetails];
    response.mensaje = errormensaje;

    if (errorDetails && errorDetails !== "Error inesperado" && Object.keys(errorDetails)?.length > 0) {
      errormensaje = `${errormensaje}. ${Object.values(errorDetails).join(". ")}`;
    }
    if (showNotificacion) {
      showErrorNotification(errormensaje);
    }
  }

  async function defaultDelete({
    modalContent = "¿Está seguro de querer eliminar el registro?",
    requestParams,
  }: {
    modalContent?: React.ReactNode;
    requestParams: IHttpRequest;
  }) {
    modal.confirm({
      title: "Eliminar",
      icon: (
        <Icon
          icon={"ant-design:delete-outlined"}
          className="text-[#e61b23] h-[1.5rem] w-[1.5rem] mr-1"
        />
      ),
      content: modalContent,
      okText: "Si, Eliminar",
      okButtonProps: {
        danger: true,
      },
      cancelText: "No, Cancelar",
      onOk: async () => {
        await del(requestParams);
      },
    });
  }

  return { get, post, put, del, downloadFile, defaultDelete };
}

export default useHttp;
