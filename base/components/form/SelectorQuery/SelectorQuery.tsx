import useHttp from "@base/hooks/useHttp/useHttp";
import { DEFAULT_PAGINACION } from "@base/interfaces/requests/pagination.interface";
import QueryProps from "@base/interfaces/requests/query-props.interface";
import { IRequestParams } from "@base/interfaces/requests/request-params.interface";
import { useQuery } from "@tanstack/react-query";

import { useDebouncedCallback } from "@mantine/hooks";

import { Empty, Select, SelectProps } from "antd";
import React from "react";
import { AntdFormValidationRule } from "@base/constants/antd-form-validation";

export interface SelectorQueryItem {
  label: string;
  value: string | number;
  data?: any;
}

export interface SelectorQueryProps {
  selectProps?: SelectProps;
  queryProps: QueryProps;
  loading?: boolean;
  value?: any;
  disableFormItem?: boolean;
  validate?: AntdFormValidationRule[];

  labelProp?: string;
  valueProp?: string;

  append?: any[]; //Lista de valores que se agregan a la lista de opciones
  blacklist?: any[]; //Lista de valores que se excluyen de la lista de opciones

  onChange?: (value: any) => void; //Callback que se ejecuta al cambiar el valor
  onSelect?: (data: any, value: any) => void; //Callback que se ejecuta al seleccionar un item

  labelRender?: (data: SelectorQueryItem) => React.ReactNode; //Custom render del label con acceso al item completo
  optionRender?: (data: SelectorQueryItem) => React.ReactNode; //Custom render del option con acceso al item completo
}

export function SelectorQuery({
  queryProps,
  selectProps,
  loading,
  value,
  onChange,
  onSelect,
  append,
  blacklist,
  labelProp = "nombre",
  valueProp = "id",
  labelRender,
  optionRender,
}: SelectorQueryProps) {
  const http = useHttp();
  const [requestParams, setRequestParams] = React.useState<IRequestParams>(
    queryProps.extraParams
  );

  // Actualizar requestParams cuando cambien los extraParams
  React.useEffect(() => {
    setRequestParams((prev: IRequestParams) => ({
      ...prev,
      ...queryProps.extraParams,
    }));
  }, [queryProps.extraParams]);

  const updateParams = React.useCallback((v: string) => {
    setRequestParams((prev: IRequestParams) => ({
      ...prev,
      buscar: v,
    }));
  }, []);

  const debounceSearch = useDebouncedCallback((v: string) => {
    updateParams(v);
  }, 500);

  const query = useQuery({
    queryKey: [
      queryProps?.queryKey ?? queryProps.endpoint,
      requestParams,
      queryProps,
    ],
    queryFn: () =>
      http.get({
        endpoint: queryProps.endpoint,
        params: requestParams,
        onSuccess: queryProps.onSuccess,
        onError: queryProps.onError,
        onFinish: queryProps.onFinish,
      }),
    enabled: queryProps?.enabled !== undefined ? queryProps?.enabled : true,
  });

  const handleOnClear = React.useCallback(() => {
    setRequestParams((prev: IRequestParams) => ({
      ...prev,
      ...DEFAULT_PAGINACION,
      buscar: "",
    }));

    selectProps?.onClear?.();
  }, [selectProps]);

  const handleOnSearch = React.useCallback(
    (v: string) => {
      debounceSearch(v);
      selectProps?.onSearch?.(v);
    },
    [selectProps, debounceSearch]
  );

  const handleOnSelect = React.useCallback(
    (selectedValue: any, option: any) => {
      // Buscar el item completo en los datos de la query o en los items agregados
      let selectedItemData = query.data?.resultado?.find(
        (item: any) => item[valueProp] === selectedValue
      );

      // Si no se encuentra en la query, buscar en los items agregados (append)
      if (!selectedItemData && append) {
        selectedItemData = append.find((item: any) => {
          const itemValue = item[valueProp] || item.value || item.id || item;
          return itemValue === selectedValue;
        });
      }

      // Llamar al onSelect personalizado si existe
      if (onSelect) {
        onSelect(selectedItemData, selectedValue);
      }

      // Llamar al onSelect del selectProps si existe
      if (selectProps?.onSelect) {
        selectProps.onSelect(selectedValue, option);
      }
    },
    [onSelect, selectProps, query.data, append, valueProp]
  );
  const options: SelectorQueryItem[] = React.useMemo(() => {
    // Obtener las opciones base de la query
    let baseOptions =
      query.data?.resultado?.map((item) => {
        const defaultLabel = item[labelProp] ?? item.nombre ?? String(item);
        const defaultValue = item[valueProp] ?? item.id ?? String(item);

        return {
          label: defaultLabel,
          value: defaultValue,
          data: item,
        };
      }) ?? [];

    // Agregar items adicionales (append)
    if (append && append.length > 0) {
      const appendOptions = append.map((item) => {
        let label, value;

        if (typeof item === "object" && item !== null) {
          // Usar las props configuradas, con fallbacks
          label = item[labelProp] || item.nombre || item.label || String(item);
          value = item[valueProp] || item.id || item.value;
        } else {
          // Si es un valor primitivo
          label = String(item);
          value = item;
        }

        return {
          label,
          value,
          data: item,
        };
      });

      // Filtrar duplicados - no agregar items que ya existen
      const filteredAppendOptions = appendOptions.filter((appendOption) => {
        return !baseOptions.some(
          (baseOption) => baseOption.value === appendOption.value
        );
      });

      baseOptions = [...baseOptions, ...filteredAppendOptions];
    }

    // Aplicar blacklist - filtrar items que están en la lista negra (se aplica a TODAS las opciones)
    if (blacklist && blacklist.length > 0) {
      baseOptions = baseOptions.filter((option) => {
        return !blacklist.some((blacklistItem) => {
          // Comparar usando valueProp configurado
          let blacklistValue;
          if (typeof blacklistItem === "object" && blacklistItem !== null) {
            blacklistValue =
              blacklistItem[valueProp] ||
              blacklistItem.id ||
              blacklistItem.value;
          } else {
            blacklistValue = blacklistItem;
          }
          return option.value === blacklistValue;
        });
      });
    }

    return baseOptions;
  }, [query.data, append, blacklist, labelProp, valueProp]);

  return (
    <Select
      {...selectProps}
      value={value}
      onChange={onChange}
      options={options}
      showSearch={selectProps?.showSearch ?? true}
      defaultActiveFirstOption={selectProps?.defaultActiveFirstOption ?? false}
      filterOption={selectProps?.filterOption ?? false}
      allowClear={selectProps?.allowClear ?? false}
      placeholder={selectProps?.placeholder ?? "Seleccione un valor"}
      notFoundContent={
        selectProps?.notFoundContent ?? (
          <Empty description="No se encontraron resultadoados" />
        )
      }
      loading={
        query.isFetching || query.isLoading || selectProps?.loading || loading
      }
      onClear={handleOnClear}
      onSearch={handleOnSearch}
      onSelect={handleOnSelect}
      labelRender={({ value, label }) => {
        if (!labelRender) {
          return label;
        }

        const selectedOption = options.find((item) => item.value === value);

        return selectedOption ? labelRender(selectedOption) : label;
      }}
      optionRender={({ value, label }) => {
        if (!optionRender) {
          return label;
        }

        const currentOption = options.find((item) => item.value === value);
        return currentOption ? optionRender(currentOption) : label;
      }}
    />
  );
}
