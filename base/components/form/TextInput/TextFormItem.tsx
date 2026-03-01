import {
  AntdFormValidation,
  AntdFormValidationRule,
} from "@base/constants/antd-form-validation";
import { capitalizeFirstLetter } from "@base/utils";
import { Rule } from "antd/es/form";
import FormItem, { FormItemProps } from "antd/lib/form/FormItem";
import React from "react";
import { TextInput, TextInputProps } from "./TextInput";

export interface TextFormItemProps extends FormItemProps {
  inputProps?: TextInputProps;
  label?: string;
  name?: string;
  validate?: AntdFormValidationRule[];
  rules?: Rule[];
  placeholder?: string;
  autoComplete?: "on" | "off";
  disableForm?: boolean;
}

export function TextFormItem({
  label,
  name,
  rules,
  validate,
  inputProps,
  placeholder,
  autoComplete,
  disableForm = false,
  ...props
}: TextFormItemProps) {
  const local_rules: Rule[] = React.useMemo(() => {
    return [
      ...(rules ?? []),
      ...AntdFormValidation.StringToRules(validate ?? []),
    ];
  }, [rules, validate]);

  if (!disableForm) {
    return (
      <FormItem
        {...props}
        label={label ?? capitalizeFirstLetter(name)}
        name={name}
        rules={local_rules}
      >
        <TextInput
          {...inputProps}
          autoComplete={autoComplete ?? inputProps?.autoComplete ?? "off"}
          placeholder={placeholder ?? inputProps?.placeholder ?? ""}
        />
      </FormItem>
    );
  }

  return (
    <FormItem label={label ?? capitalizeFirstLetter(name)}>
      <TextInput
        {...inputProps}
        autoComplete={autoComplete ?? inputProps?.autoComplete ?? "off"}
        placeholder={placeholder ?? inputProps?.placeholder ?? ""}
      />
    </FormItem>
  );
}
