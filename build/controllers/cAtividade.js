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
const messagesDev_1 = __importDefault(require("./messagesDev"));
const DBAtividade_1 = __importDefault(require("../db/DBAtividade"));
const userErrors_1 = require("./userErrors");
const utilidades_1 = __importDefault(require("./utilidades"));
const camposAtividades = ["nome"];
const camposAtividadesEdicao = [
    "id_atividade",
    "id_estagio",
    "nome",
    "hora_inicial",
    "hora_final",
    "periodo",
];
const cAtividade = {
    criarVarios: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { atividades } = req.body;
        const message = messagesDev_1.default.verificaNovos(atividades, camposAtividades);
        if (message)
            return res.status(400).json({ message });
        try {
            yield DBAtividade_1.default.criar(atividades);
            let novasAtividades = yield DBAtividade_1.default.listar();
            res.status(200).json(novasAtividades);
        }
        catch (err) {
            (0, userErrors_1.userError)(err, res);
        }
    }),
    listar(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const atividades = yield DBAtividade_1.default.listar();
                res.status(200).json(atividades);
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    editar: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { novosDados } = req.body;
        const message = messagesDev_1.default.verificaEdicao(novosDados, camposAtividadesEdicao);
        if (message)
            return res.status(400).json({ message });
        try {
            if (novosDados.hora_final || novosDados.hora_inicial) {
                const atividades = yield DBAtividade_1.default.listar();
                const atividade = atividades.find((a) => a.id_atividade === novosDados.id_atividade);
                const atividadeAtualizada = Object.assign(Object.assign({}, atividade), novosDados);
                const periodo = utilidades_1.default.obterPeriodoDoDia(atividadeAtualizada === null || atividadeAtualizada === void 0 ? void 0 : atividadeAtualizada.hora_inicial, atividadeAtualizada === null || atividadeAtualizada === void 0 ? void 0 : atividadeAtualizada.hora_final);
                novosDados = Object.assign(Object.assign({}, novosDados), { periodo });
            }
            yield DBAtividade_1.default.editar(novosDados);
            res.status(200).json(novosDados);
        }
        catch (err) {
            (0, userErrors_1.userError)(err, res);
        }
    }),
    deletarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = req.params.ids.split(",");
            try {
                yield DBAtividade_1.default.deletar(ids);
                res.status(200).json();
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
};
exports.default = cAtividade;
