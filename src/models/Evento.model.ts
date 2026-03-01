import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { ModeloBase } from "@base/interfaces/models/modelo-base.model";
import { EventoEmpleado } from "./EventoEmpleado.model";

export class Evento extends ModeloBase {
  nombre?: string;
  inicio?: string;
  fin?: string;
  descripcion?: string;
  ubicacion?: string;
  latitud?: number;
  longitud?: number;

  eventoEmpleado?: EventoEmpleado;

  static CLASS_NAME = 'Evento';
  static BASE_ROUTE = "/eventos";

  static ENDPOINTS = {
    DEFAULT: '/v1/evento.json',
  };

  static EXPAND = {
    DEFAULT: ""
  }

  static fromJson(data: Partial<Evento>) {
    return new Evento(data);
  }

  static fromJsonList(data: Partial<Evento>[]) {
    return data.map((_data) => new Evento(_data));
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
      key: 'inicio',
      title: 'Inicio',
      type: 'date'
    },
    {
      key: 'fin',
      title: 'Fin',
      type: 'date'
    },
    {
      key: 'ubicacion',
      title: 'Ubicación',
    },
  ]
  //#endregion

  constructor(json: Partial<Evento> = {}) {
    super();
    Object.assign(this, json);
  }
}