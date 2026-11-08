import type { Evento } from "@/models/Evento.model";
import { FileExcelOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { exportarAsistentes } from "./exportarAsistentes";

export function ExportarAsistentesButton({ evento }: { evento: Evento }) {
  return (
    <Button
      icon={<FileExcelOutlined />}
      onClick={() => exportarAsistentes(evento)}
      className="mb-3"
    >
      Descargar CSV para Excel
    </Button>
  );
}
