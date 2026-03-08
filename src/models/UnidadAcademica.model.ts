import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { ModeloBase } from "@base/interfaces/models/modelo-base.model";

export class UnidadAcademica extends ModeloBase {
  nombre?: string;
  descripcion?: string;
  telefono?: string;
  correo?: string;
  estado?: string;

  static CLASS_NAME = 'Unidad Académica';
  static BASE_ROUTE = "/unidad-academica";

  static ENDPOINTS = {
    DEFAULT: '/v1/unidad-academica.json',
  };

  static EXPAND = {
    DEFAULT: "carreras,eventos"
  }

  static fromJson(data: Partial<UnidadAcademica>) {
    return new UnidadAcademica(data);
  }

  static fromJsonList(data: Partial<UnidadAcademica>[]) {
    return data.map((_data) => new UnidadAcademica(_data));
  }

  static COLUMNS: ModelColumnsType[] = [
    {
      key: 'nombre',
      title: 'Nombre',
    },
    {
      key: 'telefono',
      title: 'Teléfono',
    },
    {
      key: 'correo',
      title: 'Correo',
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

  constructor(json: Partial<UnidadAcademica> = {}) {
    super();
    Object.assign(this, json);
  }
}