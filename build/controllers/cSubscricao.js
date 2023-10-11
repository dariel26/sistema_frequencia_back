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
const messagesDev_1 = __importDefault(require("./messagesDev"));
const DBSubscricao_1 = __importDefault(require("../db/DBSubscricao"));
const userErrors_1 = require("./userErrors");
const cSubscricao = {
    criaSubscricao(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dados } = req.body;
            const message = messagesDev_1.default.verificaEdicao(dados, ["subscricao"]);
            if (message)
                return res.status(400).json({ message });
            if (!(dados === null || dados === void 0 ? void 0 : dados.id_usuario))
                return res.status(400).json({ message: "O id_usuario é necessário" });
            const dadosNormalizados = {
                id_usuario: dados.id_usuario,
                endpoint: dados.subscricao.endpoint,
                expiracao: dados.subscricao.expirationTime,
                u_key: dados.subscricao.keys.p256dh,
                autenticidade: dados.subscricao.keys.auth,
            };
            try {
                yield DBSubscricao_1.default.deletar([dados.id_usuario]);
                yield DBSubscricao_1.default.criar([dadosNormalizados]);
                res.status(200).json();
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    revogaSubscricao(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = req.params;
            try {
                yield DBSubscricao_1.default.deletar([id_usuario]);
                res.status(200).json();
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    possuiSubscricao(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const requisicao = req;
            try {
                const subscricoes = yield DBSubscricao_1.default.listar();
                if (subscricoes.some((s) => s.id_usuario === requisicao.infoToken.id_usuario))
                    res.status(200).json(true);
                else
                    res.status(200).json(false);
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
};
exports.default = cSubscricao;
