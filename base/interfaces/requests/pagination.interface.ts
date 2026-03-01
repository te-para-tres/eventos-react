export interface IPagination {
  total: number;
  pagina: number;
  limite: number;
  buscar?: string;
}

export const DEFAULT_PAGINACION: IPagination = {
  total: 0,
  pagina: 1,
  limite: 10,
  buscar: "",
};
