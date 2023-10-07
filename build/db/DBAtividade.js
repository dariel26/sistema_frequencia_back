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
const DBAtividade = {
    criar: (atividades) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "INSERT INTO Atividade (nome, id_estagio, hora_inicial, hora_final, periodo) VALUES ?";
        const novasAtividades = atividades.map(({ nome, id_estagio, hora_inicial, hora_final, periodo }) => [
            nome,
            id_estagio,
            hora_inicial,
            hora_final,
            periodo,
        ]);
        const res = yield db_1.default.query(sql, [novasAtividades]);
        return res;
    }),
    listar: () => __awaiter(void 0, void 0, void 0, function* () {
        const sql = `SELECT * FROM view_atividade`;
        const [linhas] = yield db_1.default.query(sql);
        return linhas;
    }),
    editar: (dados) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "UPDATE Atividade SET";
        const valores = [];
        if (dados.id_estagio) {
            sql += " id_estagio=?,";
            valores.push(dados.id_estagio);
        }
        if (dados.nome) {
            sql += " nome=?,";
            valores.push(dados.nome);
        }
        if (dados.hora_inicial) {
            sql += " hora_inicial=?,";
            valores.push(dados.hora_inicial);
        }
        if (dados.hora_final) {
            sql += " hora_final=?,";
            valores.push(dados.hora_final);
        }
        if (dados.periodo) {
            sql += " periodo=?,";
            valores.push(dados.periodo);
        }
        sql = sql.slice(0, -1);
        sql += ` WHERE id_atividade=?`;
        valores.push(dados.id_atividade);
        yield db_1.default.query(sql, valores);
    }),
    deletar: (ids) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM Atividade WHERE id_atividade IN (?)";
        return yield db_1.default.query(sql, [ids]);
    }),
};
exports.default = DBAtividade;
