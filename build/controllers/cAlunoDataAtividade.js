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
const DBAlunoDataAtividade_1 = __importDefault(require("../db/DBAlunoDataAtividade"));
const userErrors_1 = require("./userErrors");
const utilidades_1 = __importDefault(require("./utilidades"));
const messagesDev_1 = __importDefault(require("./messagesDev"));
const cAlunoDataAtividade = {
    buscarPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO nao precisar passar o id
            const { id } = req.params;
            try {
                const dataAtual = utilidades_1.default.dataArarangua();
                const presencas = yield DBAlunoDataAtividade_1.default.buscar(id);
                res.status(200).json({ presencas, dataAtual });
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    buscarPorDatas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { datas } = req.query;
            if (!Array.isArray(datas))
                return res.status(400).json({ message: "As datas devem vim em array" });
            const [data_inicial, data_final] = datas;
            if (typeof data_inicial !== "string" || typeof data_final !== "string")
                return res.status(400).json({
                    message: "Os objetos data_inicial ou final estão em formatos errados",
                });
            try {
                const dataAtual = utilidades_1.default.dataArarangua();
                const presencas = yield DBAlunoDataAtividade_1.default.buscarPorData({
                    data_inicial,
                    data_final,
                });
                res.status(200).json({ presencas, dataAtual });
            }
            catch (err) {
                console.log(err);
                (0, userErrors_1.userError)(err, res);
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
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    editarPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { novosDados } = req.body;
            const message = messagesDev_1.default.verificaEdicao(novosDados, [
                "id_alunodataatividade",
                "estado",
            ]);
            if (message)
                return res.status(400).json({ message });
            try {
                yield DBAlunoDataAtividade_1.default.editar(novosDados);
                res.status(200).json();
            }
            catch (err) {
                console.log(err);
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    marcarPresenca(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { novosDados } = req.body;
            try {
                const presenca = yield DBAlunoDataAtividade_1.default.buscarPorId(novosDados.id_alunodataatividade);
                const dataAtual = utilidades_1.default.dataArarangua();
                const dataAtividade = utilidades_1.default.horarioEmData(presenca[0].data, presenca[0].hora_inicial);
                const coordenadaDoLocal = presenca[0].coordenadas;
                const coordenadaDoUsuario = novosDados.coordenadas;
                const raio = utilidades_1.default.distancia(coordenadaDoUsuario, coordenadaDoLocal);
                const diferencaEmHoras = utilidades_1.default.diferencaAbsEmHoras(dataAtual, dataAtividade);
                if (raio > 180)
                    return res.status(400).json({
                        message: `Fora do raio de distância permitido ${raio}`,
                    });
                if (diferencaEmHoras > 0.3)
                    return res.status(400).json({
                        message: "Muito cedo, tente novamente mais tarde.",
                    });
                if (diferencaEmHoras < -2)
                    return res.status(400).json({
                        message: "Fora do tempo limite para marcar presença",
                    });
                yield DBAlunoDataAtividade_1.default.editar({
                    id_alunodataatividade: novosDados.id_alunodataatividade,
                    estado: "PRESENTE",
                });
                res.status(200).json();
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
};
exports.default = cAlunoDataAtividade;
