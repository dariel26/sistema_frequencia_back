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
const DBAlunoGrupo = {
    criar: (dados) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "INSERT INTO AlunoGrupo (id_usuario, id_grupo) VALUES ?";
        const novosDados = dados.map(({ id_usuario, id_grupo }) => [
            id_usuario,
            id_grupo,
        ]);
        const res = yield db_1.default.query(sql, [novosDados]);
        return res;
    }),
    deletar: (idsAlunos) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM AlunoGrupo WHERE id_usuario IN (?)";
        const res = yield db_1.default.query(sql, [idsAlunos]);
        return res;
    }),
};
exports.default = DBAlunoGrupo;
