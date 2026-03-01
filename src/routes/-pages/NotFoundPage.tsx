import { useAuth } from "@/hooks/useAuth/useAuth";
import { NotFound } from "@base/components/errors/NotFound";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "antd";
import React from "react";

export function NotFoundPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const ruta = React.useMemo(() => {
    if (isAuthenticated) {
      return "/";
    }
    return "/login";
  }, [isAuthenticated]);

  return (
    <div className="px-[50px] flex justify-center items-center h-screen">
      <NotFound
        extra={
          <Button type="primary" onClick={() => navigate({ to: ruta })}>
            Volver al inicio
          </Button>
        }
      />
    </div>
  );
}
