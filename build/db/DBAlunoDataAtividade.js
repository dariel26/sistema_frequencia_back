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
const DBAlunoDataAtividade = {
    buscar: (id_usuario) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "SELECT * FROM view_presenca WHERE id_usuario IN (?)";
        const [presencas] = yield db_1.default.query(sql, [id_usuario]);
        return presencas;
    }),
    buscarPorData: (datas) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "SELECT * FROM view_presenca WHERE data >= ? AND data <= ? ";
        const [presencas] = yield db_1.default.query(sql, [
            datas.data_inicial,
            datas.data_final,
        ]);
        return presencas;
    }),
    buscarPorId: (id_alunodataatividade) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "SELECT * FROM view_presenca WHERE id_alunodataatividade IN (?)";
        const [presencas] = yield db_1.default.query(sql, [id_alunodataatividade]);
        return presencas;
    }),
    criar: (dados) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "INSERT INTO AlunoDataAtividade (id_usuario, id_atividade, estado, data, periodo, id_dataatividade) VALUES ?";
        const novosDados = dados.map(({ id_usuario, id_atividade, data, estado, periodo, id_dataatividade, }) => [id_usuario, id_atividade, estado, data, periodo, id_dataatividade]);
        const res = yield db_1.default.query(sql, [novosDados]);
        return res;
    }),
    deletarPartindoDe: (id, dataAmanha) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM AlunoDataAtividade WHERE id_atividade IN (?) AND data >= ?";
        const res = yield db_1.default.query(sql, [id, dataAmanha]);
        return res;
    }),
    deletar: (dados) => __awaiter(void 0, void 0, void 0, function* () {
        const ids = dados.map(({ id_atividade }) => id_atividade);
        const datas = dados.map(({ data }) => data);
        const sql = "DELETE FROM AlunoDataAtividade WHERE id_atividade IN (?) AND data IN (?)";
        const res = yield db_1.default.query(sql, [ids, datas]);
        return res;
    }),
    limpar: (id_atividade) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM AlunoDataAtividade WHERE id_atividade IN (?)";
        const res = yield db_1.default.query(sql, [id_atividade]);
        return res;
    }),
    editar: (novosDados) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "UPDATE AlunoDataAtividade SET";
        const valores = [];
        if (novosDados.estado) {
            sql += " estado=?,";
            valores.push(novosDados.estado);
        }
        sql = sql.slice(0, -1);
        sql += ` WHERE id_alunodataatividade=?`;
        valores.push(novosDados.id_alunodataatividade);
        yield db_1.default.query(sql, valores);
    }),
};
exports.default = DBAlunoDataAtividade;
