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
const DBAtividade_1 = __importDefault(require("../db/DBAtividade"));
const errors_1 = require("../errors");
const DBGrupo_1 = __importDefault(require("../db/DBGrupo"));
const utils_1 = require("../utils");
const DBEstagio_1 = __importDefault(require("../db/DBEstagio"));
const DBDataAtividade_1 = __importDefault(require("../db/DBDataAtividade"));
const DBAlunoDataAtividade_1 = __importDefault(require("../db/DBAlunoDataAtividade"));
function dataAlunoAtividadeMudou(novoDado) {
    if ("intervalo_alunos" in novoDado)
        return true;
    if ("alunos_no_dia" in novoDado)
        return true;
    if ("segunda" in novoDado)
        return true;
    if ("terca" in novoDado)
        return true;
    if ("quarta" in novoDado)
        return true;
    if ("quinta" in novoDado)
        return true;
    if ("sexta" in novoDado)
        return true;
    if ("sabado" in novoDado)
        return true;
    if ("domingo" in novoDado)
        return true;
    return false;
}
function retornaDataInicialFinal(estagios) {
    var _a, _b, _c, _d, _e;
    let dataInicialSemestre = (0, utils_1.amdEmData)((_b = (_a = estagios[0]) === null || _a === void 0 ? void 0 : _a.grupos[0]) === null || _b === void 0 ? void 0 : _b.data_inicial);
    let dataFinalSemestre = (0, utils_1.amdEmData)((_d = (_c = estagios[0]) === null || _c === void 0 ? void 0 : _c.grupos[0]) === null || _d === void 0 ? void 0 : _d.data_inicial);
    (_e = estagios[0]) === null || _e === void 0 ? void 0 : _e.grupos.forEach(({ data_inicial, data_final }) => {
        if ((0, utils_1.amdEmData)(data_inicial) < dataInicialSemestre)
            dataInicialSemestre = (0, utils_1.amdEmData)(data_inicial);
        if ((0, utils_1.amdEmData)(data_inicial) > dataFinalSemestre)
            dataFinalSemestre = (0, utils_1.amdEmData)(data_inicial);
        if ((0, utils_1.amdEmData)(data_final) < dataInicialSemestre)
            dataInicialSemestre = (0, utils_1.amdEmData)(data_final);
        if ((0, utils_1.amdEmData)(data_final) > dataFinalSemestre)
            dataFinalSemestre = (0, utils_1.amdEmData)(data_final);
    });
    return { dataInicial: dataInicialSemestre, dataFinal: dataFinalSemestre };
}
function retornaArrayDiasSemana(atividade) {
    const diasSemenas = [];
    if (atividade.segunda)
        diasSemenas.push(1);
    if (atividade.terca)
        diasSemenas.push(2);
    if (atividade.quarta)
        diasSemenas.push(3);
    if (atividade.quinta)
        diasSemenas.push(4);
    if (atividade.sexta)
        diasSemenas.push(5);
    if (atividade.sabado)
        diasSemenas.push(6);
    if (atividade.domingo)
        diasSemenas.push(0);
    return diasSemenas;
}
function edicaoIncorreta(novoDado) {
    if (typeof novoDado.id_atividade !== typeof 1)
        return "O id da atividade não está sendo passado";
    return false;
}
function atividadeComSubgrupo(atividade, grupos) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let subgrupos = [];
            const iPrimeiroAluno = parseInt((_a = atividade === null || atividade === void 0 ? void 0 : atividade.intervalo_alunos) === null || _a === void 0 ? void 0 : _a.split("-")[0]) - 1;
            const iUltimoAluno = parseInt((_b = atividade === null || atividade === void 0 ? void 0 : atividade.intervalo_alunos) === null || _b === void 0 ? void 0 : _b.split("-")[1]) - 1;
            if (isNaN(iPrimeiroAluno) || isNaN(iUltimoAluno))
                return Object.assign(Object.assign({}, atividade), { subgrupos });
            subgrupos =
                atividade.id_estagio === null
                    ? grupos.flatMap((g) => ({
                        data_final: g.data_final,
                        data_inicial: g.data_inicial,
                        alunos: g.alunos.map((a) => ({
                            nome_aluno: a.nome,
                            aluno_incluido: false,
                            id_aluno: a.id_aluno,
                        })),
                    }))
                    : grupos.map((g) => ({
                        data_inicial: g.data_inicial,
                        data_final: g.data_final,
                        alunos: g.alunos.map((a) => ({
                            nome_aluno: a.nome,
                            aluno_incluido: false,
                            id_aluno: a.id_aluno,
                        })),
                    }));
            if (atividade.id_estagio === null) {
                const dataInicial = (_c = subgrupos[0]) === null || _c === void 0 ? void 0 : _c.data_inicial;
                const dataFinal = (_d = subgrupos[0]) === null || _d === void 0 ? void 0 : _d.data_final;
                subgrupos = [
                    {
                        data_inicial: dataInicial,
                        data_final: dataFinal,
                        alunos: subgrupos.flatMap((subg) => subg.alunos),
                    },
                ];
            }
            subgrupos = subgrupos.map((subG) => ({
                data_inicial: subG.data_inicial,
                data_final: subG.data_final,
                alunos: subG.alunos.map((al, i) => {
                    if (i >= iPrimeiroAluno && i <= iUltimoAluno)
                        return Object.assign(Object.assign({}, al), { aluno_incluido: true });
                    else
                        return al;
                }),
            }));
            return Object.assign(Object.assign({}, atividade), { subgrupos });
        }
        catch (err) {
            throw err;
        }
    });
}
function gruposDaAtividade(estagios, atividade, grupos) {
    const estagioDaAtividade = estagios.find((e) => e.id_estagio === atividade.id_estagio);
    return estagioDaAtividade
        ? estagioDaAtividade.grupos.map((grupo) => (Object.assign(Object.assign({}, grupo), { data_inicial: (0, utils_1.amdEmData)(grupo.data_inicial), data_final: (0, utils_1.amdEmData)(grupo.data_final) })))
        : grupos.map((grupo) => (Object.assign(Object.assign({}, grupo), { data_inicial: retornaDataInicialFinal(estagios).dataInicial, data_final: retornaDataInicialFinal(estagios).dataFinal })));
}
const cAtividade = {
    criarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { atividades } = req.body;
            try {
                yield DBAtividade_1.default.criar(atividades);
                let atividadesAtualizadas = yield DBAtividade_1.default.listar();
                const grupos = yield DBGrupo_1.default.listar();
                const estagios = yield DBEstagio_1.default.listar();
                const novasAtividades = [];
                for (let atividade of atividadesAtualizadas) {
                    novasAtividades.push(yield atividadeComSubgrupo(atividade, gruposDaAtividade(estagios, atividade, grupos)));
                }
                res.status(201).json(novasAtividades);
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
    listar(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let atividades = yield DBAtividade_1.default.listar();
                const grupos = yield DBGrupo_1.default.listar();
                const estagios = yield DBEstagio_1.default.listar();
                const novasAtividades = [];
                for (let atividade of atividades) {
                    novasAtividades.push(yield atividadeComSubgrupo(atividade, gruposDaAtividade(estagios, atividade, grupos)));
                }
                res.status(200).json(novasAtividades);
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
                yield DBAtividade_1.default.deletar(ids);
                res.status(200).json({ message: "Atividades deletadas!" });
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
    editarVarios(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { novoDado } = req.body;
            try {
                const estagios = yield DBEstagio_1.default.listar();
                const grupos = yield DBGrupo_1.default.listar();
                let atividadeAtualizada;
                const message = edicaoIncorreta(novoDado);
                if (message)
                    return res.status(400).json({ message });
                const idEstaAtividade = novoDado.id_atividade;
                let estaAtividade = (yield DBAtividade_1.default.listar()).find((a) => a.id_atividade === idEstaAtividade);
                estaAtividade = Object.assign(estaAtividade, novoDado);
                atividadeAtualizada = estaAtividade;
                const diasSemana = retornaArrayDiasSemana(estaAtividade);
                const { dataInicial, dataFinal } = retornaDataInicialFinal(estagios);
                const datas = (0, utils_1.obterDatasPorDiaSemana)(dataInicial, dataFinal, diasSemana);
                const datasFormatadas = datas.map((data) => ({
                    id_atividade: estaAtividade.id_atividade,
                    data: data.toISOString().slice(0, 10).replace("T", " "),
                }));
                yield DBDataAtividade_1.default.deletar([estaAtividade.id_atividade]);
                if (datasFormatadas.length > 0)
                    yield DBDataAtividade_1.default.criar(datasFormatadas);
                atividadeAtualizada = (yield DBAtividade_1.default.listar()).find((a) => a.id_atividade === idEstaAtividade);
                yield DBAtividade_1.default.editar([novoDado]);
                atividadeAtualizada = yield atividadeComSubgrupo((yield DBAtividade_1.default.listar()).find((a) => a.id_atividade === idEstaAtividade), gruposDaAtividade(estagios, atividadeAtualizada, grupos));
                const indexInicial = parseInt((_a = atividadeAtualizada.intervalo_alunos) === null || _a === void 0 ? void 0 : _a.split("-")[0]) - 1;
                const indexFinal = parseInt((_b = atividadeAtualizada.intervalo_alunos) === null || _b === void 0 ? void 0 : _b.split("-")[1]) - 1;
                const alunos_no_dia = atividadeAtualizada.alunos_no_dia;
                if (dataAlunoAtividadeMudou(novoDado) &&
                    !isNaN(indexInicial) &&
                    !isNaN(indexFinal) &&
                    alunos_no_dia !== null &&
                    indexFinal - indexInicial + 1 >= alunos_no_dia) {
                    const subgrupos = atividadeAtualizada.subgrupos.map((subg) => (Object.assign(Object.assign({}, subg), { alunos: subg.alunos.filter((al) => al.aluno_incluido) })));
                    const datasAluno = [];
                    for (let subg of subgrupos) {
                        const datasDoSubGrupo = (0, utils_1.datasNoIntervalo)(subg.data_inicial, subg.data_final, atividadeAtualizada.datas);
                        const alunosExtendidos = (0, utils_1.extenderArray)(subg.alunos, alunos_no_dia * datasDoSubGrupo.length);
                        datasDoSubGrupo.forEach((dataAtividade, i) => {
                            alunosExtendidos
                                .slice(i * alunos_no_dia, (i + 1) * alunos_no_dia)
                                .forEach((aluno) => {
                                datasAluno.push({
                                    id_atividade: atividadeAtualizada.id_atividade,
                                    id_aluno: aluno.id_aluno,
                                    data: (0, utils_1.amdEmData)(dataAtividade.data),
                                    estado: "0",
                                });
                            });
                        });
                        yield DBAlunoDataAtividade_1.default.deletarSemPresencas([
                            String(atividadeAtualizada.id_atividade),
                        ]);
                        yield DBAlunoDataAtividade_1.default.criar(datasAluno);
                    }
                }
                res.status(200).json(atividadeAtualizada);
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
};
exports.default = cAtividade;
