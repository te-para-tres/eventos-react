export type ModelColumnsType = {
  key: string;
  title: string;
  type?: "boolean" | "object" | "date" | "currency";
  default?: string;
  options?: Map<string, string>;
  dataIndex?: string;
  ordenar?: boolean;
};
