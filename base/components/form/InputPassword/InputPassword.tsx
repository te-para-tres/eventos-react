import { Input, InputProps } from "antd";

export interface InputPasswordProps extends InputProps {
  name?: string;
}

export function InputPassword({ name, ...props }: InputPasswordProps) {
  return (
    <Input.Password
      {...props}
      autoComplete={props?.autoComplete ?? "new-password"}
    />
  );
}
