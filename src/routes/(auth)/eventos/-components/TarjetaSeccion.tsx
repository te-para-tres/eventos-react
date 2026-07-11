import { Card } from "antd";

const ACCENT = "#731C38";

export function TarjetaSeccion({
  title,
  icon,
  children,
}: {
  title: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card
      title={
        <span className="flex items-center gap-2 font-bold capitalize" style={{ color: ACCENT }}>
          <span style={{ color: ACCENT }}>{icon}</span>
          {title}
        </span>
      }
      className="shadow-sm"
      styles={{ title: { color: ACCENT, borderBottom: `px solid ${ACCENT}` } }}
    >
      {children}
    </Card>
  );
}
