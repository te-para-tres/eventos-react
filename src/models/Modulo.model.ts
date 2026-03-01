import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { ModeloBase } from "@base/interfaces/models/modelo-base.model";
import { DataNode } from "antd/es/tree";
import { Permiso } from "./Permisos.model";

export class Modulo extends ModeloBase {
  nombre?: string;
  permisos: Permiso[] = [];

  //#region STATICS DEFAULT PARA CRUDS
  static CLASS_NAME = "Módulo";
  static BASE_ROUTE = "/administracion/modulos";

  static ENDPOINTS = {
    DEFAULT: "/v1/modulo.json",
  };

  static COLUMNS: ModelColumnsType[] = [
    {
      key: "nombre",
      title: "Nombre",
    },
  ];

  static EXPAND = {
    DEFAULT: "permisos",
  };

  static fromJson(data: Partial<Modulo>) {
    return new Modulo(data);
  }

  static fromJsonList(data: Partial<Modulo>[]) {
    return data.map((_data) => new Modulo(_data));
  }
  //#endregion

  constructor(data: Partial<Modulo> = {}) {
    super();
    Object.assign(this, data);
    this.permisos = Permiso.fromJsonList(data.permisos || []);
  }

  toTreeData(): DataNode {
    return {
      title: this.nombre,
      key: Modulo.name + "-" + this.id,
      children: this.permisos.map((permiso) => permiso.toTreeData()),
    };
  }
}
