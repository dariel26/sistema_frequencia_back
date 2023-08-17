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
const DBPresenca = {
    criar: (presencas) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "INSERT INTO Presenca (id_aluno, id_dataatividade, id_atividade, hora_marcada, id_local, data, estado, coordenadas) VALUES ?";
        const novasPresencas = presencas.map(({ id_aluno, id_dataatividade, id_atividade, hora_marcada, id_local, data, coordenadas }) => [
            id_aluno,
            id_dataatividade,
            id_atividade,
            hora_marcada,
            id_local,
            data,
            "TOTAL",
            coordenadas
        ]);
        const res = yield db_1.default.query(sql, [novasPresencas]);
        return res;
    }),
    listar: () => __awaiter(void 0, void 0, void 0, function* () {
        const sql = `SELECT * FROM Presenca`;
        const [linhas] = yield db_1.default.query(sql);
        return linhas;
    }),
    editar: (novosDados) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "UPDATE Presenca SET ";
        let campos_disponiveis = ["estado"];
        const campos_nulos = [];
        novosDados.forEach((p) => {
            if (p.estado === undefined)
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
                        sql += "WHEN id_presenca = ? THEN ? END ";
                    }
                    else {
                        sql += "WHEN id_presenca = ? THEN ? ";
                    }
                }
            }
            else {
                sql += `${c}= CASE `;
                for (let j = 0; j < novosDados.length; j++) {
                    const ultimoJ = j === novosDados.length - 1;
                    if (ultimoJ) {
                        sql += "WHEN id_presenca = ? THEN ? END, ";
                    }
                    else {
                        sql += "WHEN id_presenca = ? THEN ? ";
                    }
                }
            }
        }
        const ids = novosDados.map(({ id_presenca }) => id_presenca);
        sql += ` WHERE id_presenca IN (${ids.map((item) => item).join(", ")})`;
        let values = [];
        for (let dado of novosDados) {
            const array = Object.values(dado);
            const id_presenca = array.shift();
            values.push(array.flatMap((valor) => [id_presenca, valor]));
        }
        values = values.flat();
        const res = yield db_1.default.query(sql, values);
        return res;
    }),
    deletar: (ids) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM Presenca WHERE id_presenca IN (?)";
        return yield db_1.default.query(sql, [ids]);
    }),
};
exports.default = DBPresenca;
