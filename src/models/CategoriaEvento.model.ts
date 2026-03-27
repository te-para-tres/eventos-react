import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { ModeloBase } from "@base/interfaces/models/modelo-base.model";
import { Evento } from "./Evento.model";

export class CategoriaEvento extends ModeloBase {
  clave?: string;
  nombre?: string;
  descripcion?: string;
  eventos?: Evento[];

  static CLASS_NAME = 'Categoría';
  static BASE_ROUTE = "/categoria";

  static ENDPOINTS = {
    DEFAULT: '/v1/categoria-evento.json',
  };

  static EXPAND = {
    DEFAULT: "eventos"
  }

  static fromJson(data: Partial<CategoriaEvento>) {
    return new CategoriaEvento(data);
  }

  static fromJsonList(data: Partial<CategoriaEvento>[]) {
    return data.map((_data) => new CategoriaEvento(_data));
  }

  static COLUMNS: ModelColumnsType[] = [
    {
      key: 'clave',
      title: 'Clave',
    },
    {
      key: 'nombre',
      title: 'Nombre',
    },
    {
      key: 'descripcion',
      title: 'Descripción',
    }
  ]
  //#endregion

  constructor(json: Partial<CategoriaEvento> = {}) {
    super();
    Object.assign(this, json);
  }
}