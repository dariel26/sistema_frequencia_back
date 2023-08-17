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
const DBUsuario = {
    buscaPorLogin: (login) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "SELECT * FROM view_usuario WHERE login=?";
        const [usuarios] = yield db_1.default.query(sql, [login]);
        return usuarios[0];
    }),
    invalidarToken: (token) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = `INSERT INTO jwt (token, validade) VALUES('${token}', NOW() + INTERVAL 24 HOUR)`;
        yield db_1.default.query(sql);
    }),
};
exports.default = DBUsuario;
