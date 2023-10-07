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
const DBDataAtividade_1 = __importDefault(require("../db/DBDataAtividade"));
const userErrors_1 = require("./userErrors");
const utilidades_1 = __importDefault(require("./utilidades"));
const cDataAtividade = {
    criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { datas, id_atividade } = req.body;
            try {
                datas = datas.map((data) => ({
                    id_atividade,
                    data: utilidades_1.default.dataFrontEmDataBD(data),
                }));
                yield DBDataAtividade_1.default.criar(datas);
                res.status(201).json();
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    criarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { datas, id_atividade } = req.body;
            try {
                datas = datas.map((data) => ({
                    id_atividade,
                    data: new Date(data).toISOString().slice(0, 10).replace("T", " "),
                }));
                yield DBDataAtividade_1.default.deletar([id_atividade]);
                if (datas.length < 1)
                    return res.status(201).json();
                yield DBDataAtividade_1.default.criar(datas);
                res.status(201).json();
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    editarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { novosDados } = req.body;
            try {
                yield DBDataAtividade_1.default.editar(novosDados);
                res.status(200).json({ message: "Datas de atividades editadas!" });
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    deletar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = req.params.ids.split(",");
            try {
                yield DBDataAtividade_1.default.deletarPorId(ids);
                res.status(200).json({ message: "Datas de atividades deletadas!" });
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
};
exports.default = cDataAtividade;
