import { ModeloBase } from "@base/interfaces/models/modelo-base.model";
import { UploadFile } from "antd";


export class Media extends ModeloBase {
  idUsuario?: string;
  nombre?: string;
  uuid?: string;
  peso?: string;
  extension?: string;
  mimetype?: string;
  ruta?: string;
  descripcion?: string;
  enLocal?: string;
  enNube?: string;
  urlNube?: string;
  idTipoDocumento?: string;
  idTipoDocumentoEmpresa?: string;


  //#region STATICS DEFAULT PARA CRUDS
  static CLASS_NAME = 'Media';
  static BASE_ROUTE = "/"; //No aplica, actualizar en caso que si

  static ENDPOINTS = {
    DEFAULT: '/v1/media.json',
    SUBIR_ARCHIVO: '/v1/subir-archivo.json',
  }

  static fromJson(data: Partial<Media>) {
    return new Media(data);
  }

  static fromJsonList(data: Partial<Media>[]) {
    return data.map((_data) => new Media(_data));
  }
  //#endregion
  
  constructor(data: Partial<Media> = {}) {
    super();

    Object.assign(this, data);
  }

  toUploadFile() : UploadFile<any> {
    return {
      uid: this.uuid ?? '',
      name: this.nombre ?? 'Sin Nombre',
      status: 'done',
      url: this.ruta ?? '',
    }
  }
}