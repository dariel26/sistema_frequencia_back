require("dotenv").config();
import express from "express";
import cAluno from "../../controllers/cAluno";
import cAlunoAtiv from "../../controllers/cAlunoAtiv";
import cAtividade from "../../controllers/cAtividade";
import cAtivLocalAluno from "../../controllers/cAtivLocalAluno";
import cCoordenador from "../../controllers/cCoordenador";
import cCoordEstagio from "../../controllers/cCoordEstagio";
import cEstagio from "../../controllers/cEstagio";
import cEstagioGrupo from "../../controllers/cEstagioGrupo";
import cGrupo from "../../controllers/cGrupo";
import cUsuario from "../../controllers/cUsuario";
import cJwt from "../../controllers/cJwt";
import cLocal from "../../controllers/cLocal";
import cPrecAtiv from "../../controllers/cPrecAtiv";
import cPreceptor from "../../controllers/cPreceptor";
import cPresenca from "../../controllers/cPresenca";
import checarHabilidade from "../../middleware/habilidades";
import acessoPadrao from "../../middleware/middlewareJwt";

const apiV1 = express.Router();

//LOGIN
apiV1.post("/login", cJwt.login);

//MIDDLEWARE PARA AS ROTAS ABAIXO DESTA LINHA
apiV1.use(acessoPadrao);

//LOGOUT
apiV1.get("/logout", cJwt.logout);

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

//ATIVIDADE
apiV1.post("/atividade", checarHabilidade("edit", "atividade"), cAtividade.criarVarias);
apiV1.get("/atividade", checarHabilidade("read", "atividade"), cAtividade.listar);
apiV1.put("/atividade", checarHabilidade("edit", "atividade"), cAtividade.editarVarias);
apiV1.delete("/atividade/:ids", checarHabilidade("edit", "atividade"), cAtividade.deletarVarias);

//LOCAL
apiV1.post("/local", checarHabilidade("edit", "local"), cLocal.adicionaUm);
apiV1.get("/local", checarHabilidade("read", "local"), cLocal.listar);
apiV1.patch("/local/:id_local", checarHabilidade("edit", "local"), cLocal.mudaNome);
apiV1.delete("/local/:id_local", checarHabilidade("edit", "local"), cLocal.apagaUmPorId);

//ATIV-LOCAL-ALUNO
apiV1.post("/ativ-local-aluno", checarHabilidade("edit", "ativLocalAluno"), cAtivLocalAluno.associarUm);
apiV1.get("/ativ-local-aluno/:id_atividade", checarHabilidade("read", "ativLocalAluno"), cAtivLocalAluno.buscarPorIdAtividade);
apiV1.delete("/ativ-local-aluno", checarHabilidade("edit", "ativLocalAluno"), cAtivLocalAluno.apagaUmPorIdsData);

//PREC-ATIV
apiV1.post("/prec-ativ", checarHabilidade("edit", "prec-ativ"), cPrecAtiv.associarUm);
apiV1.get("/prec-ativ/:id_atividade", checarHabilidade("read", "prec-ativ"), cPrecAtiv.buscarPorIdAtividade);
apiV1.delete("/prec-ativ", checarHabilidade("edit", "prec-ativ"), cPrecAtiv.apagaUmPorIds);

//ALUNO-ATIV
apiV1.get("/aluno-ativ", checarHabilidade("read", "aluno-ativ"), cAlunoAtiv.listarTodas);
apiV1.post("/aluno-ativ", checarHabilidade("edit", "aluno-ativ"), cAlunoAtiv.associarUm);
apiV1.get("/aluno-ativ/:id_atividade", checarHabilidade("read", "aluno-ativ"), cAlunoAtiv.buscarPorIdAtividade);
apiV1.delete("/aluno-ativ", checarHabilidade("edit", "aluno-ativ"), cAlunoAtiv.apagaUm);

//PRESENCA
apiV1.post("/presenca", checarHabilidade("edit", "presenca"), cPresenca.criarUma);
apiV1.get("/presenca", checarHabilidade("read", "presenca"), cPresenca.listarTodas);
apiV1.get("/presenca/aluno/:id_aluno", checarHabilidade("read", "presenca"), cPresenca.buscarPorIdAluno);
apiV1.get("/presenca/atividade/:id_atividade", checarHabilidade("read", "presenca"), cPresenca.buscarPorIdAtividade);
apiV1.delete("/presenca/:id_presenca", checarHabilidade("edit", "presenca"), cPresenca.deletarPorId);

export default apiV1;
