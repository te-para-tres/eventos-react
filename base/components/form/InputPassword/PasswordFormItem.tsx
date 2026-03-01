import {
  AntdFormValidation,
  AntdFormValidationRule,
} from "@base/constants/antd-form-validation";
import { capitalizeFirstLetter } from "@base/utils";
import { Rule } from "antd/es/form";
import FormItem, { FormItemProps } from "antd/lib/form/FormItem";
import React from "react";
import { InputPassword, InputPasswordProps } from "./InputPassword";

export interface PasswordFormItemProps extends FormItemProps {
  inputProps?: InputPasswordProps;
  label?: string;
  name?: string;
  validate?: AntdFormValidationRule[];
  rules?: Rule[];
}

export function PasswordFormItem({
  label,
  name,
  rules,
  validate,
  inputProps,
  ...props
}: PasswordFormItemProps) {
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
      <InputPassword
        {...inputProps}
        autoComplete={inputProps?.autoComplete ?? "new-password"}
        placeholder={
          inputProps?.placeholder ?? capitalizeFirstLetter(name) ?? ""
        }
      />
    </FormItem>
  );
}
