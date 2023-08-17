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
const DBAluno = {
    criar: (alunos) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "INSERT INTO Aluno (nome, senha, estado, papel, matricula) VALUES ?";
        const params = [];
        for (let { nome, matricula, senha } of alunos) {
            const senhaHash = yield (0, cipher_1.cipher)(senha);
            params.push([nome, senhaHash, true, papeis_1.PAPEL_ALUNO, matricula]);
        }
        const res = yield db_1.default.query(sql, [params]);
        return res;
    }),
    deletar: (ids) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM Aluno WHERE id_aluno IN (?)";
        const res = yield db_1.default.query(sql, [ids]);
        return res;
    }),
    editar: (novosDados) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "UPDATE Aluno SET ";
        let campos_disponiveis = ["nome", "senha", "matricula", "id_grupo"];
        const campos_nulos = [];
        novosDados.forEach((c) => {
            if (c.nome === undefined)
                campos_nulos.push("nome");
            if (c.senha === undefined)
                campos_nulos.push("senha");
            if (c.matricula === undefined)
                campos_nulos.push("matricula");
            if (c.id_grupo === undefined)
                campos_nulos.push("id_grupo");
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
                        sql += "WHEN id_aluno = ? THEN ? END ";
                    }
                    else {
                        sql += "WHEN id_aluno = ? THEN ? ";
                    }
                }
            }
            else {
                sql += `${c}= CASE `;
                for (let j = 0; j < novosDados.length; j++) {
                    const ultimoJ = j === novosDados.length - 1;
                    if (ultimoJ) {
                        sql += "WHEN id_aluno = ? THEN ? END, ";
                    }
                    else {
                        sql += "WHEN id_aluno = ? THEN ? ";
                    }
                }
            }
        }
        const ids = novosDados.map(({ id_aluno }) => id_aluno);
        sql += ` WHERE id_aluno IN (${ids.map((item) => item).join(", ")})`;
        let values = [];
        for (let dado of novosDados) {
            if (dado.senha !== undefined) {
                dado.senha = yield (0, cipher_1.cipher)(dado.senha);
            }
            const array = Object.values(dado);
            const id_aluno = array.shift();
            values.push(array.flatMap((valor) => [id_aluno, valor]));
        }
        values = values.flat();
        const res = yield db_1.default.query(sql, values);
        return res;
    }),
    listar: () => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "SELECT * FROM view_aluno ORDER BY nome ASC";
        const [linhas] = yield db_1.default.query(sql);
        return linhas;
    }),
};
exports.default = DBAluno;
