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
const DBPresenca_1 = __importDefault(require("../db/DBPresenca"));
const errors_1 = require("../errors");
const cPresenca = {
    criarVarias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { presenca } = req.body;
            try {
                console.log(presenca);
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
    deletarVarias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = req.params.ids.split(",");
            try {
                yield DBPresenca_1.default.deletar(ids);
                res.status(200).json({ message: "Presencas deletadas!" });
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
    listar(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const alunos = yield DBPresenca_1.default.listar();
                res.status(200).json(alunos);
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
    editarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { novosDados } = req.body;
            try {
                yield DBPresenca_1.default.editar(novosDados);
                const alunosAtualizados = yield DBPresenca_1.default.listar();
                res.status(200).json(alunosAtualizados);
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
};
exports.default = cPresenca;
