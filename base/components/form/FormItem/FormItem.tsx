import {
  AntdFormValidation,
  AntdFormValidationRule,
} from "@base/constants/antd-form-validation";
import { Rule } from "antd/es/form";
import { Form } from "antd/lib";
import { FormItemProps } from "antd/lib/form/FormItem";
import React from "react";

export interface EDFormItemProps extends FormItemProps {
  label?: string;
  name?: string;
  validate?: AntdFormValidationRule[];
  rules?: Rule[];
  children: React.ReactNode;
  disableForm?: boolean;
}

export function FormItem({
  label,
  children,
  name,
  validate,
  rules,
  disableForm = false,
  ...props
}: EDFormItemProps) {
  const local_rules: Rule[] = React.useMemo(() => {
    return [
      ...(rules ?? []),
      ...AntdFormValidation.StringToRules(validate ?? []),
    ];
  }, [rules, validate]);

  if (!disableForm) {
    return (
      <Form.Item {...props} label={label} name={name} rules={local_rules}>
        {children}
      </Form.Item>
    );
  }

  return (
    <div className="flex flex-col">
      <label className="text-[0.92rem]">{label}</label>
      {children}
    </div>
  );
}
