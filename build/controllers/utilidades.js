"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataEmAmd = exports.amdEmData = exports.encontrarMinEMaxDatas = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const zona = "America/Sao_Paulo";
const MANHA = "Manhã";
const TARDE = "Tarde";
const NOITE = "Noite";
moment_timezone_1.default.tz.setDefault(zona);
process.env.TZ = zona;
function encontrarMinEMaxDatas(datas) {
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
exports.encontrarMinEMaxDatas = encontrarMinEMaxDatas;
function amdEmData(string) {
    const ano = string.substring(0, 4);
    const mes = string.substring(5, 7);
    const dia = string.substring(8, 10);
    return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
}
exports.amdEmData = amdEmData;
function dataEmAmd(data) {
    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    return `${ano}-${mes < 10 ? "0" + mes : mes}-${dia < 10 ? "0" + dia : dia}`;
}
exports.dataEmAmd = dataEmAmd;
function datasPorDiaSemana(dataInicio, dataFim, diasSemana) {
    var datas = [];
    var dataAtual = new Date(dataInicio);
    const dias = [];
    if (diasSemana.domingo)
        dias.push(0);
    if (diasSemana.segunda)
        dias.push(1);
    if (diasSemana.terca)
        dias.push(2);
    if (diasSemana.quarta)
        dias.push(3);
    if (diasSemana.quinta)
        dias.push(4);
    if (diasSemana.sexta)
        dias.push(5);
    if (diasSemana.sabado)
        dias.push(6);
    while (dataAtual <= dataFim) {
        var diaSemanaAtual = dataAtual.getDay();
        if (dias.includes(diaSemanaAtual)) {
            datas.push(new Date(dataAtual));
        }
        dataAtual.setDate(dataAtual.getDate() + 1);
    }
    return datas;
}
function dataFrontEmDataBD(data) {
    return new Date(data).toISOString().slice(0, 10).replace("T", " ");
}
function dataEmDataBD(data) {
    return data.toISOString().slice(0, 10).replace("T", " ");
}
function dataArarangua() {
    return (0, moment_timezone_1.default)(new Date()).tz(zona).toDate();
}
function ordenarPorIdUsuarioASC(usuario1, usuario2) {
    if (usuario1.id_usuario < usuario2.id_usuario)
        return -1;
    else if (usuario1 > usuario2)
        return 1;
    else
        return 0;
}
function extenderArray(array, tamanho) {
    const arrayExtendido = [];
    for (let i = 0; i < tamanho; i++) {
        const originalIndex = i % array.length;
        arrayExtendido.push(array[originalIndex]);
    }
    return arrayExtendido.filter((a) => a);
}
function datasNoIntervalo(data_inicial, data_final, datas) {
    const datasEntreIntervalo = [];
    datas === null || datas === void 0 ? void 0 : datas.forEach((d) => {
        if (amdEmData(d.data) >= data_inicial && amdEmData(d.data) <= data_final)
            datasEntreIntervalo.push(d);
    });
    return datasEntreIntervalo;
}
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
function distancia(coordenada1, coordenada2) {
    const R = 6371000; // Raio médio da Terra em metros
    const lat1Rad = toRadians(coordenada1.lat);
    const lon1Rad = toRadians(coordenada1.lon);
    const lat2Rad = toRadians(coordenada2.lat);
    const lon2Rad = toRadians(coordenada2.lon);
    const deltaLat = lat2Rad - lat1Rad;
    const deltaLon = lon2Rad - lon1Rad;
    const a = Math.sin(deltaLat / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}
function diferencaEmHoras(dataChegada, dataAtividade) {
    const milisegundos = dataAtividade.getTime() - dataChegada.getTime();
    const horas = milisegundos / (1000 * 60 * 60);
    return horas;
}
function horarioEmData(data, horario) {
    const [hour, minute] = horario.split(":").map(Number);
    data.setHours(hour);
    data.setMinutes(minute);
    return (0, moment_timezone_1.default)(data).tz(zona).toDate();
}
function obterPeriodoDoDia(horaInicial, horaFinal) {
    if (!horaInicial || !horaFinal)
        return undefined;
    const inicio = horaParaMinutos(horaInicial);
    const fim = horaParaMinutos(horaFinal);
    const duracaoManha = calcularDuracao(inicio, fim, horaParaMinutos("00:00"), horaParaMinutos("11:59"));
    const duracaoTarde = calcularDuracao(inicio, fim, horaParaMinutos("12:00"), horaParaMinutos("17:59"));
    const duracaoNoite = calcularDuracao(inicio, fim, horaParaMinutos("18:00"), horaParaMinutos("23:59"));
    if (duracaoManha >= duracaoTarde && duracaoManha >= duracaoNoite) {
        return MANHA;
    }
    else if (duracaoTarde >= duracaoManha && duracaoTarde >= duracaoNoite) {
        return TARDE;
    }
    else {
        return NOITE;
    }
}
function calcularDuracao(inicio, fim, periodoInicio, periodoFim) {
    if (inicio <= periodoFim && fim >= periodoInicio) {
        return Math.min(fim, periodoFim) - Math.max(inicio, periodoInicio);
    }
    else {
        return 0;
    }
}
function horaParaMinutos(hora) {
    const [horas, minutos] = hora.split(":");
    return parseInt(horas) * 60 + parseInt(minutos);
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
    diferencaAbsEmHoras: diferencaEmHoras,
    horarioEmData,
    obterPeriodoDoDia,
};
exports.default = cUtils;
