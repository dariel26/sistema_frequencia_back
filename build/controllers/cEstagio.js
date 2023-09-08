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
const DBEstagio_1 = __importDefault(require("../db/DBEstagio"));
const userErrors_1 = require("./userErrors");
const messagesDev_1 = __importDefault(require("./messagesDev"));
const camposEstagios = ["nome"];
const cEstagio = {
    criarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { estagios } = req.body;
            const message = messagesDev_1.default.verificaNovos(estagios, camposEstagios);
            if (message)
                return res.status(400).json({ message });
            try {
                yield DBEstagio_1.default.criar(estagios);
                const novosEstagios = yield DBEstagio_1.default.listar();
                res.status(200).json(novosEstagios);
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    listar(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const estagios = yield DBEstagio_1.default.listar();
                res.status(200).json(estagios);
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    deletarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = req.params.ids.split(",");
            try {
                yield DBEstagio_1.default.deletar(ids);
                res.status(200).json();
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    editar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { novosDados } = req.body;
            const message = messagesDev_1.default.verificaEdicao(novosDados, camposEstagios);
            if (message)
                return res.status(400).json({ message });
            try {
                yield DBEstagio_1.default.editar(novosDados);
                res.status(200).json();
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
};
exports.default = cEstagio;
