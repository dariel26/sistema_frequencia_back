import { findTimeZone, getZonedTime } from "timezone-support";
import { IDataAtividade } from "../interfaces";

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

function dataTimeArarangua(): Date {
  const ararangua = findTimeZone("America/Sao_Paulo");
  const { year, month, day, hours, minutes } = getZonedTime(
    new Date(),
    ararangua
  );

  return new Date(year, month - 1, day, hours, minutes);
}

function dataArarangua(): Date {
  const ararangua = findTimeZone("America/Sao_Paulo");
  const { year, month, day } = getZonedTime(new Date(), ararangua);

  return new Date(year, month - 1, day);
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

const cUtils = {
  encontrarMinEMaxDatas,
  amdEmData,
  dataEmAmd,
  ordenarPorIdUsuarioASC,
  datasPorDiaSemana,
  dataFrontEmDataBD,
  dataEmDataBD,
  dataTimeArarangua,
  dataArarangua,
  extenderArray,
  datasNoIntervalo,
};

export default cUtils;
