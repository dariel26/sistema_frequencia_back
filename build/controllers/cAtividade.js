"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const DBAtividade_1 = __importDefault(require("../db/DBAtividade"));
const DBEstagio_1 = __importDefault(require("../db/DBEstagio"));
const userErrors_1 = require("./userErrors");
const utilidades_1 = __importStar(require("./utilidades"));
const DBDataAtividade_1 = __importDefault(require("../db/DBDataAtividade"));
const DBAlunoDataAtividade_1 = __importDefault(require("../db/DBAlunoDataAtividade"));
const NOME_GRUPO_ATIVIDADE_GERAL = "Todos os alunos";
const camposAtividades = ["nome"];
const camposAtividadesEdicao = [
    "id_atividade",
    "id_estagio",
    "nome",
    "hora_inicial",
    "hora_final",
    "intervalo_alunos",
    "alunos_no_dia",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
    "domingo",
];
const cAtividade = {
    criarVarios: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { atividades } = req.body;
        const message = messagesDev_1.default.verificaNovos(atividades, camposAtividades);
        if (message)
            return res.status(400).json({ message });
        try {
            yield DBAtividade_1.default.criar(atividades);
            const estagios = yield DBEstagio_1.default.listar();
            let novasAtividades = yield DBAtividade_1.default.listar();
            novasAtividades = atividadesComSubgrupos(novasAtividades, estagios);
            res.status(200).json(novasAtividades);
        }
        catch (err) {
            (0, userErrors_1.userError)(err, res);
        }
    }),
    listar(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const atividades = yield DBAtividade_1.default.listar();
                const estagios = yield DBEstagio_1.default.listar();
                const atividadesCompletas = atividadesComSubgrupos(atividades, estagios);
                res.status(200).json(atividadesCompletas);
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
    editar: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { novosDados } = req.body;
        const message = messagesDev_1.default.verificaEdicao(novosDados, camposAtividadesEdicao);
        if (message)
            return res.status(400).json({ message });
        try {
            const atividades = yield DBAtividade_1.default.listar();
            const estagios = yield DBEstagio_1.default.listar();
            const atividadeAntiga = atividades.find(({ id_atividade }) => id_atividade === novosDados.id_atividade);
            if (!atividadeAntiga)
                return res.status(400).json({
                    message: "A atividade a ser editada não existe no Banco de Dados",
                });
            const atividadeAtualizada = Object.assign(Object.assign({}, atividadeAntiga), novosDados);
            const atividadeCompleta = atividadesComSubgrupos([atividadeAtualizada], estagios)[0];
            const dataAmanha = utilidades_1.default.dataArarangua();
            dataAmanha.setDate(dataAmanha.getDate() + 1);
            const datasDaAtividade = atividadeCompleta.subgrupos.flatMap(({ data_inicial, data_final }) => utilidades_1.default.datasPorDiaSemana(dataAmanha < data_inicial ? data_inicial : dataAmanha, data_final, atividadeCompleta));
            const { mudarDatas, mudarAlunos } = devoMudar(novosDados);
            const alunosNoDia = atividadeCompleta.alunos_no_dia;
            if (mudarDatas) {
                yield atualizaDatasAtividade(atividadeCompleta, datasDaAtividade, dataAmanha);
                const novasDatasAtividade = yield DBDataAtividade_1.default.buscarPartindoDe(atividadeCompleta.id_atividade, utilidades_1.default.dataEmDataBD(dataAmanha));
                yield DBAlunoDataAtividade_1.default.deletarPartindoDe(atividadeCompleta.id_atividade, utilidades_1.default.dataEmDataBD(dataAmanha));
                yield atualizaAlunosDatasAtividade(atividadeCompleta.subgrupos, alunosNoDia, novasDatasAtividade);
            }
            else if (mudarAlunos) {
                const novasDatasAtividade = yield DBDataAtividade_1.default.buscarPartindoDe(atividadeCompleta.id_atividade, utilidades_1.default.dataEmDataBD(dataAmanha));
                yield DBAlunoDataAtividade_1.default.deletarPartindoDe(atividadeCompleta.id_atividade, utilidades_1.default.dataEmDataBD(dataAmanha));
                yield atualizaAlunosDatasAtividade(atividadeCompleta.subgrupos, alunosNoDia, novasDatasAtividade);
            }
            yield DBAtividade_1.default.editar(novosDados);
            res.status(200).json(atividadeCompleta);
        }
        catch (err) {
            console.log(err);
            (0, userErrors_1.userError)(err, res);
        }
    }),
    deletarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = req.params.ids.split(",");
            try {
                yield DBAtividade_1.default.deletar(ids);
                res.status(200).json();
            }
            catch (err) {
                (0, userErrors_1.userError)(err, res);
            }
        });
    },
};
exports.default = cAtividade;
function atividadesComSubgrupos(atividades, estagios) {
    var _a;
    const atividadesCompletas = [];
    for (const atividade of atividades) {
        const subgruposDaAtividade = [];
        let gruposDaAtividade = [];
        const estagioDaAtividade = estagios.find(({ id_estagio }) => id_estagio === atividade.id_estagio);
        if (!estagioDaAtividade)
            gruposDaAtividade = [grupoDaAtividadeGeral(estagios)];
        else
            gruposDaAtividade = estagioDaAtividade.grupos;
        const [idxAlunoInicialStr, idxAlunoFinalStr] = ((_a = atividade.intervalo_alunos) !== null && _a !== void 0 ? _a : "5000-5001").split("-");
        const idxAlunoInicial = parseInt(idxAlunoInicialStr) - 1;
        const idxAlunoFinal = parseInt(idxAlunoFinalStr) - 1;
        for (const grupo of gruposDaAtividade) {
            subgruposDaAtividade.push({
                data_inicial: utilidades_1.default.amdEmData(grupo.data_inicial),
                data_final: utilidades_1.default.amdEmData(grupo.data_final),
                alunos: grupo.alunos.map((a, i) => ({
                    id_aluno: a.id_usuario,
                    nome: a.nome,
                    incluido: idxAlunoInicial <= i && idxAlunoFinal >= i,
                })),
            });
        }
        atividadesCompletas.push(Object.assign(Object.assign({}, atividade), { subgrupos: subgruposDaAtividade }));
    }
    return atividadesCompletas;
}
function grupoDaAtividadeGeral(estagios) {
    let grupoDaAtividade;
    const grupos = estagios[0].grupos;
    const alunos = grupos
        .flatMap((g) => g.alunos)
        .sort(utilidades_1.default.ordenarPorIdUsuarioASC);
    const datas = grupos.flatMap(({ data_inicial, data_final }) => [
        utilidades_1.default.amdEmData(data_inicial),
        utilidades_1.default.amdEmData(data_final),
    ]);
    let [dataInicial, dataFinal] = utilidades_1.default.encontrarMinEMaxDatas(datas);
    grupoDaAtividade = {
        id_estagiogrupo: -1,
        nome: NOME_GRUPO_ATIVIDADE_GERAL,
        id_grupo: -1,
        data_inicial: utilidades_1.default.dataEmAmd(dataInicial),
        data_final: utilidades_1.default.dataEmAmd(dataFinal),
        alunos,
    };
    return grupoDaAtividade;
}
function devoMudar(novosDados) {
    const mudarAlunos = typeof novosDados.alunos_no_dia === "number" ||
        typeof novosDados.intervalo_alunos === "string";
    const mudarDatas = typeof novosDados.segunda === "boolean" ||
        typeof novosDados.terca === "boolean" ||
        typeof novosDados.quarta === "boolean" ||
        typeof novosDados.quinta === "boolean" ||
        typeof novosDados.sexta === "boolean" ||
        typeof novosDados.sabado === "boolean" ||
        typeof novosDados.domingo === "boolean";
    return { mudarAlunos, mudarDatas };
}
function atualizaDatasAtividade(atividadeCompleta, datasDaAtividade, dataAmanha) {
    return __awaiter(this, void 0, void 0, function* () {
        const datasAtividade = datasDaAtividade.map((d) => ({
            id_atividade: atividadeCompleta.id_atividade,
            excluida: false,
            data: utilidades_1.default.dataEmDataBD(d),
        }));
        yield DBDataAtividade_1.default.deletarPreservandoHistorico([atividadeCompleta.id_atividade.toString()], utilidades_1.default.dataEmDataBD(dataAmanha));
        if (datasAtividade.length > 0)
            yield DBDataAtividade_1.default.criar(datasAtividade);
    });
}
function atualizaAlunosDatasAtividade(subgrupos, alunosNoDia, novasDatasAtividade) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof alunosNoDia === "number") {
            const alunosDatasAtividade = subgrupos.flatMap(({ alunos, data_inicial, data_final }) => {
                const alunosNaAtividade = alunos.filter(({ incluido }) => incluido);
                const tamArray = alunosNaAtividade.length;
                const maxAlunos = alunosNoDia > tamArray ? tamArray : alunosNoDia;
                if (tamArray < 1)
                    return [];
                const datas = utilidades_1.default.datasNoIntervalo(data_inicial, data_final, novasDatasAtividade.map((d) => (Object.assign(Object.assign({}, d), { data: (0, utilidades_1.dataEmAmd)(d.data) }))));
                const alunosExtendidos = utilidades_1.default.extenderArray(alunosNaAtividade, maxAlunos * datas.length);
                return datas.flatMap(({ data, id_dataatividade, id_atividade }, i) => {
                    const alunos = alunosExtendidos.slice(i * maxAlunos, (i + 1) * maxAlunos);
                    return alunos.map(({ id_aluno }) => ({
                        id_usuario: id_aluno,
                        id_atividade,
                        id_dataatividade,
                        data,
                        estado: "CRIADA",
                    }));
                });
            });
            if (alunosDatasAtividade.length > 0)
                yield DBAlunoDataAtividade_1.default.criar(alunosDatasAtividade);
        }
    });
}
/*import { Request, Response } from "express";
import DBEstagio from "../db/DBEstagio";
import { trataErr } from "../errors";
import cUtils from "./cUtils";

const camposEstagios = ["nome"];

const cEstagio = {

  async editar(req: Request, res: Response) {
    const { novosDados } = req.body;

    const message = cUtils.verificaEdicao(novosDados, camposEstagios);
    if (message) return res.status(400).json({ message });

    try {
      await DBEstagio.editar(novosDados);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cEstagio;
*/
