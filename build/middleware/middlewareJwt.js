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
exports.tokenSecret = void 0;
require("dotenv").config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db/db"));
const errors_1 = require("../errors");
exports.tokenSecret = "djasAJDi@e23819#@(*!ksDAHS";
function acessoPadrao(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = req.headers;
        try {
            if (process.env.NODE_ENV === "test")
                return next();
            if (token === undefined)
                return res
                    .status(401)
                    .json({ message: "Você não possui chave de acesso!" });
            if (Array.isArray(token))
                return res.status(401).json({ message: "Token Inválido!" });
            const infoToken = jsonwebtoken_1.default.verify(token, exports.tokenSecret);
            yield db_1.default.query("delete from jwt where validade < NOW()");
            const dados = yield db_1.default.query(`select * from jwt where token='${token}'`);
            if (dados[0][0] === undefined) {
                const requisicao = req;
                requisicao.infoToken = infoToken;
                setTimeout(() => {
                    return next();
                }, 1000);
            }
            else {
                return res.status(401).json();
            }
        }
        catch (err) {
            (0, errors_1.trataErr)(err, res);
        }
    });
}
exports.default = acessoPadrao;
