import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { ModeloBase } from "@base/interfaces/models/modelo-base.model";
import { Carrera } from "./Carrera.model";
import { CategoriaEvento } from "./CategoriaEvento.model";
import { EventoMaterial } from "./EventoMaterial.model";
import { EventoMedia } from "./EventoMedia.model";
import { Media } from "./Media.model";
import { UnidadAcademica } from "./UnidadAcademica.model";

export class Evento extends ModeloBase {
  idUnidadAcademica?: string;
  idCategoriaEvento?: string;
  idCarrera?: string;
  idImagenDestacada?: string;
  nombre?: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  capacidadMaxima?: number;
  capacidadMinima?: number;
  fechaCancelacion?: string;
  visibilidad?: string;
  idQr?: string;
  estado?: string;
  lugar?: string;
  latitud?: number;
  longitud?: number;
  eliminado?: string;

  eventoMaterial?: EventoMaterial[];
  eventoMedia?: EventoMedia[];
  carrera?: Carrera;
  categoriaEvento?: CategoriaEvento;
  imagenDestacada?: Media;
  unidadAcademica?: UnidadAcademica;
  qr?: Media;

  static ESTATUS_1 = "INFORMACION_BASICA";
  static ESTATUS_2 = "LOGISTICA";
  static ESTATUS_3 = "VISIBILIDAD";
  static ESTATUS_4 = "REVISION";
  static ESTATUS_5 = "ESPERA";
  static ESTATUS_6 = "APROBADO";
  static ESTATUS_7 = "CANCELADO";

  static VISIBILIDAD_1 = "Público";
  static VISIBILIDAD_2 = "Unidad Académica";
  static VISIBILIDAD_3 = "Carrera";

  static CLASS_NAME = "Evento";
  static BASE_ROUTE = "/eventos";

  static ENDPOINTS = {
    DEFAULT: "/v1/evento.json",
  };

  static EXPAND = {
    DEFAULT:
      "eventoMaterial,eventoMedia,carrera,categoriaEvento,imagenDestacada,unidadAcademica,qr",
  };

  static fromJson(data: Partial<Evento>) {
    return new Evento(data);
  }

  static fromJsonList(data: Partial<Evento>[]) {
    return data.map((_data) => new Evento(_data));
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

  constructor(json: Partial<Evento> = {}) {
    super();
    Object.assign(this, json);
  }
}
