import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, ButtonProps, Grid } from "antd";
import React from "react";

interface AddButtonProps extends ButtonProps {
  label?: string;
  responsive?: boolean;
}

export function AddButton({
  children,
  label = "Agregar",
  responsive = false,
  ...props
}: AddButtonProps) {
  const { lg } = Grid.useBreakpoint();

  const block = React.useMemo(() => {
    if (responsive) {
      return !lg;
    }
    return props.block;
  }, [lg, props.block, responsive]);

  return (
    <Button
      {...props}
      type={props.type ?? "primary"}
      icon={props.icon ?? <Icon icon={"ant-design:plus-outlined"} />}
      onClick={props.onClick}
      block={block}
    >
      {children ?? label}
    </Button>
  );
}
