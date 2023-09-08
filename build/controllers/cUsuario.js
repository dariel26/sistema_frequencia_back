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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cipher_1 = require("../cipher/cipher");
const DBUsuario_1 = __importDefault(require("../db/DBUsuario"));
const userErrors_1 = require("./userErrors");
const habilidades_1 = require("../middleware/habilidades");
const middlewareJwt_1 = require("../middleware/middlewareJwt");
const messagesDev_1 = __importDefault(require("./messagesDev"));
const cCoordenador_1 = require("./cCoordenador");
const camposUsuario = ["papel_atual", "senha"];
const cUsuario = {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { login, senha } = req.body;
            try {
                const usuario = yield DBUsuario_1.default.buscaPorLogin(login);
                if (usuario === undefined) {
                    return res.status(401).json({ message: "Login Incorreto" });
                }
                else {
                    const hashSenha = usuario.senha;
                    if (hashSenha === undefined)
                        res
                            .status(500)
                            .json({ message: "O usuário não possui senha no banco de dados" });
                    else {
                        if (yield (0, cipher_1.compare)(senha, hashSenha)) {
                            const token = criaToken(usuario);
                            res.status(200).json(token);
                        }
                        else {
                            return res.status(401).json({ message: "Senha Incorreta" });
                        }
                    }
                }
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.headers;
            if (token === undefined)
                return res.status(400).json({ message: "Token vazio" });
            if (Array.isArray(token))
                return res.status(400).json({ message: "Token inválido" });
            try {
                DBUsuario_1.default.invalidarToken(token);
                res.status(200).json();
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    retornaInfoUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requisicao = req;
                const infoToken = requisicao.infoToken;
                const habilidades = (0, habilidades_1.defineHabilidadesPara)(infoToken);
                const infoUsuario = Object.assign(Object.assign({}, infoToken), { regrasHabilidades: habilidades.rules });
                return res.status(200).json(infoUsuario);
            }
            catch (err) {
                res.status(500).json();
            }
        });
    },
    usuarioSenhaPadrao(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const requisicao = req;
            const login = requisicao.infoToken.login;
            try {
                const usuario = yield DBUsuario_1.default.buscaPorLogin(login);
                if (usuario === undefined) {
                    res.status(404).json({ message: "Usuario não existe!" });
                }
                else {
                    const hashSenha = usuario.senha;
                    if (hashSenha === undefined)
                        res
                            .status(500)
                            .json({ message: "O usuário não possui senha no banco de dados" });
                    else {
                        if (yield (0, cipher_1.compare)(login, hashSenha))
                            res.status(200).json({ padrao: true });
                        else {
                            res.status(200).json({ padrao: false });
                        }
                    }
                }
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
                return res.status(400).json({ message: "O id do usuário está faltando" });
            const message = messagesDev_1.default.verificaEdicao(novosDados, camposUsuario);
            if (message)
                return res.status(400).json({ message });
            try {
                if (novosDados.papeis)
                    if (!novosDados.papeis.includes("ADMIN")) {
                        const admins = yield (0, cCoordenador_1.coordenadoresADMINS)();
                        if (admins.length === 1 &&
                            admins[0].id_usuario === novosDados.id_usuario)
                            return (0, userErrors_1.userError)(new Error("NO ADMINS"), res);
                    }
                yield DBUsuario_1.default.editar(novosDados);
                const usuario = yield DBUsuario_1.default.buscarPorId(novosDados.id_usuario);
                const token = criaToken(usuario);
                res.status(200).json(token);
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
};
exports.default = cUsuario;
function criaToken(usuario) {
    const infoUsuario = {
        nome: usuario.nome,
        papel_atual: usuario.papel_atual,
        papeis: usuario.papeis,
        login: usuario.login,
        id_usuario: usuario.id_usuario,
        tipo: usuario.tipo,
    };
    const token = jsonwebtoken_1.default.sign(infoUsuario, middlewareJwt_1.tokenSecret, {
        expiresIn: "24h",
    });
    return token;
}
