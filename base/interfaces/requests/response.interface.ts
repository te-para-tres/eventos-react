import { IPagination } from "./pagination.interface";

export interface Response<T = any> {
  resultado?: T[];
  mensaje?: string;
  errores?: string[];
  detalle?: any;
  paginacion?: IPagination;
}
