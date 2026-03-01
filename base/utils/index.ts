import { IRequestParams } from "@base/interfaces/requests/request-params.interface";

export function limpiarParametros(
  params?: IRequestParams
): IRequestParams | undefined {
  if (!params) return undefined;
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
}

export function removeNulls<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) => value !== null && value !== undefined
    )
  ) as Partial<T>;
}

export function capitalizeFirstLetter(
  str: string | null | undefined
): string | null {
  if (!str) return null;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
