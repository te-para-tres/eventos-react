import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { ModeloBase } from "@base/interfaces/models/modelo-base.model";

export class Actividad extends ModeloBase {
  clave?: string;
  descripcion?: string;
  nombre?: string;

  static CLASS_NAME = "Actividad";
  static BASE_ROUTE = "/actividad";

  static ENDPOINTS = {
    DEFAULT: "/v1/actividad.json",
  };

  static EXPAND = {
    DEFAULT: "eventos",
  };

  static fromJson(data: Partial<Actividad>) {
    return new Actividad(data);
  }

  static fromJsonList(data: Partial<Actividad>[]) {
    return data.map((_data) => new Actividad(_data));
  }

  static COLUMNS: ModelColumnsType[] = [
    {
      key: "nombre",
      title: "Nombre",
    },
    {
      key: "descripcion",
      title: "Descripción",
    },
  ];
}
