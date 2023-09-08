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
const DBGrupo = {
    criar: (grupos) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "INSERT INTO Grupo (nome) VALUES ?";
        const novosGrupos = grupos.map(({ nome }) => [nome]);
        const res = yield db_1.default.query(sql, [novosGrupos]);
        return res;
    }),
    listar: () => __awaiter(void 0, void 0, void 0, function* () {
        const sql = `SELECT * FROM view_grupo`;
        const [linhas] = yield db_1.default.query(sql);
        return linhas;
    }),
    editar: (dados) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "UPDATE Grupo SET nome=? WHERE id_grupo=?";
        yield db_1.default.query(sql, [dados.nome, dados.id_grupo]);
    }),
    deletar: (ids) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM Grupo WHERE id_grupo IN (?)";
        return yield db_1.default.query(sql, [ids]);
    }),
};
exports.default = DBGrupo;
