import { Spin } from "antd";

export interface SpinnerProps {
  text?: string;
}

export function Spinner({ text = "Cargando..." }: SpinnerProps) {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spin /> {text}
    </div>
  );
}
