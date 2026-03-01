export interface IRequestParams {
  expand?: string;
  ordenar?: string | "id-desc" | "id-asc";
  limite?: number;
  pagina?: number;
  buscar?: string;

  [key: string]: any;
}
