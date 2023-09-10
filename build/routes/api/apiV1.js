"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cAluno_1 = __importDefault(require("../../controllers/cAluno"));
const cCoordEstagio_1 = __importDefault(require("../../controllers/cCoordEstagio"));
const cEstagio_1 = __importDefault(require("../../controllers/cEstagio"));
const cEstagioGrupo_1 = __importDefault(require("../../controllers/cEstagioGrupo"));
const cGrupo_1 = __importDefault(require("../../controllers/cGrupo"));
const cUsuario_1 = __importDefault(require("../../controllers/cUsuario"));
const cLocal_1 = __importDefault(require("../../controllers/cLocal"));
const habilidades_1 = __importDefault(require("../../middleware/habilidades"));
const middlewareJwt_1 = __importDefault(require("../../middleware/middlewareJwt"));
const cAtividade_1 = __importDefault(require("../../controllers/cAtividade"));
const cPrecAtividade_1 = __importDefault(require("../../controllers/cPrecAtividade"));
const cDataAtividade_1 = __importDefault(require("../../controllers/cDataAtividade"));
const cAlunoDataAtividade_1 = __importDefault(require("../../controllers/cAlunoDataAtividade"));
const cLocalAtividade_1 = __importDefault(require("../../controllers/cLocalAtividade"));
const cPreceptor_1 = __importDefault(require("../../controllers/cPreceptor"));
const cCoordenador_1 = __importDefault(require("../../controllers/cCoordenador"));
const cAlunoGrupo_1 = __importDefault(require("../../controllers/cAlunoGrupo"));
const apiV1 = express_1.default.Router();
//LOGIN
apiV1.post("/login", cUsuario_1.default.login);
//MIDDLEWARE PARA AS ROTAS ABAIXO DESTA LINHA
apiV1.use(middlewareJwt_1.default);
//LOGOUT
apiV1.get("/logout", cUsuario_1.default.logout);
//USUARIO
apiV1.get("/usuario/info", cUsuario_1.default.retornaInfoUsuario);
apiV1.get("/usuario/padrao", cUsuario_1.default.usuarioSenhaPadrao);
apiV1.put("/usuario/", (0, habilidades_1.default)("edit", "coordenador"), cUsuario_1.default.editar);
//COORDENADOR
apiV1.post("/coordenador", (0, habilidades_1.default)("edit", "coordenador"), cCoordenador_1.default.criarVarios);
apiV1.get("/coordenador", (0, habilidades_1.default)("read", "coordenador"), cCoordenador_1.default.listar);
apiV1.put("/coordenador", (0, habilidades_1.default)("edit", "coordenador"), cCoordenador_1.default.editar);
apiV1.delete("/coordenador/:ids", (0, habilidades_1.default)("edit", "coordenador"), cCoordenador_1.default.deletarVarios);
//PRECEPTOR
apiV1.post("/preceptor", (0, habilidades_1.default)("edit", "preceptor"), cPreceptor_1.default.criarVarios);
apiV1.get("/preceptor", (0, habilidades_1.default)("read", "preceptor"), cPreceptor_1.default.listar);
apiV1.put("/preceptor", (0, habilidades_1.default)("edit", "preceptor"), cPreceptor_1.default.editar);
apiV1.delete("/preceptor/:ids", (0, habilidades_1.default)("edit", "preceptor"), cPreceptor_1.default.deletarVarios);
//ALUNO
apiV1.post("/aluno", (0, habilidades_1.default)("edit", "aluno"), cAluno_1.default.criarVarios);
apiV1.get("/aluno", (0, habilidades_1.default)("read", "aluno"), cAluno_1.default.listar);
apiV1.put("/aluno", (0, habilidades_1.default)("edit", "aluno"), cAluno_1.default.editar);
apiV1.delete("/aluno/:ids", (0, habilidades_1.default)("edit", "aluno"), cAluno_1.default.deletarVarios);
//ESTAGIO
apiV1.post("/estagio", (0, habilidades_1.default)("edit", "estagio"), cEstagio_1.default.criarVarios);
apiV1.get("/estagio", (0, habilidades_1.default)("read", "estagio"), cEstagio_1.default.listar);
apiV1.put("/estagio", (0, habilidades_1.default)("edit", "estagio"), cEstagio_1.default.editar);
apiV1.delete("/estagio/:ids", (0, habilidades_1.default)("edit", "estagio"), cEstagio_1.default.deletarVarios);
//GRUPO
apiV1.post("/grupo", (0, habilidades_1.default)("edit", "grupo"), cGrupo_1.default.criarVarios);
apiV1.get("/grupo", (0, habilidades_1.default)("read", "grupo"), cGrupo_1.default.listar);
apiV1.put("/grupo", (0, habilidades_1.default)("edit", "grupo"), cGrupo_1.default.editar);
apiV1.delete("/grupo/:ids", (0, habilidades_1.default)("edit", "grupo"), cGrupo_1.default.deletarVarios);
//COORD-ESTAGIO
apiV1.post("/coord-estagio", (0, habilidades_1.default)("edit", "coord-estagio"), cCoordEstagio_1.default.criarVarios);
//ALUNO-GRUPO
apiV1.post("/aluno-grupo", (0, habilidades_1.default)("edit", "coord-estagio"), cAlunoGrupo_1.default.criarVarios);
apiV1.delete("/aluno-grupo/:ids", (0, habilidades_1.default)("edit", "coord-estagio"), cAlunoGrupo_1.default.deletarVarios);
//ESTAGIO-GRUPO
apiV1.post("/estagio-grupo", (0, habilidades_1.default)("edit", "estagio-grupo"), cEstagioGrupo_1.default.criarVarios);
apiV1.put("/estagio-grupo", (0, habilidades_1.default)("edit", "estagio-grupo"), cEstagioGrupo_1.default.editar);
apiV1.delete("/estagio-grupo/:ids", (0, habilidades_1.default)("edit", "estagio-grupo"), cEstagioGrupo_1.default.deletarVarios);
//LOCAL
apiV1.post("/local", (0, habilidades_1.default)("edit", "local"), cLocal_1.default.criarVarios);
apiV1.get("/local", (0, habilidades_1.default)("read", "local"), cLocal_1.default.listar);
apiV1.put("/local", (0, habilidades_1.default)("edit", "local"), cLocal_1.default.editar);
apiV1.delete("/local/:ids", (0, habilidades_1.default)("edit", "local"), cLocal_1.default.deletarVarios);
//ATIVIDADE
apiV1.post("/atividade", (0, habilidades_1.default)("edit", "atividade"), cAtividade_1.default.criarVarios);
apiV1.get("/atividade", (0, habilidades_1.default)("read", "atividade"), cAtividade_1.default.listar);
apiV1.put("/atividade", (0, habilidades_1.default)("edit", "atividade"), cAtividade_1.default.editar);
apiV1.delete("/atividade/:ids", (0, habilidades_1.default)("edit", "atividade"), cAtividade_1.default.deletarVarios);
//PREC-ATIVIDADE
apiV1.post("/prec-atividade", (0, habilidades_1.default)("edit", "coord-estagio"), cPrecAtividade_1.default.criarVarios);
//LOCAL-ATIVIDADE
apiV1.post("/local-atividade", (0, habilidades_1.default)("edit", "coord-estagio"), cLocalAtividade_1.default.criarVarios);
//DATA-ATIVIDADE
apiV1.post("/data-atividade", (0, habilidades_1.default)("edit", "coord-estagio"), cDataAtividade_1.default.criarVarios);
apiV1.put("/data-atividade", (0, habilidades_1.default)("edit", "atividade"), cDataAtividade_1.default.editarVarios);
//ALUNO-DATA-ATIVIDADE
apiV1.post("/aluno-data-atividade", (0, habilidades_1.default)("edit", "coord-estagio"), cAlunoDataAtividade_1.default.criarVarios);
apiV1.get("/aluno-data-atividade/id_aluno/:id", (0, habilidades_1.default)("read", "local"), cAlunoDataAtividade_1.default.buscarPorId);
apiV1.get("/aluno-data-atividade/datas", (0, habilidades_1.default)("read", "local"), cAlunoDataAtividade_1.default.buscarPorDatas);
apiV1.put("/aluno-data-atividade/aluno", (0, habilidades_1.default)("edit", "presenca"), cAlunoDataAtividade_1.default.marcarPresenca);
apiV1.put("/aluno-data-atividade", (0, habilidades_1.default)("edit", "coord-estagio"), cAlunoDataAtividade_1.default.editarPorId);
exports.default = apiV1;
