"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extenderArray = exports.datasNoIntervalo = exports.amdEmData = exports.obterDatasPorDiaSemana = exports.horarioEmData = exports.diferencaAbsEmHoras = exports.distancia = void 0;
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
exports.distancia = distancia;
function diferencaAbsEmHoras(data1, data2) {
    const milisegundos = data2.getTime() - data1.getTime();
    const horas = milisegundos / (1000 * 60 * 60);
    return horas;
}
exports.diferencaAbsEmHoras = diferencaAbsEmHoras;
function horarioEmData(data, horario) {
    const [hour, minute] = horario.split(":").map(Number);
    data.setHours(hour);
    data.setMinutes(minute);
    return data;
}
exports.horarioEmData = horarioEmData;
function obterDatasPorDiaSemana(dataInicio, dataFim, diasSemana) {
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
exports.obterDatasPorDiaSemana = obterDatasPorDiaSemana;
function amdEmData(string) {
    const ano = string.substring(0, 4);
    const mes = string.substring(5, 7);
    const dia = string.substring(8, 10);
    return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
}
exports.amdEmData = amdEmData;
function datasNoIntervalo(data_inicial, data_final, datas) {
    const datasEntreIntervalo = [];
    datas === null || datas === void 0 ? void 0 : datas.forEach((d) => {
        if (amdEmData(d.data) >= data_inicial && amdEmData(d.data) <= data_final)
            datasEntreIntervalo.push(d);
    });
    return datasEntreIntervalo;
}
exports.datasNoIntervalo = datasNoIntervalo;
function extenderArray(array, tamanho) {
    const arrayExtendido = [];
    for (let i = 0; i < tamanho; i++) {
        const originalIndex = i % array.length;
        arrayExtendido.push(array[originalIndex]);
    }
    return arrayExtendido;
}
exports.extenderArray = extenderArray;
