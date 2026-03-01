import {
  AntdFormValidation,
  AntdFormValidationRule,
} from "@base/constants/antd-form-validation";
import { capitalizeFirstLetter } from "@base/utils";
import { Rule } from "antd/es/form";
import FormItem, { FormItemProps } from "antd/lib/form/FormItem";
import React from "react";
import { SelectInput, SelectInputProps } from "./SelectInput";

export interface SelectFormItemProps extends FormItemProps {
  selectProps?: SelectInputProps;
  label?: string;
  name?: string;
  validate?: AntdFormValidationRule[];
  rules?: Rule[];
}

export function SelectFormItem({
  label,
  name,
  rules,
  validate,
  selectProps,
  ...props
}: SelectFormItemProps) {
  const local_rules: Rule[] = React.useMemo(() => {
    return [
      ...(rules ?? []),
      ...AntdFormValidation.StringToRules(validate ?? []),
    ];
  }, [rules, validate]);

  return (
    <FormItem
      {...props}
      label={label ?? capitalizeFirstLetter(name)}
      name={name}
      rules={local_rules}
    >
      <SelectInput
        {...selectProps}
        placeholder={
          selectProps?.placeholder ?? capitalizeFirstLetter(name) ?? ""
        }
      />
    </FormItem>
  );
}
