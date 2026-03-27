import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { ModeloBase } from "@base/interfaces/models/modelo-base.model";

export class Evento extends ModeloBase {
  nombre?: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  capacidadMaxima?: number;
  capacidadMinima?: number;
  estado?: string;
  lugar?: string;
  latitud?: number;
  longitud?: number;



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
      key: 'fechaInicio',
      title: 'Inicio',
      type: 'date'
    },
    {
      key: 'fechaFin',
      title: 'Fin',
      type: 'date'
    },
    {
      key: 'estado',
      title: 'Estado',
    },
    {
      key: 'capacidadMaxima',
      title: 'Capacidad',
    },
  ]
  //#endregion

  constructor(json: Partial<Evento> = {}) {
    super();
    Object.assign(this, json);
  }
}