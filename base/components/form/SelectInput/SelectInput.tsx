import { capitalizeFirstLetter } from "@base/utils";
import { Select, SelectProps } from "antd";
import React from "react";

export interface SelectInputProps extends SelectProps {
  label?: string;
  name?: string;
}

export function SelectInput({
  name,
  label,
  options,
  optionFilterProp,
  placeholder,
  showSearch,
  allowClear,
  ...props
}: SelectInputProps) {
  const filterOption = React.useCallback((input: string, option: any) => {
    return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }, []);

  return (
    <Select
      {...props}
      showSearch={showSearch ?? true}
      optionFilterProp={optionFilterProp ?? "label"}
      filterOption={filterOption}
      placeholder={placeholder ?? capitalizeFirstLetter(name) ?? ""}
      options={options}
      allowClear={allowClear ?? false}
    />
  );
}
