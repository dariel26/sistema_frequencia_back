require("dotenv").config();
import express from "express";
import cAluno from "../../controllers/cAluno";
import cAlunoAtiv from "../../controllers/cAlunoAtiv";
import cAtividade from "../../controllers/cAtividade";
import cAtivLocal from "../../controllers/cAtivLocal";
import cCoordenador from "../../controllers/cCoordenador";
import cCoordEstagio from "../../controllers/cCoordEstagio";
import cEstagio from "../../controllers/cEstagio";
import cEstagioGrupo from "../../controllers/cEstagioGrupo";
import cGrupo from "../../controllers/cGrupo";
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

//MIDDLEWARE
apiV1.use(acessoPadrao);

//LOGOUT
apiV1.get("/logout", cJwt.logout);

//COORDENADOR
apiV1.post("/coordenador",checarHabilidade("edit", "coordenador"), cCoordenador.adicionaUm);
apiV1.get("/coordenador/:email",checarHabilidade("read", "coordenador"), cCoordenador.buscaUmPorEmail);
apiV1.get("/coordenador", checarHabilidade("read", "coordenador"), cCoordenador.listarTodos);
apiV1.patch("/coordenador/:email", checarHabilidade("edit", "coordenador"),cCoordenador.atualizaEstadoPorEmail);
apiV1.delete("/coordenador/:email", checarHabilidade("edit", "coordenador"),cCoordenador.apagaUmPorEmail);

//PRECEPTOR
apiV1.post("/preceptor", checarHabilidade("edit", "preceptor"), cPreceptor.adicionaUm);
apiV1.get("/preceptor/:email", checarHabilidade("read", "preceptor"), cPreceptor.buscaUmPorEmail);
apiV1.get("/preceptor", checarHabilidade("read", "preceptor"),cPreceptor.listarTodos);
apiV1.patch("/preceptor/:email", checarHabilidade("edit", "preceptor"), cPreceptor.atualizaEstadoPorEmail);
apiV1.delete("/preceptor/:email", checarHabilidade("edit", "preceptor"), cPreceptor.apagaUmPorEmail);

//ALUNO
apiV1.post("/aluno", checarHabilidade("edit", "aluno"), cAluno.adicionaUm);
apiV1.get("/aluno/:matricula", checarHabilidade("read", "aluno"), cAluno.buscaUmPorMatricula);
apiV1.get("/aluno", checarHabilidade("read", "aluno"), cAluno.listarTodos);
apiV1.patch("/aluno/:matricula", checarHabilidade("edit", "aluno"), cAluno.atualizaEstadoPorMatricula);
apiV1.delete("/aluno/:matricula", checarHabilidade("edit", "aluno"), cAluno.apagaUmPorMatricula);

//ESTAGIO
apiV1.post("/estagio", checarHabilidade("edit", "estagio"), cEstagio.adicionaUm);
apiV1.get("/estagio", checarHabilidade("read", "estagio"), cEstagio.listar);
apiV1.patch("/estagio/:id", checarHabilidade("edit", "estagio"), cEstagio.mudaNome);
apiV1.delete("/estagio/:id", checarHabilidade("edit", "estagio"), cEstagio.apagaUmPorId);

//GRUPO
apiV1.post("/grupo", checarHabilidade("edit", "grupo"), cGrupo.adicionaUm);
apiV1.get("/grupo", checarHabilidade("read", "grupo"), cGrupo.listar);
apiV1.patch("/grupo/:id_grupo", checarHabilidade("edit", "grupo"), cGrupo.mudaNome);
apiV1.delete("/grupo/:id_grupo", checarHabilidade("edit", "grupo"), cGrupo.apagaUmPorId);

//COORD-ESTAGIO
apiV1.post("/coord-estagio", checarHabilidade("edit", "coord-estagio"), cCoordEstagio.associarUm);
apiV1.get("/coord-estagio/:id_estagio", checarHabilidade("read", "coord-estagio"), cCoordEstagio.buscaPorIdEstagio);
apiV1.delete("/coord-estagio", checarHabilidade("edit", "coord-estagio"), cCoordEstagio.apagaUmPorIds);

//ATIVIDADE
apiV1.post("/atividade", checarHabilidade("edit", "atividade"), cAtividade.adicionaUm);
apiV1.get("/atividade/:id_estagio", checarHabilidade("read", "atividade"), cAtividade.listarPorIdEstagio);
apiV1.get("/atividade", checarHabilidade("read", "atividade"), cAtividade.listar);
apiV1.patch("/atividade/:id", checarHabilidade("edit", "atividade"), cAtividade.mudaNome);
apiV1.delete("/atividade/:id", checarHabilidade("edit", "atividade"), cAtividade.apagaUmPorId);

//LOCAL
apiV1.post("/local", checarHabilidade("edit", "local"), cLocal.adicionaUm);
apiV1.get("/local", checarHabilidade("read", "local"), cLocal.listar);
apiV1.patch("/local/:id_local", checarHabilidade("edit", "local"), cLocal.mudaNome);
apiV1.delete("/local/:id_local", checarHabilidade("edit", "local"), cLocal.apagaUmPorId);

//ATIV-LOCAL
apiV1.post("/ativ-local", checarHabilidade("edit", "ativ-local"), cAtivLocal.associarUm);
apiV1.get("/ativ-local/:id_atividade", checarHabilidade("read", "ativ-local"), cAtivLocal.buscarPorIdAtividade);
apiV1.delete("/ativ-local", checarHabilidade("edit", "ativ-local"), cAtivLocal.apagaUmPorIdsData);

//PREC-ATIV
apiV1.post("/prec-ativ", checarHabilidade("edit", "prec-ativ"), cPrecAtiv.associarUm);
apiV1.get("/prec-ativ/:id_atividade", checarHabilidade("read", "prec-ativ"), cPrecAtiv.buscarPorIdAtividade);
apiV1.delete("/prec-ativ", checarHabilidade("edit", "prec-ativ"), cPrecAtiv.apagaUmPorIds);

//ALUNO-ATIV
apiV1.get("/aluno-ativ", checarHabilidade("read", "aluno-ativ"), cAlunoAtiv.listarTodas);
apiV1.post("/aluno-ativ", checarHabilidade("edit", "aluno-ativ"), cAlunoAtiv.associarUm);
apiV1.get("/aluno-ativ/:id_atividade", checarHabilidade("read", "aluno-ativ"), cAlunoAtiv.buscarPorIdAtividade);
apiV1.delete("/aluno-ativ", checarHabilidade("edit", "aluno-ativ"), cAlunoAtiv.apagaUm);

//ESTAGIO-GRUPO
apiV1.post("/estagio-grupo", checarHabilidade("edit", "estagio-grupo"), cEstagioGrupo.associarUm);
apiV1.get("/estagio-grupo/:id_grupo", checarHabilidade("read", "estagio-grupo"), cEstagioGrupo.buscarPorIdGrupo);
apiV1.delete("/estagio-grupo", checarHabilidade("edit", "estagio-grupo"), cEstagioGrupo.apagaUmPorIdsData);

//PRESENCA
apiV1.post("/presenca", checarHabilidade("edit", "presenca"), cPresenca.criarUma);
apiV1.get("/presenca", checarHabilidade("read", "presenca"), cPresenca.listarTodas);
apiV1.get("/presenca/aluno/:id_aluno", checarHabilidade("read", "presenca"), cPresenca.buscarPorIdAluno);
apiV1.get("/presenca/atividade/:id_atividade", checarHabilidade("read", "presenca"), cPresenca.buscarPorIdAtividade);
apiV1.delete("/presenca/:id_presenca", checarHabilidade("edit", "presenca"), cPresenca.deletarPorId);

export default apiV1;
