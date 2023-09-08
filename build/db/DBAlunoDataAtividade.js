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
    buscarPorId: (id_alunodataatividade) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "SELECT * FROM view_presenca WHERE id_alunodataatividade IN (?)";
        const [presencas] = yield db_1.default.query(sql, [id_alunodataatividade]);
        return presencas;
    }),
    criar: (dados) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "INSERT INTO AlunoDataAtividade (id_usuario, id_atividade, estado, data) VALUES ?";
        const novosDados = dados.map(({ id_usuario, id_atividade, data, estado }) => [
            id_usuario,
            id_atividade,
            estado,
            data,
        ]);
        const res = yield db_1.default.query(sql, [novosDados]);
        return res;
    }),
    deletarPartindoDe: (id, dataAmanha) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM AlunoDataAtividade WHERE id_atividade IN (?) AND data >= ?";
        const res = yield db_1.default.query(sql, [id, dataAmanha]);
        return res;
    }),
    deletar: (ids) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM AlunoDataAtividade WHERE id_atividade IN (?)";
        const res = yield db_1.default.query(sql, [ids]);
        return res;
    }),
    editar: (novosDados) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "UPDATE AlunoDataAtividade SET ";
        let campos_disponiveis = ["estado"];
        const campos_nulos = [];
        novosDados.forEach((g) => {
            if (g.estado === undefined)
                campos_nulos.push("estado");
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
                        sql += "WHEN id_alunodataatividade = ? THEN ? END ";
                    }
                    else {
                        sql += "WHEN id_alunodataatividade = ? THEN ? ";
                    }
                }
            }
            else {
                sql += `${c}= CASE `;
                for (let j = 0; j < novosDados.length; j++) {
                    const ultimoJ = j === novosDados.length - 1;
                    if (ultimoJ) {
                        sql += "WHEN id_alunodataatividade = ? THEN ? END, ";
                    }
                    else {
                        sql += "WHEN id_alunodataatividade = ? THEN ? ";
                    }
                }
            }
        }
        const ids = novosDados.map(({ id_alunodataatividade }) => id_alunodataatividade);
        sql += ` WHERE id_alunodataatividade IN (${ids
            .map((item) => item)
            .join(", ")})`;
        let values = [];
        for (let dado of novosDados) {
            //TODO a ordem dos valores do objeto influenciam e podem dar valores errados
            const array = Object.values(dado);
            const id_alunodataatividade = array.shift();
            values.push(array.flatMap((valor) => [id_alunodataatividade, valor]));
        }
        values = values.flat();
        const res = yield db_1.default.query(sql, values);
        return res;
    }),
};
exports.default = DBAlunoDataAtividade;
