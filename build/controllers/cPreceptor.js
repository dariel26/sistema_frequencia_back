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
const DBUsuario_1 = __importDefault(require("../db/DBUsuario"));
const userErrors_1 = require("./userErrors");
const messagesDev_1 = __importDefault(require("./messagesDev"));
const camposPreceptores = ["nome", "login", "senha"];
const papeis = ["PRECEPTOR(A)"];
const tipo = "PRECEPTOR";
const cPreceptor = {
    criarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { preceptores } = req.body;
            const message = messagesDev_1.default.verificaNovos(preceptores, camposPreceptores);
            if (message)
                return res.status(400).json({ message });
            try {
                const dados = preceptores.map(({ nome, login, senha, }) => ({
                    nome,
                    login,
                    senha,
                    papeis: JSON.stringify(papeis),
                    papel_atual: papeis[0],
                    tipo,
                }));
                yield DBUsuario_1.default.criar(dados);
                const novosPreceptores = yield DBUsuario_1.default.buscarPorTipo(tipo);
                res.status(200).json(novosPreceptores);
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
                yield DBUsuario_1.default.deletar(ids);
                res.status(200).json();
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    listar(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const preceptores = yield DBUsuario_1.default.buscarPorTipo(tipo);
                res.status(200).json(preceptores);
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    editar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { novosDados } = req.body;
            if (!(novosDados === null || novosDados === void 0 ? void 0 : novosDados.id_usuario))
                return res.status(400).json("O id do usuário deve ser passado");
            const message = messagesDev_1.default.verificaEdicao(novosDados, camposPreceptores);
            if (message)
                return res.status(400).json({ message });
            try {
                yield DBUsuario_1.default.editar(novosDados);
                res.status(200).json();
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
};
exports.default = cPreceptor;
