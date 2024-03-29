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
const DBDataAtividade = {
    buscar: (id_atividade) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "SELECT * FROM DataAtividade WHERE id_atividade = ?";
        const [datasAtividade] = yield db_1.default.query(sql, [id_atividade]);
        return datasAtividade;
    }),
    buscarPartindoDe: (id_atividade, dataAmanha) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "SELECT * FROM DataAtividade WHERE id_atividade = ? AND data >= ?";
        const [datasAtividade] = yield db_1.default.query(sql, [id_atividade, dataAmanha]);
        return datasAtividade;
    }),
    criar: (dados) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "INSERT INTO DataAtividade (id_atividade, data, excluida) VALUES ?";
        const novosDados = dados.map(({ id_atividade, data }) => [
            id_atividade,
            data,
            0,
        ]);
        const res = yield db_1.default.query(sql, [novosDados]);
        return res;
    }),
    editar: (novosDados) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "UPDATE DataAtividade SET ";
        let campos_disponiveis = ["excluida"];
        const campos_nulos = [];
        novosDados.forEach((c) => {
            if (c.excluida === undefined)
                campos_nulos.push("excluida");
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
                        sql += "WHEN id_dataatividade = ? THEN ? END ";
                    }
                    else {
                        sql += "WHEN id_dataatividade = ? THEN ? ";
                    }
                }
            }
            else {
                sql += `${c}= CASE `;
                for (let j = 0; j < novosDados.length; j++) {
                    const ultimoJ = j === novosDados.length - 1;
                    if (ultimoJ) {
                        sql += "WHEN id_dataatividade = ? THEN ? END, ";
                    }
                    else {
                        sql += "WHEN id_dataatividade = ? THEN ? ";
                    }
                }
            }
        }
        const ids = novosDados.map(({ id_dataatividade }) => id_dataatividade);
        sql += ` WHERE id_dataatividade IN (${ids.map((item) => item).join(", ")})`;
        let values = [];
        for (let dado of novosDados) {
            const array = Object.values(dado);
            const id_dataatividade = array.shift();
            values.push(array.flatMap((valor) => [id_dataatividade, valor]));
        }
        values = values.flat();
        const res = yield db_1.default.query(sql, values);
        return res;
    }),
    deletarPreservandoHistorico: (ids, dataAmanha) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM DataAtividade WHERE id_atividade IN (?) AND data >= ?";
        const res = yield db_1.default.query(sql, [ids, dataAmanha]);
        return res;
    }),
    deletarPorId: (ids) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM DataAtividade WHERE id_dataatividade IN (?)";
        const res = yield db_1.default.query(sql, [ids]);
        return res;
    }),
    deletar: (ids) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM DataAtividade WHERE id_atividade IN (?)";
        const res = yield db_1.default.query(sql, [ids]);
        return res;
    }),
};
exports.default = DBDataAtividade;
