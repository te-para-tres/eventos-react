import { Result, Button } from "antd";

export function NotAuthorized({ extra }: { extra?: React.ReactNode }) {
  return (
    <Result
      status="403"
      title="403"
      subTitle="No tienes permisos para acceder a esta página."
      extra={extra ?? <Button type="primary">Volver al inicio</Button>}
    />
  );
}
