import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { ModeloBase } from "@base/interfaces/models/modelo-base.model";
import { Evento } from "./Evento.model";
import { Empleado } from "./Empleado.model";

export class EventoEmpleado extends ModeloBase {
  idEmpleado?: string;
  idEvento?: string;

  empleado?: Empleado;
  evento?: Evento;

  static CLASS_NAME = 'Evento Empleado';
  static BASE_ROUTE = "/";

  static ENDPOINTS = {
    DEFAULT: '',
  };

  static EXPAND = {
    DEFAULT: ""
  }

  static fromJson(data: Partial<EventoEmpleado>) {
    return new EventoEmpleado(data);
  }

  static fromJsonList(data: Partial<EventoEmpleado>[]) {
    return data.map((_data) => new EventoEmpleado(_data));
  }

  static COLUMNS: ModelColumnsType[] = [
    {
      key: '',
      title: '',
    },
  ]
  //#endregion

  constructor(json: Partial<EventoEmpleado> = {}) {
    super();
    Object.assign(this, json);
  }
}