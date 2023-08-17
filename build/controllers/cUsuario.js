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
const DBAluno_1 = __importDefault(require("../db/DBAluno"));
const DBCoordenador_1 = __importDefault(require("../db/DBCoordenador"));
const DBPreceptor_1 = __importDefault(require("../db/DBPreceptor"));
const DBUsuario_1 = __importDefault(require("../db/DBUsuario"));
const errors_1 = require("../errors");
const habilidades_1 = require("../middleware/habilidades");
const middlewareJwt_1 = require("../middleware/middlewareJwt");
const papeis_1 = require("../papeis");
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
                            const infoUsuario = {
                                nome: usuario.nome,
                                papel: usuario.papel,
                                login: usuario.login,
                                id: usuario.id,
                            };
                            const token = jsonwebtoken_1.default.sign(infoUsuario, middlewareJwt_1.tokenSecret, {
                                expiresIn: "24h",
                            });
                            res.status(200).json(token);
                        }
                        else {
                            return res.status(401).json({ message: "Senha Incorreta" });
                        }
                    }
                }
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.headers;
            try {
                if (token === undefined)
                    return res.status(400).json({ message: "Token vazio" });
                if (Array.isArray(token))
                    return res.status(400).json({ message: "Token inválido" });
                DBUsuario_1.default.invalidarToken(token);
                res.status(200).json();
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
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
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
    mudarSenha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { novosDados } = req.body;
            const requisicao = req;
            const infoToken = requisicao.infoToken;
            try {
                if (infoToken.papel === papeis_1.PAPEL_COORDENADOR ||
                    infoToken.papel === papeis_1.PAPEL_ADMIN) {
                    yield DBCoordenador_1.default.editar(novosDados.map(({ id, senha }) => ({
                        id_coordenador: id,
                        senha,
                    })));
                }
                else if (infoToken.papel === papeis_1.PAPEL_PRECEPTOR) {
                    yield DBPreceptor_1.default.editar(novosDados.map(({ id, senha }) => ({
                        id_preceptor: id,
                        senha,
                    })));
                }
                else {
                    yield DBAluno_1.default.editar(novosDados.map(({ id, senha }) => ({
                        id_aluno: id,
                        senha,
                    })));
                }
                res.status(200).json();
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
};
exports.default = cUsuario;
