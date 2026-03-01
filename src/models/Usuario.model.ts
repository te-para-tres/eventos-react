import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { ModeloBase } from "@base/interfaces/models/modelo-base.model";
import { Media } from "./Media.model";
import { Permiso } from "./Permisos.model";
import VITE_ENV from "@/config/constants/vite-env";
import { IUsuarioBase } from "@base/interfaces/models/usuario-base.interface";

export class Usuario extends ModeloBase implements IUsuarioBase {
  correo: string = "";
  usuario: string = "";
  nombre: string = "";
  apellidos?: string;
  clave?: string;
  estatus: number = 0;
  telefono?: string;
  alias?: string;
  foto?: string;
  rol: "admin" | "desarrollador" | "usuario" = "usuario";
  semilla: string | null = null;
  media: Media[] = [];
  permisos?: string[];
  moduloPermisos?: Permiso[] | [];
  otp?: boolean;

  //#region STATICS DEFAULT PARA CRUDS
  static CLASS_NAME = "Usuario";
  static BASE_ROUTE = "/administracion/usuarios";

  static ENDPOINTS = {
    DEFAULT: "/v1/usuario.json",
    INICIAR_SESION: "/v1/iniciar-sesion.json",
    REFERESCAR_USUARIO: "/v1/refrescar-usuario.json",
    OBTENER_QR: "/v1/usuario/obtener-qr.json",
    VALIDAR_QR: "/v1/usuario/verificar.json",
    ACTIVAR_OAUTH: "/v1/usuario/activar-oauth.json",
    DESACTIVAR_OAUTH: "/v1/usuario/desactivar-oauth.json", //TODO: ELIMINAR ESTA OPCION, ES
  };

  static COLUMNS: ModelColumnsType[] = [
    {
      key: "nombre",
      title: "Nombre(s)",
    },
    {
      key: "apellidos",
      title: "Apellidos",
    },
    {
      key: "correo",
      title: "Correo",
    },
    {
      key: "telefono",
      title: "Teléfono",
    },
  ];

  static ESTATUS_LIST = [
    { value: 1, label: "Activo" },
    { value: 0, label: "Inactivo" },
  ];

  static EXPAND = {
    DEFAULT: "",
    SESION: "radioDifusora",
    PERMISOS: "moduloPermisos",
    CLAVES_ACCESO: "clavesAcceso",
    PUERTAS: "puertas",
    TIPO_CARGOS: "tipoCargos",
  };

  static fromJson(data: Partial<Usuario>) {
    return new Usuario(data);
  }

  static fromJsonList(data: Partial<Usuario>[]) {
    return data.map((_data) => new Usuario(_data));
  }

  //#endregion

  static ROLES = {
    ADMIN: "admin",
    DESARROLLADOR: "desarrollador",
    USUARIO: "usuario",
    EMPRESA: "empresa",
  };

  static ROLES_LIST = [
    { value: "admin", label: "Administrador" },
    { value: "desarrollador", label: "Desarrollador" },
    { value: "usuario", label: "Usuario" },
    { value: "empresa", label: "Empresa" },
    { value: "Admininistrador", label: "Admininistrador" },
  ];

  constructor(data: Partial<Usuario> = {}) {
    super();
    Object.assign(this, data);
    this.moduloPermisos = Permiso?.fromJsonList(data?.moduloPermisos || []);
  }

  getNombreCompleto() {
    return `${this.nombre} ${this.apellidos || ""}`.trim();
  }

  getEstatus() {
    return this.estatus ? "Activo" : "Inactivo";
  }

  validarPermiso(permiso: string) {
    if (VITE_ENV.VALIDAR_PERMISOS === false) return true;

    return this.permisos?.some((_permiso) => _permiso === permiso);
  }

  validarPermisos(permisos: string[]) {
    if (VITE_ENV.VALIDAR_PERMISOS === false) return true;

    return this.permisos?.some((_permiso) => permisos.includes(_permiso));
  }
}

export class UsuarioSesion extends Usuario {
  token: string = "";

  constructor(data: Partial<UsuarioSesion> = {}) {
    super();
    Object.assign(this, data);
  }

  static fromJson(data: Partial<UsuarioSesion>) {
    return new UsuarioSesion(data);
  }

  static fromJsonList(data: Partial<UsuarioSesion>[]) {
    return data.map((_data) => new UsuarioSesion(_data));
  }
}
