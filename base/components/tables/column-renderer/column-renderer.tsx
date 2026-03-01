import { Link } from "@tanstack/react-router";
import React from "react";
import dayjs from "dayjs";
import { Typography } from "antd";
import { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";
import { CURRENCY_FORMATTER } from "@base/constants/currency-formatter";

export interface ColumnRenderProps {
  col: ModelColumnsType;
  data: any;
  disableNavigate?: boolean;
  render?: (text: string, data: any) => React.ReactNode;
  navigateUrl?: string;
}

export function ColumnRender({
  col,
  data,
  render,
  disableNavigate = false,
  navigateUrl,
}: ColumnRenderProps) {
  const [description, setDescription] = React.useState(data[col.key]);
  const obtenerProp = React.useCallback((obj: any, keys: string[]) => {
    if (keys?.length === 0) {
      return obj;
    } else {
      if (keys[0] === undefined || !obj[keys[0]]) {
        console.error("Error al obtener propiedad", obj, keys);
        return null;
      }
      return obtenerProp(obj[keys[0]], keys.slice(1));
    }
  }, []);

  const setDescriptionValue = React.useCallback(
    (data: any, type?: string) => {
      const keyList = col.key.split(".");
      const isObject = keyList.length > 1;
      let value = data[col.key];

      if (isObject) {
        const nestedValue = obtenerProp(data, col.key.split("."));
        value = nestedValue;
      }

      if (type === "date") {
        const date = dayjs(value);
        setDescription(date.isValid() ? date.format("DD-MM-YYYY") : "-");
      } else if (col.type === "boolean") {
        setDescription(col.options?.get(value.toString()) || "-");
      } else if (col.type === "currency") {
        setDescription(CURRENCY_FORMATTER.format(value));
      } else {
        // console.warn('Sin tipo de dato');
        setDescription(value);
      }
    },
    [col, obtenerProp]
  );

  React.useEffect(() => {
    setDescriptionValue(data, col.type);
  }, [col, data, setDescriptionValue, obtenerProp]);

  if (render) return render(description, data);

  if (disableNavigate) {
    return (
      <Typography.Text>{description || col.default || "-"}</Typography.Text>
    );
  }

  return (
    <Link to={navigateUrl || `detalle`} search={{ id: data.id }}>
      {description || col.default || "-"}
    </Link>
  );
}
