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
exports.coordenadoresADMINS = void 0;
const DBUsuario_1 = __importDefault(require("../db/DBUsuario"));
const userErrors_1 = require("./userErrors");
const messagesDev_1 = __importDefault(require("./messagesDev"));
const camposCoordenador = ["nome", "login", "senha"];
const camposCoordenadorEdicao = ["nome", "login", "senha", "papeis"];
const papeis = ["COORDENADOR(A)"];
const tipo = "COORDENADOR";
const cCoordenador = {
    criarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { coordenadores } = req.body;
            const message = messagesDev_1.default.verificaNovos(coordenadores, camposCoordenador);
            if (message)
                return res.status(400).json({ message });
            try {
                const dados = coordenadores.map(({ nome, login, senha, }) => ({
                    nome,
                    login,
                    senha,
                    papeis: JSON.stringify(papeis),
                    papel_atual: papeis[0],
                    tipo,
                }));
                yield DBUsuario_1.default.criar(dados);
                const novosCoordenadores = yield DBUsuario_1.default.buscarPorTipo(tipo);
                res.status(200).json(novosCoordenadores);
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
                const admins = yield coordenadoresADMINS();
                if (admins.length === 1 && ids.includes(admins[0].id_usuario.toString()))
                    return (0, userErrors_1.userError)(new Error("NO ADMINS"), res);
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
                const coordenadores = yield DBUsuario_1.default.buscarPorTipo(tipo);
                res.status(200).json(coordenadores);
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    editar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { novosDados } = req.body;
            if (typeof (novosDados === null || novosDados === void 0 ? void 0 : novosDados.id_usuario) !== "number")
                return res
                    .status(400)
                    .json({ message: "O id do usuário não está sendo enviado" });
            const message = messagesDev_1.default.verificaEdicao(novosDados, camposCoordenadorEdicao);
            if (message)
                return res.status(400).json({ message });
            try {
                if (novosDados.papeis)
                    if (!novosDados.papeis.includes("ADMIN")) {
                        const admins = yield coordenadoresADMINS();
                        if (admins.length === 1 &&
                            admins[0].id_usuario === novosDados.id_usuario)
                            return (0, userErrors_1.userError)(new Error("NO ADMINS"), res);
                    }
                yield DBUsuario_1.default.editar(novosDados);
                res.status(200).json();
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
};
exports.default = cCoordenador;
function coordenadoresADMINS() {
    return __awaiter(this, void 0, void 0, function* () {
        let coordenadores = yield DBUsuario_1.default.listar();
        coordenadores = coordenadores.filter(({ tipo }) => tipo === "COORDENADOR");
        const admins = coordenadores.filter(({ papeis }) => papeis.includes("ADMIN"));
        return admins;
    });
}
exports.coordenadoresADMINS = coordenadoresADMINS;
