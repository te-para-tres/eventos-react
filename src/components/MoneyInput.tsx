import React, { useRef } from "react";
import { InputNumber } from "antd";
import type { InputNumberProps } from "antd";

export type MoneyInputProps = Omit<InputNumberProps<number>, "formatter" | "parser" | "onClick" | "onKeyDown"> & {
  formatter?: InputNumberProps<number>["formatter"];
  parser?: InputNumberProps<number>["parser"];
  onClick?: React.MouseEventHandler<HTMLElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  prefix?: React.ReactNode;
  selectOnFocus?: boolean;
  replaceOnType?: boolean; // Nueva prop para activar/desactivar el reemplazo
};

const MoneyInput: React.FC<MoneyInputProps> = ({
  max = 999999,
  step = 0.01,
  placeholder = "Monto",
  formatter,
  parser,
  onClick,
  onKeyDown,
  prefix = "$",
  selectOnFocus = true,
  replaceOnType = true,
  style,
  onChange,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const shouldReplaceRef = useRef(false);

  const defaultFormatter: NonNullable<InputNumberProps<number>["formatter"]> = (value) => {
    if (value === undefined || value === null || value === ("" as unknown)) {
      return `0.00`;
    }
    const num = typeof value === "number" ? value : Number(String(value).replace(/[^\d.-]/g, ""));
    if (Number.isNaN(num)) return "";
    return `${num.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const defaultParser: NonNullable<InputNumberProps<number>["parser"]> = (value) => {
    if (!value) return undefined as unknown as number;
    const cleaned = value.replace(/[^\d.-]/g, "");
    const parsed = parseFloat(cleaned);
    if (Number.isNaN(parsed)) return undefined as unknown as number;
    const rounded = Math.round(parsed * 100) / 100; // Limitado a 2 decimales
    return rounded as unknown as number;
  };

  const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
    const input = e.target as HTMLInputElement;
    if (input && typeof input.select === "function") {
      input.select();
      shouldReplaceRef.current = true;
    }
    onClick?.(e);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    // Si se presiona un dígito y está marcado para reemplazar
    if (replaceOnType && /^\d$/.test(e.key) && shouldReplaceRef.current) {
      e.preventDefault();
      const newValue = parseFloat(e.key);
      
      // Llamar al onChange si existe
      if (onChange) {
        onChange(newValue);
      }
      
      shouldReplaceRef.current = false;
      return;
    }

    // Manejar punto decimal
    if (e.key === "." || e.key === ",") {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      if (input) {
        const value = input.value;
        const decimalIndex = value.indexOf(".");
        if (decimalIndex !== -1) {
          const newValue = value.substring(0, decimalIndex + 1);
          input.value = newValue;
          setTimeout(() => {
            input.setSelectionRange(newValue.length, newValue.length);
          }, 0);
        }
      }
    }

    // Resetear bandera si se presiona cualquier otra tecla
    if (e.key !== "Tab") {
      shouldReplaceRef.current = false;
    }

    onKeyDown?.(e);
  };

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
    if (selectOnFocus) {
      const input = e.target as HTMLInputElement;
      if (input && typeof input.select === "function") {
        setTimeout(() => {
          input.select();
          shouldReplaceRef.current = true;
        }, 0);
      }
    }
  };

  const handleBlur = () => {
    shouldReplaceRef.current = false;
  };

  const handleChange: InputNumberProps<number>["onChange"] = (value) => {
    shouldReplaceRef.current = false;
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <InputNumber<number>
      max={max}
      step={step}
      placeholder={placeholder}
      formatter={formatter ?? defaultFormatter}
      parser={parser ?? defaultParser}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      prefix={prefix}
      style={{ width: "100%", ...style }}
      {...props}
    />
  );
};

export default MoneyInput;