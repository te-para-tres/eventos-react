import { useAuth } from "@/hooks/useAuth/useAuth";
import { NotAuthorized } from "@base/components/errors/NotAuthorized";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "antd";
import React from "react";

export function NotAuthorizedPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const ruta = React.useMemo(() => {
    if (isAuthenticated) {
      return "/";
    }
    return "/login";
  }, [isAuthenticated]);

  const label = React.useMemo(() => {
    if (isAuthenticated) {
      return "Volver al inicio";
    }
    return "Iniciar sesión";
  }, [isAuthenticated]);

  return (
    <div className="px-[50px] flex justify-center items-center h-screen">
      <NotAuthorized
        extra={
          <Button type="primary" onClick={() => navigate({ to: ruta })}>
            {label}
          </Button>
        }
      />
    </div>
  );
}
