import { useAuth } from "@/hooks/useAuth/useAuth";
import { NotAuthorizedPage } from "@/routes/-pages/NotAuthorizedPage";
import { ComponentValidator } from "@base/components/validators/ComponentValidator";
import { Spin } from "antd";
import React from "react";

export interface RutaAutenticadaProps {
  children: React.ReactNode;
  handleInvalid?: React.ReactNode;
}

export function RutaAutenticada({
  children,
  handleInvalid,
}: RutaAutenticadaProps) {
  const { isAuthenticated, isMounted, isRefrescandoUsuario } = useAuth();

  return (
    <ComponentValidator
      isValid={isAuthenticated}
      isLoading={isRefrescandoUsuario || !isMounted}
      loadingRender={
        <div className="flex justify-center items-center h-screen">
          <Spin /> Validando Sesión...
        </div>
      }
      handleInvalid={handleInvalid ?? <NotAuthorizedPage />}
    >
      {children}
    </ComponentValidator>
  );
}
