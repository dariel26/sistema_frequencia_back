require("dotenv").config();
import express from "express";
import cAluno from "../../controllers/cAluno";
import cCoordenador from "../../controllers/cCoordenador";
import cCoordEstagio from "../../controllers/cCoordEstagio";
import cEstagio from "../../controllers/cEstagio";
import cEstagioGrupo from "../../controllers/cEstagioGrupo";
import cGrupo from "../../controllers/cGrupo";
import cUsuario from "../../controllers/cUsuario";
import cLocal from "../../controllers/cLocal";
import cPreceptor from "../../controllers/cPreceptor";
import checarHabilidade from "../../middleware/habilidades";
import acessoPadrao from "../../middleware/middlewareJwt";
import cAtividade from "../../controllers/cAtividade";
import cPrecAtividade from "../../controllers/cPrecAtividade";
import cDataAtividade from "../../controllers/cDataAtividade";
import cAlunoDataAtividade from "../../controllers/cAlunoDataAtividade";

const apiV1 = express.Router();

//LOGIN
apiV1.post("/login", cUsuario.login);

//MIDDLEWARE PARA AS ROTAS ABAIXO DESTA LINHA
apiV1.use(acessoPadrao);

//LOGOUT
apiV1.get("/logout", cUsuario.logout);

//USUARIO
apiV1.get("/usuario/info", cUsuario.retornaInfoUsuario);
apiV1.get("/usuario/padrao", cUsuario.usuarioSenhaPadrao);
apiV1.post("/usuario/senha", cUsuario.mudarSenha);

//COORDENADOR
apiV1.post("/coordenador", checarHabilidade("edit", "coordenador"), cCoordenador.criarVarios);
apiV1.get("/coordenador", checarHabilidade("read", "coordenador"), cCoordenador.listar);
apiV1.put("/coordenador", checarHabilidade("edit", "coordenador"), cCoordenador.editarVarios);
apiV1.delete("/coordenador/:ids", checarHabilidade("edit", "coordenador"), cCoordenador.deletarVarios);

//PRECEPTOR
apiV1.post("/preceptor", checarHabilidade("edit", "preceptor"), cPreceptor.criarVarios);
apiV1.get("/preceptor", checarHabilidade("read", "preceptor"), cPreceptor.listar);
apiV1.put("/preceptor", checarHabilidade("edit", "preceptor"), cPreceptor.editarVarios);
apiV1.delete("/preceptor/:ids", checarHabilidade("edit", "preceptor"), cPreceptor.deletarVarios);

//ALUNO
apiV1.post("/aluno", checarHabilidade("edit", "aluno"), cAluno.criarVarios);
apiV1.get("/aluno", checarHabilidade("read", "aluno"), cAluno.listar);
apiV1.put("/aluno", checarHabilidade("edit", "aluno"), cAluno.editarVarios);
apiV1.delete("/aluno/:ids", checarHabilidade("edit", "aluno"), cAluno.deletarVarios);

//ESTAGIO
apiV1.post("/estagio", checarHabilidade("edit", "estagio"), cEstagio.criarVarios);
apiV1.get("/estagio", checarHabilidade("read", "estagio"), cEstagio.listar);
apiV1.put("/estagio", checarHabilidade("edit", "estagio"), cEstagio.editarVarios);
apiV1.delete("/estagio/:ids", checarHabilidade("edit", "estagio"), cEstagio.deletarVarios);

//GRUPO
apiV1.post("/grupo", checarHabilidade("edit", "grupo"), cGrupo.criarVarios);
apiV1.get("/grupo", checarHabilidade("read", "grupo"), cGrupo.listar);
apiV1.put("/grupo", checarHabilidade("edit", "grupo"), cGrupo.editarVarios);
apiV1.delete("/grupo/:ids", checarHabilidade("edit", "grupo"), cGrupo.deletarVarios);

//COORD-ESTAGIO
apiV1.post("/coord-estagio", checarHabilidade("edit", "coord-estagio"), cCoordEstagio.criarVarios);

//ESTAGIO-GRUPO
apiV1.post("/estagio-grupo", checarHabilidade("edit", "estagio-grupo"), cEstagioGrupo.criarVarios);
apiV1.delete("/estagio-grupo/:ids", checarHabilidade("edit", "estagio-grupo"), cEstagioGrupo.deletarVarios);

//LOCAL
apiV1.post("/local", checarHabilidade("edit", "local"), cLocal.criarVarios);
apiV1.get("/local", checarHabilidade("read", "local"), cLocal.listar);
apiV1.put("/local", checarHabilidade("edit", "local"), cLocal.editarVarios);
apiV1.delete("/local/:ids", checarHabilidade("edit", "local"), cLocal.deletarVarios);

//ATIVIDADE
apiV1.post("/atividade", checarHabilidade("edit", "atividade"), cAtividade.criarVarios);
apiV1.get("/atividade", checarHabilidade("read", "atividade"), cAtividade.listar);
apiV1.put("/atividade", checarHabilidade("edit", "atividade"), cAtividade.editarVarios);
apiV1.delete("/atividade/:ids", checarHabilidade("edit", "atividade"), cAtividade.deletarVarios);

//PREC-ATIVIDADE
apiV1.post("/prec-atividade", checarHabilidade("edit", "coord-estagio"), cPrecAtividade.criarVarios);

//DATA-ATIVIDADE
apiV1.post("/data-atividade", checarHabilidade("edit", "coord-estagio"), cDataAtividade.criarVarios);
apiV1.put("/data-atividade", checarHabilidade("edit", "atividade"), cDataAtividade.editarVarios);

//ALUNO-DATA-ATIVIDADE
apiV1.post("/aluno-data-atividade", checarHabilidade("edit", "coord-estagio"), cAlunoDataAtividade.criarVarios);

export default apiV1;
