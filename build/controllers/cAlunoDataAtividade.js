"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const timezone_support_1 = require("timezone-support");
const DBAlunoDataAtividade_1 = __importDefault(require("../db/DBAlunoDataAtividade"));
const errors_1 = require("../errors");
const utils_1 = require("../utils");
const cAlunoDataAtividade = {
    buscarPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO nao precisar passar o id
            const { id } = req.params;
            const ararangua = (0, timezone_support_1.findTimeZone)("America/Sao_Paulo");
            const araranguaTime = (0, timezone_support_1.getZonedTime)(new Date(), ararangua);
            try {
                const presencas = yield DBAlunoDataAtividade_1.default.buscar(id);
                res.status(200).json({ presencas, dataHora: araranguaTime });
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
    criarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dados } = req.body;
            try {
                yield DBAlunoDataAtividade_1.default.deletar(dados.map(({ id_dataatividade }) => id_dataatividade));
                yield DBAlunoDataAtividade_1.default.criar(dados);
                res.status(201).json();
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
    editarPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { novosDados } = req.body;
            try {
                const ararangua = (0, timezone_support_1.findTimeZone)("America/Sao_Paulo");
                const { day, month, year, hours, minutes } = (0, timezone_support_1.getZonedTime)(new Date(), ararangua);
                const presenca = yield DBAlunoDataAtividade_1.default.buscarPorId(novosDados.id_alunodataatividade);
                const dataAtual = new Date(year, month - 1, day, hours, minutes);
                const dataAtividade = (0, utils_1.horarioEmData)(presenca[0].data, presenca[0].hora_inicial);
                const coordenadaDoLocal = presenca[0].coordenadas;
                const coordenadaDoUsuario = novosDados.coordenadas;
                const raio = (0, utils_1.distancia)(coordenadaDoUsuario, coordenadaDoLocal);
                const diferencaEmHoras = (0, utils_1.diferencaAbsEmHoras)(dataAtual, dataAtividade);
                if (raio > 180)
                    return res
                        .status(400)
                        .json({ message: "Fora do raio de distância permitido" });
                if (diferencaEmHoras > 0.3)
                    return res.status(400).json({
                        message: "Muito cedo, marque a presença faltando menos de 20 minutos",
                    });
                if (diferencaEmHoras < -2)
                    return res.status(400).json({
                        message: "Fora do tempo limite para marcar presença",
                    });
                yield DBAlunoDataAtividade_1.default.editar(novosDados);
                res.status(200).json({ message: "Presença marcada!" });
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
};
exports.default = cAlunoDataAtividade;
