function Unidades(num: number) {
  const units = [
    "UN",
    "DOS",
    "TRES",
    "CUATRO",
    "CINCO",
    "SEIS",
    "SIETE",
    "OCHO",
    "NUEVE",
  ];
  if (!num || num === 0) return "";
  if (num > 1 || num < 9) return units[num - 1];
}

function Decenas(num: number) {
  const decena = Math.floor(num / 10);
  const unidad = num - decena * 10;
  const formatUnidad = () => {
    if (Unidades(unidad) === "DOS") {
      return "DÓS";
    } else if (Unidades(unidad) === "TRES") {
      return "TRÉS";
    } else if (Unidades(unidad) === "SEIS") {
      return "SÉIS";
    } else {
      return Unidades(unidad);
    }
  };

  switch (decena) {
    case 1:
      switch (unidad) {
        case 0:
          return "DIEZ";
        case 1:
          return "ONCE";
        case 2:
          return "DOCE";
        case 3:
          return "TRECE";
        case 4:
          return "CATORCE";
        case 5:
          return "QUINCE";
        default:
          return "DIECI" + formatUnidad();
      }
    case 2:
      switch (unidad) {
        case 0:
          return "VEINTE";
        default:
          return "VEINTI" + formatUnidad();
      }
    case 3:
      return DecenasY("TREINTA", unidad);
    case 4:
      return DecenasY("CUARENTA", unidad);
    case 5:
      return DecenasY("CINCUENTA", unidad);
    case 6:
      return DecenasY("SESENTA", unidad);
    case 7:
      return DecenasY("SETENTA", unidad);
    case 8:
      return DecenasY("OCHENTA", unidad);
    case 9:
      return DecenasY("NOVENTA", unidad);
    case 0:
      return Unidades(unidad);
    default:
      return;
  }
}

function DecenasY(strSin: string, numUnidades: number) {
  if (numUnidades > 0) return strSin + " Y " + Unidades(numUnidades);

  return strSin;
} //DecenasY()

function Centenas(num: number) {
  const centenas = Math.floor(num / 100);
  const decenas = num - centenas * 100;

  switch (centenas) {
    case 1:
      if (decenas > 0) return "CIENTO " + Decenas(decenas);
      return "CIEN";
    case 2:
      return "DOSCIENTOS " + Decenas(decenas);
    case 3:
      return "TRESCIENTOS " + Decenas(decenas);
    case 4:
      return "CUATROCIENTOS " + Decenas(decenas);
    case 5:
      return "QUINIENTOS " + Decenas(decenas);
    case 6:
      return "SEISCIENTOS " + Decenas(decenas);
    case 7:
      return "SETECIENTOS " + Decenas(decenas);
    case 8:
      return "OCHOCIENTOS " + Decenas(decenas);
    case 9:
      return "NOVECIENTOS " + Decenas(decenas);
    default:
      return Decenas(decenas);
  }
}

function Seccion(
  num: number,
  divisor: number,
  strSingular: string,
  strPlural: string
) {
  const cientos = Math.floor(num / divisor);
  const resto = num - cientos * divisor;

  let letras = "";

  if (cientos > 0)
    if (cientos > 1) letras = Centenas(cientos) + " " + strPlural;
    else letras = strSingular;

  if (resto > 0) letras += "";

  return letras;
}

function Miles(num: number) {
  const divisor = 1000;
  const cientos = Math.floor(num / divisor);
  const resto = num - cientos * divisor;
  const strMiles = Seccion(num, divisor, resto === 0 ? "MIL" : "UN MIL", "MIL");
  const strCentenas = Centenas(resto);

  if (strMiles === "") return strCentenas;

  return strMiles + " " + strCentenas;
}

function Millones(num: number) {
  const divisor = 1000000;
  const cientos = Math.floor(num / divisor);
  const resto = num - cientos * divisor;
  const strMillones = Seccion(
    num,
    divisor,
    resto === 0 ? "UN MILLON DE" : "UN MILLON ",
    resto === 0 ? "MILLONES DE" : "MILLONES"
  );
  const strMiles = Miles(resto);

  if (strMillones === "") return strMiles;

  return strMillones + " " + strMiles;
}

export default function dineroALetras(num: number) {
  const data = {
    numero: num,
    enteros: Math.floor(num),
    centavos: Math.round(num * 100) - Math.floor(num) * 100,
    letrasCentavos: "",
    letrasMonedaPlural: "PESOS",
    letrasMonedaSingular: "PESO",
    letrasMonedaCentavoPlural: "CENTAVOS",
    letrasMonedaCentavoSingular: "CENTAVO",
  };

  data.letrasCentavos = `${String(data.centavos).padStart(2, "0")}/100 M.N.`;

  if (data.enteros === 0 || !data.enteros)
    return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;

  if (data.enteros === 1)
    return (
      Millones(data.enteros) +
      " " +
      data.letrasMonedaSingular +
      " " +
      data.letrasCentavos
    );
  else
    return (
      Millones(data.enteros) +
      " " +
      data.letrasMonedaPlural +
      " " +
      data.letrasCentavos
    );
}
