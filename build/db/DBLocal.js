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
const DBLocal = {
    criar: (locais) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "INSERT INTO Local (nome, coordenadas) VALUES ?";
        const novosLocais = locais.map(({ nome, coordenadas }) => [
            nome,
            coordenadas,
        ]);
        const res = yield db_1.default.query(sql, [novosLocais]);
        return res;
    }),
    listar: () => __awaiter(void 0, void 0, void 0, function* () {
        const sql = `SELECT * FROM Local`;
        const [linhas] = yield db_1.default.query(sql);
        return linhas;
    }),
    editar: (dados) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "UPDATE Local SET nome=? WHERE id_local=?";
        yield db_1.default.query(sql, [dados.nome, dados.id_local]);
    }),
    deletar: (ids) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM Local WHERE id_local IN (?)";
        return yield db_1.default.query(sql, [ids]);
    }),
};
exports.default = DBLocal;
