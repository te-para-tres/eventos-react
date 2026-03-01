import { Result, Button } from "antd";
import { useNavigate } from "@tanstack/react-router";
export function NotFound({ extra }: { extra?: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="La página que estás buscando no existe."
      extra={
        extra ?? (
          <Button type="primary" onClick={() => navigate({ to: "/" })}>
            Volver al inicio
          </Button>
        )
      }
    />
  );
}
