import { ModelColumnsType } from "./types/model-columns.type";

export class ModeloBase {
  id?: string;

  creado?: string;
  modificado?: string;

  //#region STATICS DEFAULT PARA CRUDS
  static BASE_ROUTE = "/contratacion";

  static ENDPOINTS = {
    DEFAULT: "/v1/default.json",
  };

  static EXPAND = {
    DEFAULT: "",
  };

  static fromJson(data: Partial<ModeloBase>) {
    return new ModeloBase(data);
  }

  static fromJsonList(data: Partial<ModeloBase>[]) {
    return data.map((_data) => new ModeloBase(_data));
  }

  static COLUMNS: ModelColumnsType[] = [
    {
      key: "id",
      title: "Id",
    },
  ];
  //#endregion
  protected constructor(data: Partial<ModeloBase> = {}) {
    Object.assign(this, data);
  }
}
