import type { ComponentType, CSSProperties } from "react";

export type TipoArchivo = {
  label: string;
  Icon?: ComponentType<{ className?: string; style?: CSSProperties }>;
  bg?: string;
  text?: string;
  tagBg?: string;
};