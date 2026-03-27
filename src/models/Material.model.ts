import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { ModeloBase } from "@base/interfaces/models/modelo-base.model";

export class Material extends ModeloBase {
  nombre?: string;
  descripcion?: string;
  estado?: string;
  cantidad?: number;
  nota?: string;

  static CLASS_NAME = 'Material';
  static BASE_ROUTE = "/material";

  static ENDPOINTS = {
    DEFAULT: '/v1/material.json',
  };

  static EXPAND = {
    DEFAULT: "eventoMaterial"
  }

  static fromJson(data: Partial<Material>) {
    return new Material(data);
  }

  static fromJsonList(data: Partial<Material>[]) {
    return data.map((_data) => new Material(_data));
  }

  static COLUMNS: ModelColumnsType[] = [
    {
      key: 'nombre',
      title: 'Nombre',
    },
    {
      key: 'estado',
      title: 'Estado',
    },
    {
      key: 'cantidad',
      title: 'Cantidad',
    },
    {
      key: 'descripcion',
      title: 'Descripción',
    },
    {
      key: 'nota',
      title: 'Nota',
    },
  ]
  //#endregion

  constructor(json: Partial<Material> = {}) {
    super();
    Object.assign(this, json);
  }
}