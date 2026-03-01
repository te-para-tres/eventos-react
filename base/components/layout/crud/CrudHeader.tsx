import { AddButton } from "@base/components/buttons/AddButton";
import { ReturnButton } from "@base/components/buttons/ReturnButton";
import { Typography } from "antd";

interface CrudHeaderProps {
  titulo: string;
  agregarLabel?: string;
  volverLabel?: string;
  onAgregar?: () => void;
  onVolver?: () => void;
  agregarIcon?: React.ReactNode;
}

export function CrudHeader({
  titulo,
  agregarLabel,
  volverLabel,
  onAgregar,
  onVolver,
  agregarIcon,
}: CrudHeaderProps) {
  return (
    <div className="flex justify-between flex-wrap gap-2">
      <Typography.Title level={3}>{titulo}</Typography.Title>
      <div className="flex flex-1 justify-end flex-wrap gap-2">
        {onAgregar && (
          <AddButton onClick={onAgregar} responsive label={agregarLabel} icon={agregarIcon} />
        )}
        {onVolver && (
          <ReturnButton onClick={onVolver} responsive label={volverLabel} />
        )}
      </div>
    </div>
  );
}
