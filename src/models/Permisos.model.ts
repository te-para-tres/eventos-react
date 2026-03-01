import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { ModeloBase } from "@base/interfaces/models/modelo-base.model";
import { Modulo } from "./Modulo.model";
import { DataNode } from "antd/lib/tree";

export class Permiso extends ModeloBase {
  idModulo?: string;
  nombre?: string;
  descripcion?: string;

  modulo?: Modulo;

  //#region STATICS DEFAULT PARA CRUDS
  static CLASS_NAME = "Permiso";
  static BASE_ROUTE = "/administracion/permisos";

  static ENDPOINTS = {
    DEFAULT: "/v1/permiso.json",
  };

  static EXPAND = {
    DEFAULT: "modulo",
  };

  static COLUMNS: ModelColumnsType[] = [
    {
      key: "nombre",
      title: "Nombre",
      dataIndex: "nombre",
    },
    {
      key: "modulo.nombre",
      title: "Módulo",
      dataIndex: "idModulo",
    },
  ];

  static fromJson(data: Partial<Permiso>) {
    return new Permiso(data);
  }

  static fromJsonList(data: Partial<Permiso>[]) {
    return data.map((_data) => new Permiso(_data));
  }
  //#endregion

  constructor(data: Partial<Permiso> = {}) {
    super();

    Object.assign(this, data);
  }

  toTreeData(): DataNode {
    return {
      title: this.nombre,
      key: Permiso.name + "-" + this.id,
    };
  }

  //#region PERMISOS ESTATICOS
  static PERMISO_MENU = {
    REPORTES: "MENU_VER_REPORTES",
    TARIFAS: "MENU_VER_TARIFAS",
    CAMPANAS: "MENU_VER_CAMPAÑAS",
    BLOQUES: "MENU_VER_BLOQUES",
    ORDEN_FACTURA: "MENU_VER_ORDEN_FACTURA",
    FINANZAS: "MENU_VER_FINANZAS",
    PAUTA_SERVICIO: "MENU_VER_PAUTASERVICIOS",
    INTERNET: "MENU_VER_INTERNET",
    PERIODICO: "MENU_PERIODICO",
    RADIO: "MENU_VER_RADIO",
    PANTALLA: "MENU_PANTALLA",
    TELEVISION: "MENU_TELEVISION",
    CATALOGOS: "MENU_VER_CATÁLOGO",
    ADMINISTRACION: "MENU_VER_ADMINISTRACIÓN",
  };
  static VER_TODAS_CAMPAÑAS = "VER_TODAS_CAMPAÑAS";

  static CAMPAÑAS = [Permiso.VER_TODAS_CAMPAÑAS];
  //#endregion
}
