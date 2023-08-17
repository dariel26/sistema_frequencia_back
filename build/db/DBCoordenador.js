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
const cipher_1 = require("../cipher/cipher");
const papeis_1 = require("../papeis");
const db_1 = __importDefault(require("./db"));
const DBCoordenador = {
    criar: (coordenadores) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "INSERT INTO Coordenador (nome, senha, estado, papel, email) VALUES ?";
        const params = [];
        for (let { nome, email, senha } of coordenadores) {
            const senhaHash = yield (0, cipher_1.cipher)(senha);
            params.push([nome, senhaHash, true, papeis_1.PAPEL_COORDENADOR, email]);
        }
        const res = yield db_1.default.query(sql, [params]);
        return res;
    }),
    deletar: (ids) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM Coordenador WHERE id_coordenador IN (?)";
        const res = yield db_1.default.query(sql, [ids]);
        return res;
    }),
    editar: (novosDados) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "UPDATE Coordenador SET ";
        let campos_disponiveis = ["nome", "senha", "email", "papel"];
        const campos_nulos = [];
        novosDados.forEach((c) => {
            if (c.nome === undefined)
                campos_nulos.push("nome");
            if (c.senha === undefined)
                campos_nulos.push("senha");
            if (c.email === undefined)
                campos_nulos.push("email");
            if (c.papel === undefined)
                campos_nulos.push("papel");
        });
        campos_disponiveis = campos_disponiveis.filter((campo) => !campos_nulos.includes(campo));
        for (let i = 0; i < campos_disponiveis.length; i++) {
            const c = campos_disponiveis[i];
            const ultimoI = i === campos_disponiveis.length - 1;
            if (ultimoI) {
                sql += `${c}= CASE `;
                for (let j = 0; j < novosDados.length; j++) {
                    const ultimoJ = j === novosDados.length - 1;
                    if (ultimoJ) {
                        sql += "WHEN id_coordenador = ? THEN ? END ";
                    }
                    else {
                        sql += "WHEN id_coordenador = ? THEN ? ";
                    }
                }
            }
            else {
                sql += `${c}= CASE `;
                for (let j = 0; j < novosDados.length; j++) {
                    const ultimoJ = j === novosDados.length - 1;
                    if (ultimoJ) {
                        sql += "WHEN id_coordenador = ? THEN ? END, ";
                    }
                    else {
                        sql += "WHEN id_coordenador = ? THEN ? ";
                    }
                }
            }
        }
        const ids = novosDados.map(({ id_coordenador }) => id_coordenador);
        sql += ` WHERE id_coordenador IN (${ids.map((item) => item).join(", ")})`;
        let values = [];
        for (let dado of novosDados) {
            if (dado.senha !== undefined) {
                dado.senha = yield (0, cipher_1.cipher)(dado.senha);
            }
            const array = Object.values(dado);
            const id_coordenador = array.shift();
            values.push(array.flatMap((valor) => [id_coordenador, valor]));
        }
        values = values.flat();
        const res = yield db_1.default.query(sql, values);
        return res;
    }),
    listar: () => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "SELECT id_coordenador, nome, email, papel, estado FROM Coordenador ORDER BY nome ASC";
        const [linhas] = yield db_1.default.query(sql);
        return linhas;
    }),
};
exports.default = DBCoordenador;
