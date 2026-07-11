import { useRef } from "react";
import { Button, Typography } from "antd";
import { QRCodeSVG } from "qrcode.react";
import { DownloadOutlined, PictureOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const ACCENT = "#731C38";
const ACCENT_SOFT = "rgba(115, 28, 56, 0.10)";
const TEXT_DARK = "#1f1f1f";
const TEXT_MUTED = "#57534e";
const TEXT_SUBTLE = "#a8a29e";

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  if (r > Math.min(w, h) / 2) r = Math.min(w, h) / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
};

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const words = (text ?? "").split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  words.forEach((w) => {
    const test = current ? `${current} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = w;
    } else {
      current = test;
    }
  });
  if (current) lines.push(current);
  return lines;
};

const loadImg = (
  img: HTMLImageElement,
  src: string,
  timeoutMs = 4000
): Promise<void> =>
  new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), timeoutMs);
    img.onload = () => {
      clearTimeout(t);
      resolve();
    };
    img.onerror = () => {
      clearTimeout(t);
      reject(new Error("error"));
    };
    img.src = src;
  });

const formatRangeFechas = (inicio?: string, fin?: string): string => {
  if (!inicio) return "—";
  const i = dayjs(inicio);
  const f = fin ? dayjs(fin) : null;
  const dateOf = (d: dayjs.Dayjs) => d.format("DD MMM YYYY");
  const timeOf = (d: dayjs.Dayjs) => d.format("HH:mm");
  if (!f || !f.isValid()) return `${dateOf(i)} • ${timeOf(i)}`;
  if (i.isSame(f, "day")) return `${dateOf(i)} • ${timeOf(i)} – ${timeOf(f)}`;
  return `${dateOf(i)} ${timeOf(i)} → ${dateOf(f)} ${timeOf(f)}`;
};

export type TarjetaQrEvento = {
  id?: string;
  nombre?: string;
  fechaInicio?: string;
  fechaFin?: string;
  lugar?: string;
  capacidadMinima?: number;
  capacidadMaxima?: number;
  categoriaEvento?: { nombre?: string };
  carrera?: { nombre?: string };
  unidadAcademica?: { nombre?: string };
};

export function TarjetaQr({ evento }: { evento: TarjetaQrEvento }) {
  const qrRef = useRef<HTMLDivElement>(null);

  if (!evento.id) {
    return (
      <Typography.Text className="text-xs text-stone-400 text-center">
        QR pendiente
      </Typography.Text>
    );
  }

  const qrValue = `https://eventues.app/registro-evento?id=${evento.id}`;

  const descargarQr = async () => {
    const svgNode = qrRef.current?.querySelector("svg");
    if (!svgNode) return;

    const xml = new XMLSerializer().serializeToString(svgNode);
    const svg64 = btoa(unescape(encodeURIComponent(xml)));
    const qrDataUrl = `data:image/svg+xml;base64,${svg64}`;

    const qrImage = new window.Image();
    await loadImg(qrImage, qrDataUrl);

    const W = 600;
    const H = 760;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = W / 2;

    ctx.fillStyle = "#f6f6f6";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(115, 28, 56, 0.10)";
    ctx.lineWidth = 1.25;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 30 + i * 8);
      ctx.bezierCurveTo(
        W * 0.2,
        10 + i * 8,
        W * 0.5,
        90 + i * 8,
        W * 0.7,
        30 + i * 8
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W * 0.6, 100 + i * 8);
      ctx.bezierCurveTo(
        W * 0.8,
        60 + i * 8,
        W,
        50 + i * 8,
        W,
        20 + i * 8
      );
      ctx.stroke();
    }

    let cursorY = 36;

    ctx.fillStyle = ACCENT;
    ctx.font = "800 18px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("UES", centerX, cursorY);
    cursorY += 24;

    ctx.font = "700 11px Inter, sans-serif";
    ctx.fillText("— EVENTO OFICIAL —", centerX, cursorY);
    cursorY += 24;

    const dividerW = 60;
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX - dividerW / 2, cursorY);
    ctx.lineTo(centerX + dividerW / 2, cursorY);
    ctx.stroke();
    cursorY += 18;

    cursorY += 4;
    ctx.fillStyle = ACCENT;
    ctx.font = "800 26px Inter, sans-serif";
    const titleLines = wrapText(
      ctx,
      evento.nombre ?? "Sin nombre",
      W - 80
    ).slice(0, 2);
    titleLines.forEach((line) => {
      ctx.fillText(line, centerX, cursorY);
      cursorY += 32;
    });
    cursorY += 6;

    const chips: string[] = [];
    if (evento.categoriaEvento?.nombre) chips.push(evento.categoriaEvento.nombre);
    if (evento.carrera?.nombre) chips.push(evento.carrera.nombre);
    if (chips.length > 0) {
      ctx.font = "700 10px Inter, sans-serif";
      const padX = 12;
      const padY = 6;
      const gap = 8;
      const items = chips.map((c) => {
        const t = c.toUpperCase();
        const m = ctx.measureText(t);
        return { text: t, w: m.width + padX * 2, h: 10 + padY * 2 };
      });
      const totalW =
        items.reduce((a, b) => a + b.w, 0) + gap * (items.length - 1);
      let cx = (W - totalW) / 2;
      items.forEach((it) => {
        ctx.fillStyle = ACCENT_SOFT;
        roundRect(ctx, cx, cursorY, it.w, it.h, 999);
        ctx.fill();
        ctx.fillStyle = ACCENT;
        ctx.textBaseline = "middle";
        ctx.fillText(it.text, cx + it.w / 2, cursorY + it.h / 2 + 1);
        cx += it.w + gap;
      });
      cursorY += items[0].h + 16;
    }

    cursorY += 4;
    const qrSize = 220;
    const qrBoxW = qrSize + 32;
    const qrBoxH = qrSize + 56;
    const qrBoxX = (W - qrBoxW) / 2;
    const qrBoxY = cursorY;

    ctx.save();
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, qrBoxX, qrBoxY, qrBoxW, qrBoxH, 16);
    ctx.shadowColor = "rgba(0,0,0,0.06)";
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
    ctx.fill();
    ctx.restore();

    ctx.drawImage(qrImage, qrBoxX + 16, qrBoxY + 16, qrSize, qrSize);

    ctx.fillStyle = TEXT_MUTED;
    ctx.font = "500 12px Inter, sans-serif";
    ctx.textBaseline = "top";
    ctx.fillText(
      "Escanea para registrarte",
      centerX,
      qrBoxY + qrSize + 24
    );

    cursorY = qrBoxY + qrBoxH + 32;

    const details: { label: string; value: string }[] = [
      {
        label: "CAPACIDAD",
        value: `${evento.capacidadMinima ?? 0} – ${evento.capacidadMaxima ?? "∞"} personas`,
      },
      {
        label: "FECHA",
        value: formatRangeFechas(evento.fechaInicio, evento.fechaFin),
      },
      { label: "LUGAR", value: evento.lugar ?? "—" },
    ];
    if (evento.unidadAcademica?.nombre) {
      details.push({
        label: "UNIDAD ACADÉMICA",
        value: evento.unidadAcademica.nombre,
      });
    }

    details.forEach((d) => {
      ctx.fillStyle = TEXT_SUBTLE;
      ctx.font = "700 10px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(d.label, centerX, cursorY);

      ctx.fillStyle = TEXT_DARK;
      ctx.font = "500 13px Inter, sans-serif";
      const vLines = wrapText(ctx, d.value, W - 100).slice(0, 2);
      vLines.forEach((line, i) => {
        ctx.fillText(line, centerX, cursorY + 14 + i * 16);
      });
      cursorY += 14 + vLines.length * 16 + 10;
    });

    const footerY = H - 36;
    ctx.strokeStyle = "rgba(115, 28, 56, 0.20)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - 100, footerY - 12);
    ctx.lineTo(centerX + 100, footerY - 12);
    ctx.stroke();

    ctx.fillStyle = ACCENT;
    ctx.font = "800 14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("Universidad Estatal de Sonora", centerX, footerY + 4);
    ctx.fillStyle = TEXT_SUBTLE;
    ctx.font = "500 10px Inter, sans-serif";
    ctx.fillText(`eventoes — evento #${evento.id}`, centerX, footerY + 22);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const safeName = (evento.nombre ?? "evento")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, 40);
      link.download = `qr-${safeName || `evento-${evento.id}`}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <div className="flex flex-col items-center">
      <div ref={qrRef} className="flex flex-col items-center">
        <Typography.Text className="text-black font-medium mb-1 block text-center">
          Código QR de acceso
        </Typography.Text>
        <QRCodeSVG
          value={qrValue}
          size={100}
          fgColor={ACCENT}
          level="H"
        />
      </div>
      <Button
        type="default"
        icon={<DownloadOutlined />}
        onClick={descargarQr}
        size="small"
        block
        className="mt-2 w-28"
      >
      </Button>
    </div>
  );
}
