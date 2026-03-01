import { InputNumber, InputNumberProps } from "antd";

export interface NumberInputProps extends InputNumberProps {
  placeholder?: string;
}

export function NumberInput({ placeholder, ...props }: NumberInputProps) {
  return (
    <InputNumber
      {...props}
      placeholder={placeholder}
      style={{ width: "100%", ...props.style }}
    />
  );
}
