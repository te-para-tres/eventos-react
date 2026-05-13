import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { ModeloBase } from "@base/interfaces/models/modelo-base.model";

export class Asistente extends ModeloBase {
  idUnidadAcademica?: string;
  idCarrera?: string;
  carrera?: string;
  expediente?: string;
  nombre?: string;

  static CLASS_NAME = "Asistente";
  static BASE_ROUTE = "/asistentes";

  static ENDPOINTS = {
    DEFAULT: "/v1/asistente.json",
  };

  static EXPAND = {
    DEFAULT:
      "asistenteEventos",
  };

  static fromJson(data: Partial<Asistente>) {
    return new Asistente(data);
  }

  static fromJsonList(data: Partial<Asistente>[]) {
    return data.map((_data) => new Asistente(_data));
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
    {
      key: "fechaInicio",
      title: "Inicio",
      type: "date",
    },
    {
      key: "fechaFin",
      title: "Fin",
      type: "date",
    },
    {
      key: "estado",
      title: "Estado",
    },
    {
      key: "capacidadMaxima",
      title: "Capacidad",
    },
  ];
  //#endregion

  constructor(json: Partial<Asistente> = {}) {
    super();
    Object.assign(this, json);
  }
}
