import React from "react";
import { TextInput } from "./TextInput";
import { FormItem } from "../FormItem/FormItem";
import { TextFormItemProps } from "./TextFormItem";

export interface TextInputUpdaterProps {
  initialValues?: TextFormItemProps;
  onChange: (values: TextFormItemProps) => void;
}

export function TextInputUpdater({
  initialValues,
  onChange,
}: TextInputUpdaterProps) {
  const [placeholder, setPlaceholder] = React.useState<string>(
    initialValues?.placeholder ?? ""
  );
  const [label, setLabel] = React.useState<string>(initialValues?.label ?? "");

  React.useEffect(() => {
    onChange?.({
      ...initialValues,
      placeholder,
      label,
    });
  }, [placeholder, label, initialValues, onChange]);
  return (
    <div>
      <FormItem label="Label" layout="vertical">
        <TextInput value={label} onChange={(e) => setLabel(e.target.value)} />
      </FormItem>

      <FormItem label="Placeholder" layout="vertical" disableForm>
        <TextInput
          value={placeholder}
          onChange={(e) => setPlaceholder(e.target.value)}
        />
      </FormItem>
    </div>
  );
}
