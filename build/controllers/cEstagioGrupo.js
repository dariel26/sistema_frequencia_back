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
const DBEstagioGrupo_1 = __importDefault(require("../db/DBEstagioGrupo"));
const userErrors_1 = require("./userErrors");
const messagesDev_1 = __importDefault(require("./messagesDev"));
const utilidades_1 = __importDefault(require("./utilidades"));
const camposEstagioGrupo = ["id_estagio", "data_inicial", "data_final"];
const camposEstagioGrupoEdicao = [
    "id_estagiogrupo",
    "data_inicial",
    "data_final",
    "id_grupo",
];
const cEstagioGrupo = {
    criarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { dados } = req.body;
            const message = messagesDev_1.default.verificaNovos(dados, camposEstagioGrupo);
            if (message)
                return res.status(400).json({ message });
            try {
                dados = dados.map((dado) => ({
                    id_estagio: dado.id_estagio,
                    id_grupo: dado.id_grupo,
                    data_inicial: utilidades_1.default.dataFrontEmDataBD(dado.data_inicial),
                    data_final: utilidades_1.default.dataFrontEmDataBD(dado.data_final),
                }));
                yield DBEstagioGrupo_1.default.criar(dados);
                res.status(200).json();
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    editar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { novosDados } = req.body;
            const message = messagesDev_1.default.verificaEdicao(novosDados, camposEstagioGrupoEdicao);
            if (message)
                return res.status(400).json({ message });
            try {
                if (novosDados.data_inicial)
                    novosDados = Object.assign(Object.assign({}, novosDados), { data_inicial: utilidades_1.default.dataFrontEmDataBD(novosDados.data_inicial) });
                if (novosDados.data_final)
                    novosDados = Object.assign(Object.assign({}, novosDados), { data_final: utilidades_1.default.dataFrontEmDataBD(novosDados.data_final) });
                yield DBEstagioGrupo_1.default.editar(novosDados);
                res.status(200).json();
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    deletarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = req.params.ids.split(",");
            try {
                yield DBEstagioGrupo_1.default.deletar(ids);
                res.status(200).json();
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
};
exports.default = cEstagioGrupo;
