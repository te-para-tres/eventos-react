import type { Evento } from "@/models/Evento.model";
import type { Asistente } from "@/models/Asistente.model";
import dayjs from "dayjs";

const estados = {
  INFORMACION_BASICA: "Información básica",
  LOGISTICA: "Logística",
  VISIBILIDAD: "Visibilidad",
  REVISION: "Revisión",
  ESPERA: "En espera",
  APROBADO: "Aprobado",
  CANCELADO: "Cancelado",
};

const visibilidades = {
  publico: "Público",
  "unidad academica": "Unidad académica",
  carrera: "Carrera",
};

export function obtenerCarrera(asistente: Asistente) {
  return typeof asistente.carrera === "string"
    ? asistente.carrera
    : asistente.carrera?.nombre || "Sin carrera";
}

function escaparCelda(valor: unknown) {
  const texto = String(valor ?? "—");
  const seguro = /^[=+\-@\t\r]/.test(texto) ? `'${texto}` : texto;
  return `"${seguro.replace(/"/g, '""')}"`;
}

export function exportarAsistentes(evento: Evento) {
  const filas = [
    ["Información del evento"],
    ["Identificador", evento.id],
    ["Evento", evento.nombre],
    ["Categoría", evento.categoriaEvento?.nombre],
    ["Carrera organizadora", evento.carrera?.nombre],
    ["Actividad", evento.actividad?.nombre],
    ["Unidad académica", evento.unidadAcademica?.nombre],
    ["Lugar", evento.lugar],
    ["Fecha de inicio", evento.fechaInicio ? dayjs(evento.fechaInicio).format("DD/MM/YYYY HH:mm") : "—"],
    ["Fecha de fin", evento.fechaFin ? dayjs(evento.fechaFin).format("DD/MM/YYYY HH:mm") : "—"],
    ["Estado", evento.estado ? estados[evento.estado as keyof typeof estados] ?? evento.estado : "—"],
    ["Visibilidad", evento.visibilidad ? visibilidades[evento.visibilidad as keyof typeof visibilidades] ?? evento.visibilidad : "—"],
    ["Capacidad mínima", evento.capacidadMinima],
    ["Capacidad máxima", evento.capacidadMaxima],
    [],
    ["Asistentes registrados", evento.asistentes?.length ?? 0],
    [],
    ["Nombre", "Expediente", "Correo electrónico", "Carrera"],
    ...(evento.asistentes ?? []).map((asistente) => [
      asistente.nombre,
      asistente.expediente,
      asistente.correo,
      obtenerCarrera(asistente),
    ]),
  ];

  const contenido = `\uFEFF${filas
    .map((fila) => fila.map(escaparCelda).join(";"))
    .join("\r\n")}`;
  const archivo = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement("a");
  const nombreEvento = (evento.nombre || "evento")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  enlace.href = url;
  enlace.download = `${nombreEvento || "evento"}-asistentes.csv`;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
