export type AntdFormValidationRule = {
  type:
    | "correo"
    | "telefono"
    | "curp"
    | "rfc"
    | "confirmarContrasena"
    | "requerido"
    | "divisa"
    | "minimo"
    | "maximo"
    | "rango"
    | "longitudMinima"
    | "longitudMaxima";

  params?: any;
};

export type AntdFormValidationRuleProps = {
  name: string;
  type: string;
  required?: boolean;
};

export class AntdFormValidation {
  public static StringToRules(rules: AntdFormValidationRule[]) {
    return rules
      .map((rule) => {
        switch (rule.type) {
          case "requerido":
            return AntdFormValidation.Requerido(rule.params?.sujeto);
          case "minimo":
            return AntdFormValidation.Minimo(
              rule.params?.minimo,
              rule.params?.mensaje
            );
          case "maximo":
            return AntdFormValidation.Maximo(
              rule.params?.maximo,
              rule.params?.mensaje
            );
          case "rango":
            return AntdFormValidation.Rango(
              rule.params?.minimo,
              rule.params?.maximo,
              rule.params?.mensaje
            );
          case "correo":
            return AntdFormValidation.Correo(rule.params?.mensaje);
          case "telefono":
            return AntdFormValidation.Telefono(rule.params?.mensaje);
          case "curp":
            return AntdFormValidation.CURP(rule.params?.mensaje);
          case "rfc":
            return AntdFormValidation.RFC(rule.params?.mensaje);
          case "longitudMinima":
            return AntdFormValidation.LongitudMinima(
              rule.params?.longitud,
              rule.params?.mensaje
            );
          case "longitudMaxima":
            return AntdFormValidation.LongitudMaxima(
              rule.params?.longitud,
              rule.params?.mensaje
            );
          case "confirmarContrasena":
            return AntdFormValidation.ConfirmarContrasena(
              rule.params?.form,
              rule.params?.key,
              rule.params?.mensaje
            );
          default:
            return null;
        }
      })
      .filter((rule) => rule !== null);
  }

  public static GetRuleProps(
    rule: AntdFormValidationRule
  ): AntdFormValidationRuleProps[] {
    switch (rule.type) {
      case "requerido":
        return [
          {
            name: "sujeto",
            type: "string",
            required: false,
          },
        ];
      case "minimo":
        return [
          {
            name: "minimo",
            type: "number",
            required: true,
          },
          {
            name: "mensaje",
            type: "string",
            required: false,
          },
        ];
      case "maximo":
        return [
          {
            name: "maximo",
            type: "number",
            required: true,
          },
          {
            name: "mensaje",
            type: "string",
            required: false,
          },
        ];
      case "rango":
        return [
          {
            name: "minimo",
            type: "number",
            required: true,
          },
          {
            name: "maximo",
            type: "number",
            required: true,
          },
          {
            name: "mensaje",
            type: "string",
            required: false,
          },
        ];
      case "correo":
      case "telefono":
      case "curp":
      case "rfc":
      case "divisa":
        return [
          {
            name: "mensaje",
            type: "string",
            required: false,
          },
        ];
      case "confirmarContrasena":
        return [
          {
            name: "key",
            type: "string",
            required: true,
          },
          {
            name: "mensaje",
            type: "string",
            required: false,
          },
        ];
      case "longitudMinima":
      case "longitudMaxima":
        return [
          {
            name: "longitud",
            type: "number",
            required: true,
          },
          {
            name: "mensaje",
            type: "string",
            required: false,
          },
        ];
      default:
        return [];
    }
  }

  public static REGEX = {
    NUMEROS_ENTEROS: /^[0-9\b]+$/,
    NUMEROS_DECIMALES: /^\d*\.?\d*$/,
    CURRENCY_NUMBER_FORMAT: /^\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?$/,
    DIVISA: /^[0-9.,]+$/,
    CORREO:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    TELEFONO: /^[0-9]{10,10}$/,
    BASE_64_IMG: /^data:image\/(png|jpeg|jpg|gif);base64,[A-Za-z0-9+/]+={0,2}$/,
    CURP: /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/,
    RFC: /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/,
  };

  //#region Validaciones especificas
  public static Correo(mensaje?: string) {
    return {
      pattern: AntdFormValidation.REGEX.CORREO,
      message: mensaje ?? "El correo no es válido",
    };
  }

  public static Telefono(mensaje?: string) {
    return {
      pattern: AntdFormValidation.REGEX.TELEFONO,
      message: mensaje ?? "El teléfono no es válido",
    };
  }

  public static CURP(mensaje?: string) {
    return {
      pattern: AntdFormValidation.REGEX.CURP,
      message: mensaje ?? "La CURP no es válida",
    };
  }

  public static RFC(mensaje?: string) {
    return {
      pattern: AntdFormValidation.REGEX.RFC,
      message: mensaje ?? "El RFC no es válido",
    };
  }

  public static ConfirmarContrasena = (
    form: any,
    key: string,
    mensaje?: string
  ) => ({
    validator(_: any, value: string) {
      if (!value || form.getFieldValue(key) === value) {
        return Promise.resolve();
      }
      return Promise.reject(
        new Error(mensaje ?? "Las contraseñas no coinciden")
      );
    },
  });

  //#endregion

  //#region Validaciones comunes
  public static Requerido(mensaje?: string) {
    return {
      required: true,
      message: `${mensaje}`,
    };
  }

  public static Divisa(mensaje?: string) {
    return {
      pattern: AntdFormValidation.REGEX.DIVISA,
      message: mensaje ?? "El valor no es válido",
    };
  }

  public static Minimo(minimo: number, mensaje?: string) {
    return {
      min: minimo,
      message: mensaje ?? `El valor mínimo es ${minimo}`,
    };
  }

  public static Maximo(maximo: number, mensaje?: string) {
    return {
      max: maximo,
      message: mensaje ?? `El valor máximo es ${maximo}`,
    };
  }

  public static Rango(minimo: number, maximo: number, mensaje?: string) {
    return {
      min: minimo,
      max: maximo,
      message: mensaje ?? `El valor debe estar entre ${minimo} y ${maximo}`,
    };
  }

  public static LongitudMinima(longitud: number, mensaje?: string) {
    return {
      min: longitud,
      message:
        mensaje ?? `La longitud debe ser de al menos ${longitud} caracteres`,
    };
  }

  public static LongitudMaxima(longitud: number, mensaje?: string) {
    return {
      max: longitud,
      message:
        mensaje ?? `La longitud debe ser de máximo ${longitud} caracteres`,
    };
  }

  //#endregion
}
