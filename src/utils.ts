import { IDataAtividade } from "./interfaces";

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function distancia(
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

export function diferencaAbsEmHoras(
  dataChegada: Date,
  dataAtividade: Date
): number {
  const milisegundos = dataAtividade.getTime() - dataChegada.getTime();
  const horas = milisegundos / (1000 * 60 * 60);
  return horas;
}

export function horarioEmData(data: Date, horario: string): Date {
  const [hour, minute] = horario.split(":").map(Number);
  data.setHours(hour);
  data.setMinutes(minute);
  return data;
}

export function dataFrontEmDataBD(data: string): string {
  return new Date(data).toISOString().slice(0, 10).replace("T", " ");
}

export function obterDatasPorDiaSemana(
  dataInicio: Date,
  dataFim: Date,
  diasSemana: number[]
) {
  var datas = [];
  var dataAtual = new Date(dataInicio);

  while (dataAtual <= dataFim) {
    var diaSemanaAtual = dataAtual.getDay();

    if (diasSemana.includes(diaSemanaAtual)) {
      datas.push(new Date(dataAtual));
    }

    dataAtual.setDate(dataAtual.getDate() + 1);
  }

  return datas;
}

export function amdEmData(string: string) {
  const ano = string.substring(0, 4);
  const mes = string.substring(5, 7);
  const dia = string.substring(8, 10);

  return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
}

export function datasNoIntervalo(
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

export function extenderArray<T>(array: T[], tamanho: number): T[] {
  const arrayExtendido: T[] = [];

  for (let i = 0; i < tamanho; i++) {
    const originalIndex = i % array.length;
    arrayExtendido.push(array[originalIndex]);
  }

  return arrayExtendido;
}
