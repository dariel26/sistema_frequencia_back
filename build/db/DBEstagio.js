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
const DBEstagio = {
    criar: (estagios) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "INSERT INTO Estagio (nome) VALUES ?";
        const novosEstagios = estagios.map(({ nome }) => [nome]);
        const res = yield db_1.default.query(sql, [novosEstagios]);
        return res;
    }),
    listar: () => __awaiter(void 0, void 0, void 0, function* () {
        const sql = `SELECT * FROM view_estagio ORDER BY id_estagio`;
        const [linhas] = yield db_1.default.query(sql);
        return linhas;
    }),
    editar: (novosDados) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "UPDATE Estagio SET ";
        let campos_disponiveis = ["nome"];
        const campos_nulos = [];
        novosDados.forEach((e) => {
            if (e.nome === undefined)
                campos_nulos.push("nome");
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
                        sql += "WHEN id_estagio = ? THEN ? END ";
                    }
                    else {
                        sql += "WHEN id_estagio = ? THEN ? ";
                    }
                }
            }
            else {
                sql += `${c}= CASE `;
                for (let j = 0; j < novosDados.length; j++) {
                    const ultimoJ = j === novosDados.length - 1;
                    if (ultimoJ) {
                        sql += "WHEN id_estagio = ? THEN ? END, ";
                    }
                    else {
                        sql += "WHEN id_estagio = ? THEN ? ";
                    }
                }
            }
        }
        const ids = novosDados.map(({ id_estagio }) => id_estagio);
        sql += ` WHERE id_estagio IN (${ids.map((item) => item).join(", ")})`;
        let values = [];
        for (let dado of novosDados) {
            const array = Object.values(dado);
            const id_estagio = array.shift();
            values.push(array.flatMap((valor) => [id_estagio, valor]));
        }
        values = values.flat();
        const res = yield db_1.default.query(sql, values);
        return res;
    }),
    deletar: (ids) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM Estagio WHERE id_estagio IN (?)";
        return yield db_1.default.query(sql, [ids]);
    }),
};
exports.default = DBEstagio;
