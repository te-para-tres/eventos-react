import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, ButtonProps, Grid } from "antd";
import React from "react";

interface ReturnButtonProps extends ButtonProps {
  label?: string;
  responsive?: boolean;
}

export function ReturnButton({
  children,
  label = "Volver",
  responsive = false,
  ...props
}: ReturnButtonProps) {
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
      type={props.type ?? "default"}
      icon={props.icon ?? <Icon icon={"ant-design:arrow-left-outlined"} />}
      onClick={props.onClick}
      block={block}
    >
      {children ?? label}
    </Button>
  );
}
