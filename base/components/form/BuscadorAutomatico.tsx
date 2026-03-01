import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { IRequestParams } from "@base/interfaces/requests/request-params.interface";
import { useDebouncedCallback } from "@mantine/hooks";
import { Button, Input, InputProps, Tooltip } from "antd";
import React, { SetStateAction } from "react";

export interface BuscadorAutomaticoProps {
  inputProps?: InputProps;
  setRequestParams: React.Dispatch<SetStateAction<IRequestParams>>;
  hideSearchButton?: boolean;
  hideClearButton?: boolean;
  responsive?: boolean;
}
export default function BuscadorAutomatico({
  inputProps,
  setRequestParams,
  hideSearchButton = false,
  hideClearButton = false,
  responsive = false,
}: BuscadorAutomaticoProps) {
  const [searchValue, setSearchValue] = React.useState<string>(
    inputProps?.value?.toString() ?? ""
  );

  const updateParams = React.useCallback(
    (v: string) => {
      setRequestParams((prev: IRequestParams) => ({
        ...prev,
        buscar: v,
      }));
    },
    [setRequestParams]
  );

  const debounceSearch = useDebouncedCallback((v: string) => {
    updateParams(v);
  }, 500);

  const clearSearch = React.useCallback(() => {
    setSearchValue("");
    updateParams("");
  }, [updateParams]);

  return (
    <div className="flex flex-wrap gap-2 mb-1">
      <div className={`flex ${responsive && "w-full"}`}>
        <Input
          size={inputProps?.size ?? "middle"}
          placeholder={inputProps?.placeholder ?? "Buscar..."}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            debounceSearch(e.target.value);
          }}
          allowClear={false}
          style={{ borderRadius: "6px 0 0 6px" }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParams(searchValue);
            }
          }}
        />
        {!hideSearchButton && (
          <Tooltip title="Buscar">
            <Button
              icon={<SearchOutlined />}
              type="primary"
              style={{
                borderRadius: "0 6px 6px 0",
                padding: "1.2rem"
              }}
            />
          </Tooltip>
        )}
      </div>

      {!hideClearButton && (
        <div>
          <Tooltip title="Limpiar búsqueda">
            <Button
              icon={<ClearOutlined />}
              style={{ padding: "1.2rem" }}
              onClick={clearSearch}
            />
          </Tooltip>
        </div>
      )}
    </div>
  );
}
