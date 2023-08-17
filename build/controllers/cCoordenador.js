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
const DBCoordenador_1 = __importDefault(require("../db/DBCoordenador"));
const errors_1 = require("../errors");
const papeis_1 = require("../papeis");
const cCoordenador = {
    criarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { coordenadores } = req.body;
            try {
                yield DBCoordenador_1.default.criar(coordenadores);
                const novosCoordenadores = yield DBCoordenador_1.default.listar();
                res.status(201).json(novosCoordenadores);
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
    deletarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = req.params.ids.split(",");
            try {
                const coordenadores = yield DBCoordenador_1.default.listar();
                const admins = coordenadores.filter((c) => c.papel === papeis_1.PAPEL_ADMIN);
                const adminsDeletados = admins.filter((a) => ids.includes(String(a.id_coordenador)));
                if (adminsDeletados.length === admins.length) {
                    return res
                        .status(500)
                        .json({ message: "O sistema não pode ficar sem ADMINS" });
                }
                yield DBCoordenador_1.default.deletar(ids);
                res.status(200).json({ message: "Coordenadores deletados!" });
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
                const coordenadores = yield DBCoordenador_1.default.listar();
                const admins = coordenadores.filter((c) => c.papel === papeis_1.PAPEL_ADMIN);
                const novosAdmins = novosDados.filter((c) => c.papel === papeis_1.PAPEL_ADMIN);
                if (novosAdmins.length === 0) {
                    for (let dado of novosDados) {
                        const id = dado.id_coordenador;
                        const coordenador = coordenadores.find((c) => c.id_coordenador === id);
                        if (coordenador.papel === papeis_1.PAPEL_ADMIN && admins.length === 1) {
                            return res
                                .status(500)
                                .json({ message: "O sistema não pode ficar sem ADMINS" });
                        }
                    }
                }
                yield DBCoordenador_1.default.editar(novosDados);
                res.status(200).json({ message: "Coordenadores editados!" });
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
    listar(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coodenadores = yield DBCoordenador_1.default.listar();
                res.status(200).json(coodenadores);
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
};
exports.default = cCoordenador;
