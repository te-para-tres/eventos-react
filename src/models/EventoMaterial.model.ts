import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { ModeloBase } from "@base/interfaces/models/modelo-base.model";
import { Material } from "./Material.model";

export class EventoMaterial extends ModeloBase {
  idEvento?: string;
  idMaterial?: string;
  cantidad?: number;
  evento?: Evento;
  material?: Material;


  static CLASS_NAME = 'Evento Material';
  static BASE_ROUTE = "/evento-material";

  static ENDPOINTS = {
    DEFAULT: '/v1/evento-material.json',
  };

  static EXPAND = {
    DEFAULT: "evento,material"
  }

  static fromJson(data: Partial<EventoMaterial>) {
    return new EventoMaterial(data);
  }

  static fromJsonList(data: Partial<EventoMaterial>[]) {
    return data.map((_data) => new EventoMaterial(_data));
  }

  static COLUMNS: ModelColumnsType[] = [
    {
      key: 'nombre',
      title: 'Nombre',
    },
    {
      key: 'descripcion',
      title: 'Descripción',
    },
    {
      key: 'tipo',
      title: 'Tipo',
    },
    {
      key: 'estado',
      title: 'Estado',
    },
  ]
  //#endregion

  constructor(json: Partial<EventoMaterial> = {}) {
    super();
    Object.assign(this, json);
  }
}