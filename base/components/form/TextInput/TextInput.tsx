import { Input, InputProps } from "antd";

export interface TextInputProps extends InputProps {
  placeholder?: string;
  autoComplete?: string;
}

export function TextInput({
  placeholder,
  autoComplete,
  ...props
}: TextInputProps) {
  return (
    <Input
      {...props}
      autoComplete={autoComplete ?? "off"}
      placeholder={placeholder}
    />
  );
}
