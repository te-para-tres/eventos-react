import { Input } from "antd";
import { TextAreaProps } from "antd/lib/input";

export interface TextAreaInputProps extends TextAreaProps {
  placeholder?: string;
  autoComplete?: string;
}

export function TextAreaInput({
  placeholder,
  autoComplete,
  ...props
}: TextAreaInputProps) {
  return (
    <Input.TextArea
      {...props}
      autoComplete={autoComplete ?? "off"}
      placeholder={placeholder}
      rows={props?.rows ?? 4}
    />
  );
}
