import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { ModeloBase } from "@base/interfaces/models/modelo-base.model";
import { UnidadAcademica } from "./UnidadAcademica.model";

export class Carrera extends ModeloBase {
  idUnidadAcademica?: string;
  nombre?: string;
  descripcion?: string;
  tipo?: string;
  estado?: string;
  UnidadAcademica?: UnidadAcademica;

  static CLASS_NAME = 'Carrera';
  static BASE_ROUTE = "/carrera";

  static ENDPOINTS = {
    DEFAULT: '/v1/carrera.json',
  };

  static EXPAND = {
    DEFAULT: "eventos,unidadAcademica"
  }

  static fromJson(data: Partial<Carrera>) {
    return new Carrera(data);
  }

  static fromJsonList(data: Partial<Carrera>[]) {
    return data.map((_data) => new Carrera(_data));
  }

  static COLUMNS: ModelColumnsType[] = [
    {
      key: 'nombre',
      title: 'Nombre',
    },
    {
      key: 'tipo',
      title: 'Tipo',
    },
    {
      key: 'estado',
      title: 'Estado',
    },
    {
      key: 'descripcion',
      title: 'Descripción',
    },
  ]
  //#endregion

  constructor(json: Partial<Carrera> = {}) {
    super();
    Object.assign(this, json);
  }
}