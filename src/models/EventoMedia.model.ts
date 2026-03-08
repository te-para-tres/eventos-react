import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { ModeloBase } from "@base/interfaces/models/modelo-base.model";
import { Evento } from "./Evento.model";
import { Media } from "./Media.model";

export class EventoMedia extends ModeloBase {
  idEvento?: string;
  idMedia?: string;
  evento?: Evento;
  media?: Media;

  static CLASS_NAME = 'Evento Media';
  static BASE_ROUTE = "/evento-media";

  static ENDPOINTS = {
    DEFAULT: '/v1/evento-media.json',
  };

  static EXPAND = {
    DEFAULT: "evento,media"
  }

  static fromJson(data: Partial<EventoMedia>) {
    return new EventoMedia(data);
  }

  static fromJsonList(data: Partial<EventoMedia>[]) {
    return data.map((_data) => new EventoMedia(_data));
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

  constructor(json: Partial<EventoMedia> = {}) {
    super();
    Object.assign(this, json);
  }
}