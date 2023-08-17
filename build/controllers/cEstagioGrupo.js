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
const errors_1 = require("../errors");
const cEstagioGrupo = {
    criarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { dados } = req.body;
            try {
                const ids = dados.map(({ id_estagio }) => id_estagio);
                dados = dados.map(({ id_estagio, id_grupo, data_inicial, data_final, }) => ({
                    id_estagio,
                    id_grupo,
                    data_inicial: new Date(data_inicial)
                        .toISOString()
                        .slice(0, 10)
                        .replace("T", " "),
                    data_final: new Date(data_final)
                        .toISOString()
                        .slice(0, 10)
                        .replace("T", " "),
                }));
                yield DBEstagioGrupo_1.default.criar(dados);
                res.status(201).json({ message: "Associação salva!" });
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
    editarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { novosDados } = req.body;
            try {
                yield DBEstagioGrupo_1.default.editar(novosDados);
                res.status(200).json({ message: "Editado!" });
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
    deletarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = req.params.ids.split(",");
            try {
                yield DBEstagioGrupo_1.default.deletar(ids);
                res.status(200).json({ message: "Associação deletada!" });
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
};
exports.default = cEstagioGrupo;
