import QueryProps from "@base/interfaces/requests/query-props.interface";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useHttp from "../useHttp/useHttp";
import { useNavigate } from "@tanstack/react-router";

export interface useDetalleProps {
  nombreSingular: string;
  nombrePlural: string;
  queryProps: QueryProps;
  isEditando: boolean;
  autoNavigate?: boolean;
}

export function useDetalle<T = any>({
  nombreSingular,
  queryProps,
  isEditando,
  autoNavigate = true,
}: useDetalleProps) {
  const navigate = useNavigate();
  const http = useHttp();
  const queryClient = useQueryClient();
  const [isGuardando, setIsGuardando] = useState(false);

  const { data, refetch, isLoading, isPending, error, isError } = useQuery({
    queryKey: [
      queryProps?.queryKey ?? queryProps.endpoint,
      queryProps?.extraParams,
      queryProps,
      isEditando,
    ],
    queryFn: () =>
      http.get({
        endpoint: queryProps.endpoint,
        params: queryProps.extraParams,
        onSuccess: queryProps.onSuccess,
        onError: queryProps.onError,
        onFinish: queryProps.onFinish,
      }),
    enabled: queryProps.enabled ?? isEditando,
  });

  const modelo: T | null = React.useMemo(() => {
    if (!isEditando) return null;
    const resultado = data?.resultado;
    if (resultado && resultado.length == 1) {
      return resultado[0];
    }
    return null;
  }, [data, isEditando]);

  const titulo = React.useMemo(() => {
    if (isEditando) {
      return `Detalle de ${nombreSingular}`;
    }
    return `Agregar ${nombreSingular}`;
  }, [nombreSingular, isEditando]);

  const submitLabel = React.useMemo(() => {
    if (isEditando) {
      return `Actualizar ${nombreSingular}`;
    }
    return `Guardar ${nombreSingular}`;
  }, [nombreSingular, isEditando]);

  const defaultGuardar = React.useCallback(
    async (values: any) => {
      try {
        setIsGuardando(true);
        await http.post({
          endpoint: queryProps.endpoint,
          body: {
            id: isEditando ? queryProps.extraParams.id : undefined,
            ...values,
          },
          onSuccess: () => {
            if (isEditando) {
              refetch();
            }
            if (autoNavigate) {
              navigate({ to: ".." });
            }
          },
        });
      } catch (e) {
        console.log(e);
      } finally {
        setIsGuardando(false);
      }
    },
    [http, isEditando, navigate, autoNavigate, refetch, queryProps]
  );

  const isFormLoading = React.useMemo(() => {
    if (!isEditando) {
      return false;
    }

    return isLoading || isPending || (!data && !isError) || (data && !modelo);
  }, [isLoading, isPending, isEditando, data, modelo, isError]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries({
        queryKey: [queryProps?.queryKey ?? queryProps.endpoint],
      });
    };
  }, [queryClient, queryProps]);

  return {
    modelo,
    titulo,
    submitLabel,
    isFormLoading,
    defaultGuardar,
    queryProps,
    isGuardando,
    error,
    isError,
  };
}
