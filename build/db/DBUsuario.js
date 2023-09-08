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
const db_1 = __importDefault(require("./db"));
const cipher_1 = require("../cipher/cipher");
const DBUsuario = {
    buscaPorLogin: (login) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "SELECT id_usuario, nome, login, senha, papel_atual, papeis, tipo FROM Usuario WHERE login=?";
        const [usuarios] = yield db_1.default.query(sql, [login]);
        return usuarios[0];
    }),
    buscarPorId: (id_usuario) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "SELECT id_usuario, nome, login, papel_atual, papeis, tipo FROM Usuario WHERE id_usuario=?";
        const [usuarios] = yield db_1.default.query(sql, [id_usuario]);
        return usuarios[0];
    }),
    invalidarToken: (token) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "INSERT INTO jwt (token, validade) VALUES(?, NOW() + INTERVAL 24 HOUR)";
        yield db_1.default.query(sql, token);
    }),
    criar: (usuarios) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "INSERT INTO Usuario (nome, login, senha, papel_atual, papeis, tipo) VALUES ?";
        const valores = [];
        for (let { nome, login, senha, papel_atual, papeis, tipo } of usuarios) {
            valores.push([
                nome,
                login,
                yield (0, cipher_1.cipher)(senha),
                papel_atual,
                papeis,
                tipo,
            ]);
        }
        yield db_1.default.query(sql, [valores]);
    }),
    listar: () => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "SELECT id_usuario, nome, login, papel_atual, papeis, tipo FROM Usuario";
        const [usuarios] = yield db_1.default.query(sql);
        return usuarios;
    }),
    listarAlunos: () => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "SELECT * FROM view_aluno";
        const [usuarios] = yield db_1.default.query(sql);
        return usuarios;
    }),
    buscarAluno: (id_usuario) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "SELECT * FROM view_aluno WHERE id_usuario=?";
        const [usuarios] = yield db_1.default.query(sql, id_usuario);
        return usuarios[0];
    }),
    buscarPorTipo: (tipo) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "SELECT id_usuario, nome, login, papel_atual, papeis, tipo FROM Usuario WHERE tipo=?";
        const [usuarios] = yield db_1.default.query(sql, [tipo]);
        return usuarios;
    }),
    deletar: (ids) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM Usuario WHERE id_usuario IN (?)";
        yield db_1.default.query(sql, [ids]);
    }),
    editar: (dados) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "UPDATE Usuario SET";
        const valores = [];
        if (dados.nome) {
            sql += " nome=?,";
            valores.push(dados.nome);
        }
        if (dados.login) {
            sql += " login=?,";
            valores.push(dados.login);
        }
        if (dados.senha) {
            sql += " senha=?,";
            valores.push(yield (0, cipher_1.cipher)(dados.senha));
        }
        if (dados.papel_atual) {
            sql += " papel_atual=?,";
            valores.push(dados.papel_atual);
        }
        if (dados.papeis) {
            sql += " papeis=?,";
            valores.push(JSON.stringify(dados.papeis));
        }
        sql = sql.slice(0, -1);
        sql += ` WHERE id_usuario=?`;
        valores.push(dados.id_usuario);
        yield db_1.default.query(sql, valores);
    }),
};
exports.default = DBUsuario;
