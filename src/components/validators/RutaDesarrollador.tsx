import { NotFoundPage } from "@/routes/-pages/NotFoundPage";
import { ComponentValidator } from "@base/components/validators/ComponentValidator";
import { useLocalApp } from "@base/hooks/useLocalApp/useLocalApp";
import React from "react";

export interface RutaDesarrolladorProps {
  children: React.ReactNode;
}

export function RutaDesarrollador({ children }: RutaDesarrolladorProps) {
  const { env } = useLocalApp();

  const isDev = React.useMemo(() => {
    return env.IS_DEV;
  }, [env.IS_DEV]);

  return (
    <ComponentValidator isValid={isDev} handleInvalid={<NotFoundPage />}>
      {children}
    </ComponentValidator>
  );
}
