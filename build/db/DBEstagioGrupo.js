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
const DBEstagioGrupo = {
    criar: (dados) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "INSERT INTO EstagioGrupo (id_grupo, id_estagio, data_inicial, data_final) VALUES ?";
        const novosDados = dados.map(({ id_grupo, id_estagio, data_inicial, data_final }) => [
            id_grupo,
            id_estagio,
            data_inicial,
            data_final,
        ]);
        const res = yield db_1.default.query(sql, [novosDados]);
        return res;
    }),
    deletar: (ids) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM EstagioGrupo WHERE id_estagiogrupo IN (?)";
        const res = yield db_1.default.query(sql, [ids]);
        return res;
    }),
    editar: (dados) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "UPDATE EstagioGrupo SET";
        const valores = [];
        if (dados.id_grupo) {
            sql += " id_grupo=?,";
            valores.push(dados.id_grupo);
        }
        if (dados.id_estagio) {
            sql += " id_estagio=?,";
            valores.push(dados.id_estagio);
        }
        if (dados.data_inicial) {
            sql += " data_inicial=?,";
            valores.push(dados.data_inicial);
        }
        if (dados.data_final) {
            sql += " data_final=?,";
            valores.push(dados.data_final);
        }
        sql = sql.slice(0, -1);
        sql += ` WHERE id_estagiogrupo=?`;
        valores.push(dados.id_estagiogrupo);
        yield db_1.default.query(sql, valores);
    }),
};
exports.default = DBEstagioGrupo;
