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
import mHabilidade from "../../middleware/habilidades";
import acessoPadrao from "../../middleware/middlewareJwt";

const apiV1 = express.Router();

//COORDENADOR
apiV1.post("/coordenador",[acessoPadrao, mHabilidade.editarCoordenador], cCoordenador.adicionaUm);
apiV1.get("/coordenador/:email",[acessoPadrao, mHabilidade.lerCoordenador], cCoordenador.buscaUmPorEmail);
apiV1.get("/coordenador-todos", [acessoPadrao, mHabilidade.lerCoordenador], cCoordenador.listarTodos);
apiV1.patch("/coordenador/:email", [acessoPadrao, mHabilidade.editarCoordenador],cCoordenador.atualizaEstadoPorEmail);
apiV1.delete("/coordenador/:email", [acessoPadrao, mHabilidade.editarCoordenador],cCoordenador.apagaUmPorEmail);

//PRECEPTOR
apiV1.post("/preceptor", [acessoPadrao, mHabilidade.editarPreceptor], cPreceptor.adicionaUm);
apiV1.get("/preceptor/:email", [acessoPadrao, mHabilidade.lerPreceptor], cPreceptor.buscaUmPorEmail);
apiV1.get("/preceptor-todos", [acessoPadrao, mHabilidade.lerPreceptor],cPreceptor.listarTodos);
apiV1.patch("/preceptor/:email", [acessoPadrao, mHabilidade.editarPreceptor], cPreceptor.atualizaEstadoPorEmail);
apiV1.delete("/preceptor/:email", [acessoPadrao, mHabilidade.editarPreceptor], cPreceptor.apagaUmPorEmail);

//ALUNO
apiV1.post("/aluno", [acessoPadrao, mHabilidade.editarAluno], cAluno.adicionaUm);
apiV1.get("/aluno/:matricula", [acessoPadrao, mHabilidade.lerAluno], cAluno.buscaUmPorMatricula);
apiV1.get("/aluno-todos", [acessoPadrao, mHabilidade.lerAluno], cAluno.listarTodos);
apiV1.patch("/aluno/:matricula", [acessoPadrao, mHabilidade.editarAluno], cAluno.atualizaEstadoPorMatricula);
apiV1.delete("/aluno/:matricula", cAluno.apagaUmPorMatricula);

//ESTAGIO
apiV1.post("/estagio", cEstagio.adicionaUm);
apiV1.get("/estagio", cEstagio.listar);
apiV1.patch("/estagio/:id", cEstagio.mudaNome);
apiV1.delete("/estagio/:id", cEstagio.apagaUmPorId);

//GRUPO
apiV1.post("/grupo", cGrupo.adicionaUm);
apiV1.get("/grupo", cGrupo.listar);
apiV1.patch("/grupo/:id_grupo", cGrupo.mudaNome);
apiV1.delete("/grupo/:id_grupo", cGrupo.apagaUmPorId);

//COORD-ESTAGIO
apiV1.post("/coord-estagio", cCoordEstagio.associarUm);
apiV1.get("/coord-estagio/:id_estagio", cCoordEstagio.buscaPorIdEstagio);
apiV1.delete("/coord-estagio", cCoordEstagio.apagaUmPorIds);

//ATIVIDADE
apiV1.post("/atividade", cAtividade.adicionaUm);
apiV1.get("/atividade/:id_estagio", cAtividade.listarPorIdEstagio);
apiV1.get("/atividade-todas", cAtividade.listar);
apiV1.patch("/atividade/:id", cAtividade.mudaNome);
apiV1.delete("/atividade/:id", cAtividade.apagaUmPorId);

//LOCAL
apiV1.post("/local", cLocal.adicionaUm);
apiV1.get("/local", cLocal.listar);
apiV1.patch("/local/:id_local", cLocal.mudaNome);
apiV1.delete("/local/:id_local", cLocal.apagaUmPorId);

//ATIV-LOCAL
apiV1.post("/ativ-local", cAtivLocal.associarUm);
apiV1.get("/ativ-local/:id_atividade", cAtivLocal.buscarPorIdAtividade);
apiV1.delete("/ativ-local", cAtivLocal.apagaUmPorIdsData);

//PREC-ATIV
apiV1.post("/prec-ativ", cPrecAtiv.associarUm);
apiV1.get("/prec-ativ/:id_atividade", cPrecAtiv.buscarPorIdAtividade);
apiV1.delete("/prec-ativ", cPrecAtiv.apagaUmPorIds);

//ALUNO-ATIV
apiV1.get("/aluno-ativ", cAlunoAtiv.listarTodas);
apiV1.post("/aluno-ativ", cAlunoAtiv.associarUm);
apiV1.get("/aluno-ativ/:id_atividade", cAlunoAtiv.buscarPorIdAtividade);
apiV1.delete("/aluno-ativ", cAlunoAtiv.apagaUm);

//ESTAGIO-GRUPO
apiV1.post("/estagio-grupo", cEstagioGrupo.associarUm);
apiV1.get("/estagio-grupo/:id_grupo", cEstagioGrupo.buscarPorIdGrupo);
apiV1.delete("/estagio-grupo", cEstagioGrupo.apagaUmPorIdsData);

//PRESENCA
apiV1.post("/presenca", cPresenca.criarUma);
apiV1.get("/presenca", cPresenca.listarTodas);
apiV1.get("/presenca-aluno/:id_aluno", cPresenca.buscarPorIdAluno);
apiV1.get("/presenca-atividade/:id_atividade", cPresenca.buscarPorIdAtividade);
apiV1.delete("/presenca/:id_presenca", cPresenca.deletarPorId);

//LOGIN
apiV1.post("/login", cJwt.login);
apiV1.get("/logout", acessoPadrao, cJwt.logout);
export default apiV1;
