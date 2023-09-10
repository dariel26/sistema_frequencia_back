import moment from "moment-timezone";
import { IDataAtividade } from "../interfaces";

const zona = "America/Sao_Paulo";

moment.tz.setDefault(zona);

export function encontrarMinEMaxDatas(datas: Date[]) {
  if (!Array.isArray(datas) || datas.length === 0) {
    return [];
  }

  let dataMinima = datas[0];
  let dataMaxima = datas[0];

  for (let i = 1; i < datas.length; i++) {
    if (datas[i] < dataMinima) {
      dataMinima = datas[i];
    }
    if (datas[i] > dataMaxima) {
      dataMaxima = datas[i];
    }
  }

  return [dataMinima, dataMaxima];
}

export function amdEmData(string: string): Date {
  const ano = string.substring(0, 4);
  const mes = string.substring(5, 7);
  const dia = string.substring(8, 10);

  return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
}
export function dataEmAmd(data: Date): string {
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  const ano = data.getFullYear();
  return `${ano}-${mes < 10 ? "0" + mes : mes}-${dia < 10 ? "0" + dia : dia}`;
}

function datasPorDiaSemana(
  dataInicio: Date,
  dataFim: Date,
  diasSemana: {
    segunda: boolean;
    terca: boolean;
    quarta: boolean;
    quinta: boolean;
    sexta: boolean;
    sabado: boolean;
    domingo: boolean;
  }
) {
  var datas = [];
  var dataAtual = new Date(dataInicio);

  const dias: number[] = [];
  if (diasSemana.domingo) dias.push(0);
  if (diasSemana.segunda) dias.push(1);
  if (diasSemana.terca) dias.push(2);
  if (diasSemana.quarta) dias.push(3);
  if (diasSemana.quinta) dias.push(4);
  if (diasSemana.sexta) dias.push(5);
  if (diasSemana.sabado) dias.push(6);

  while (dataAtual <= dataFim) {
    var diaSemanaAtual = dataAtual.getDay();

    if (dias.includes(diaSemanaAtual)) {
      datas.push(new Date(dataAtual));
    }

    dataAtual.setDate(dataAtual.getDate() + 1);
  }

  return datas;
}

function dataFrontEmDataBD(data: string): string {
  return new Date(data).toISOString().slice(0, 10).replace("T", " ");
}

function dataEmDataBD(data: Date): string {
  return data.toISOString().slice(0, 10).replace("T", " ");
}

function dataArarangua(): Date {
  return moment.tz(zona).toDate();
}

function ordenarPorIdUsuarioASC(
  usuario1: { id_usuario: number },
  usuario2: { id_usuario: number }
) {
  if (usuario1.id_usuario < usuario2.id_usuario) return -1;
  else if (usuario1 > usuario2) return 1;
  else return 0;
}

function extenderArray<T>(array: T[], tamanho: number): T[] {
  const arrayExtendido: T[] = [];

  for (let i = 0; i < tamanho; i++) {
    const originalIndex = i % array.length;
    arrayExtendido.push(array[originalIndex]);
  }

  return arrayExtendido.filter((a) => a);
}

function datasNoIntervalo(
  data_inicial: Date,
  data_final: Date,
  datas: IDataAtividade[]
) {
  const datasEntreIntervalo: IDataAtividade[] = [];
  datas?.forEach((d) => {
    if (amdEmData(d.data) >= data_inicial && amdEmData(d.data) <= data_final)
      datasEntreIntervalo.push(d);
  });
  return datasEntreIntervalo;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
function distancia(
  coordenada1: { lat: number; lon: number },
  coordenada2: { lat: number; lon: number }
): number {
  const R = 6371000; // Raio médio da Terra em metros

  const lat1Rad = toRadians(coordenada1.lat);
  const lon1Rad = toRadians(coordenada1.lon);
  const lat2Rad = toRadians(coordenada2.lat);
  const lon2Rad = toRadians(coordenada2.lon);

  const deltaLat = lat2Rad - lat1Rad;
  const deltaLon = lon2Rad - lon1Rad;

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
}

function diferencaAbsEmHoras(dataChegada: Date, dataAtividade: Date): number {
  const milisegundos = dataAtividade.getTime() - dataChegada.getTime();
  const horas = milisegundos / (1000 * 60 * 60);
  return horas;
}

function horarioEmData(data: Date, horario: string): Date {
  const [hour, minute] = horario.split(":").map(Number);
  data.setHours(hour);
  data.setMinutes(minute);
  return data;
}

const cUtils = {
  encontrarMinEMaxDatas,
  amdEmData,
  dataEmAmd,
  ordenarPorIdUsuarioASC,
  datasPorDiaSemana,
  dataFrontEmDataBD,
  dataEmDataBD,
  dataArarangua,
  extenderArray,
  datasNoIntervalo,
  distancia,
  diferencaAbsEmHoras,
  horarioEmData,
};

export default cUtils;
