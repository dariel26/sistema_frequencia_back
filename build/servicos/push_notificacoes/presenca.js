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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.carregaPlanejamento = exports.notificaAlunos = void 0;
const utilidades_1 = __importDefault(require("../../controllers/utilidades"));
const DBSubscricao_1 = __importDefault(require("../../db/DBSubscricao"));
const DBUsuario_1 = __importDefault(require("../../db/DBUsuario"));
const web_push_1 = __importDefault(require("web-push"));
const chavePublica = (_a = process.env.PUBLIC_VAPID_KEY) !== null && _a !== void 0 ? _a : "";
const chavePrivada = (_b = process.env.PRIVATE_VAPID_KEY) !== null && _b !== void 0 ? _b : "";
const subject = (_c = process.env.SUBJECT_WEB_PUSH) !== null && _c !== void 0 ? _c : "";
web_push_1.default.setVapidDetails(subject, chavePublica, chavePrivada);
const corpoNotificacaoPresenca = {
    title: "Presença",
    body: "Sua presença já pode ser marcada",
};
//Dados planificados
let dados = [];
//Alunos que ja foram notificados
let alunosNotificadosAnteriormente = [];
function notificaAlunos() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Tentando notificar alunos");
        const dataAtual = utilidades_1.default.dataArarangua();
        let alunosANotificar = dados.filter((d) => {
            return d.datas.some((data) => {
                const dataAtividade = utilidades_1.default.horarioEmData(utilidades_1.default.amdEmData(data.data), data.hora_inicial);
                const diferencaEmHoras = utilidades_1.default.diferencaAbsEmHoras(
                //TODO Esta funcao deve ser abstraida em uma classe do aluno
                dataAtual, dataAtividade);
                return (diferencaEmHoras <= 0.34 &&
                    diferencaEmHoras > 0 &&
                    data.estado === "CRIADA");
            });
        });
        alunosANotificar = alunosANotificar.filter(({ id_usuario }) => !alunosNotificadosAnteriormente.some((a) => a.id_usuario === id_usuario));
        //Notifico os alunos
        alunosNotificadosAnteriormente = alunosANotificar;
        const opcoes = {
            vapidDetails: {
                subject: subject,
                publicKey: chavePublica,
                privateKey: chavePrivada,
            },
            TTL: 60,
        };
        for (let aluno of alunosANotificar) {
            try {
                yield web_push_1.default.sendNotification(aluno.subscricao, JSON.stringify(corpoNotificacaoPresenca), opcoes);
            }
            catch (err) {
                console.error(err);
            }
        }
    });
}
exports.notificaAlunos = notificaAlunos;
function carregaPlanejamento() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const alunos = yield DBUsuario_1.default.listarAlunos();
            const subscricoes = yield DBSubscricao_1.default.listar();
            const alunosComSubscricoes = alunos
                .filter(({ id_usuario }) => subscricoes.some((s) => s.id_usuario === id_usuario))
                .map((a) => {
                var _a, _b, _c, _d;
                const subscricaoDoAluno = subscricoes.find(({ id_usuario }) => id_usuario === a.id_usuario);
                return Object.assign(Object.assign({}, a), { subscricao: {
                        endpoint: (_a = subscricaoDoAluno === null || subscricaoDoAluno === void 0 ? void 0 : subscricaoDoAluno.endpoint) !== null && _a !== void 0 ? _a : "",
                        expirationTime: (_b = subscricaoDoAluno === null || subscricaoDoAluno === void 0 ? void 0 : subscricaoDoAluno.expiracao) !== null && _b !== void 0 ? _b : new Date(),
                        keys: {
                            p256dh: (_c = subscricaoDoAluno === null || subscricaoDoAluno === void 0 ? void 0 : subscricaoDoAluno.u_key) !== null && _c !== void 0 ? _c : "",
                            auth: (_d = subscricaoDoAluno === null || subscricaoDoAluno === void 0 ? void 0 : subscricaoDoAluno.autenticidade) !== null && _d !== void 0 ? _d : "",
                        },
                    } });
            });
            dados = alunosComSubscricoes;
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.carregaPlanejamento = carregaPlanejamento;
