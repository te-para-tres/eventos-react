import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { ModeloBase } from "@base/interfaces/models/modelo-base.model";
import { EventoEmpleado } from "./EventoEmpleado.model";

export class Empleado extends ModeloBase {
  numEmpleado?: string;
  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  telefono?: string;
  puesto?: string;

  eventoEmpleados?: EventoEmpleado[];

  static CLASS_NAME = 'Empleado';
  static BASE_ROUTE = "";

  static ENDPOINTS = {
    DEFAULT: '',
  };

  static EXPAND = {
    DEFAULT: ""
  }

  static fromJson(data: Partial<Empleado>) {
    return new Empleado(data);
  }

  static fromJsonList(data: Partial<Empleado>[]) {
    return data.map((_data) => new Empleado(_data));
  }

  static COLUMNS: ModelColumnsType[] = [
    {
      key: 'numEmpleado',
      title: 'Número',
    },
    {
      key: 'nombre',
      title: 'Nombre',
    },
    {
      key: 'primerApellido',
      title: 'Primer apellido',
    },
    {
      key: 'segundoApellido',
      title: 'Segundo apellido',
    },
    {
      key: 'telefono',
      title: 'Teléfono',
    },
    {
      key: 'puesto',
      title: 'Puesto',
    },
  ]
  //#endregion

  constructor(json: Partial<Empleado> = {}) {
    super();
    Object.assign(this, json);
  }
}