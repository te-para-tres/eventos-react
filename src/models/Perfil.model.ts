import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { Usuario } from "./Usuario.model";

export class Perfil extends Usuario {

  //#region STATICS DEFAULT PARA CRUDS
  static CLASS_NAME = 'Perfil';
  static BASE_ROUTE = "/mi-perfil";

  static ENDPOINTS = {
    ...super.ENDPOINTS,
    DEFAULT: '/v1/perfil.json',
    POST: '/v1/perfil/cambiar-contrasena.json',
  };

  static EXPAND = {
    ...super.EXPAND,
  }

  static fromJson(data: Partial<Perfil>) {
    return new Perfil(data);
  }

  static fromJsonList(data: Partial<Perfil>[]) {
    return data.map((_data) => new Perfil(_data));
  }

  static COLUMNS: ModelColumnsType[] = [
    {
      key: 'id',
      title: 'Id',
    }
  ]
  //#endregion

  constructor(json: Partial<Perfil> = {}) {
    super();
    Object.assign(this, json);
  }
}