/// <reference types="vite/client" />

declare module "qrcode.react" {
  import { ComponentType } from "react";

  export const QRCodeSVG: ComponentType<
    { value: string } & Record<string, any>
  >;
}
