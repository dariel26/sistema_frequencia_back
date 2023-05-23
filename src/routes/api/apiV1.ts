import express from "express";
import colecaoAluno from "../../colecao/colecaoAluno";
import colecaoAlunoAtiv from "../../colecao/colecaoAlunoAtiv";
import colecaoAtividade from "../../colecao/colecaoAtividade";
import colecaoAtivLocal from "../../colecao/colecaoAtivLocal";
import colecaoCoordenador from "../../colecao/colecaoCoordenador";
import colecaoCoordEstagio from "../../colecao/colecaoCoordEstagio";
import colecaoEstagio from "../../colecao/colecaoEstagio";
import colecaoEstagioGrupo from "../../colecao/colecaoEstagioGrupo";
import colecaoGrupo from "../../colecao/colecaoGrupo";
import colecaoJwt from "../../colecao/colecaoJwt";
import colecaoLocal from "../../colecao/colecaoLocal";
import colecaoPrecAtiv from "../../colecao/colecaoPrecAtiv";
import colecaoPreceptor from "../../colecao/colecaoPreceptor";
import colecaoPresenca from "../../colecao/colecaoPresenca";
import acessoApi from "../../middleware/middlewareJwt";

const apiV1 = express.Router();

//COORDENADOR
apiV1.post("/coordenador", colecaoCoordenador.adicionaUm);
apiV1.get("/coordenador/:email", colecaoCoordenador.buscaUmPorEmail);
apiV1.get("/coordenador-todos", colecaoCoordenador.listarTodos);
apiV1.patch("/coordenador/:email", colecaoCoordenador.atualizaEstadoPorEmail);
apiV1.delete("/coordenador/:email", colecaoCoordenador.apagaUmPorEmail);

//PRECEPTOR
apiV1.post("/preceptor", colecaoPreceptor.adicionaUm);
apiV1.get("/preceptor/:email", colecaoPreceptor.buscaUmPorEmail);
apiV1.get("/preceptor-todos", colecaoPreceptor.listarTodos);
apiV1.patch("/preceptor/:email", colecaoPreceptor.atualizaEstadoPorEmail);
apiV1.delete("/preceptor/:email", colecaoPreceptor.apagaUmPorEmail);

//ALUNO
apiV1.post("/aluno", colecaoAluno.adicionaUm);
apiV1.get("/aluno/:matricula", colecaoAluno.buscaUmPorMatricula);
apiV1.get("/aluno-todos", colecaoAluno.listarTodos);
apiV1.patch("/aluno/:matricula", colecaoAluno.atualizaEstadoPorMatricula);
apiV1.delete("/aluno/:matricula", colecaoAluno.apagaUmPorMatricula);

//ESTAGIO
apiV1.post("/estagio", colecaoEstagio.adicionaUm);
apiV1.get("/estagio", colecaoEstagio.listar);
apiV1.patch("/estagio/:id", colecaoEstagio.mudaNome);
apiV1.delete("/estagio/:id", colecaoEstagio.apagaUmPorId);

//GRUPO
apiV1.post("/grupo", colecaoGrupo.adicionaUm);
apiV1.get("/grupo", colecaoGrupo.listar);
apiV1.patch("/grupo/:id_grupo", colecaoGrupo.mudaNome);
apiV1.delete("/grupo/:id_grupo", colecaoGrupo.apagaUmPorId);

//COORD-ESTAGIO
apiV1.post("/coord-estagio", colecaoCoordEstagio.associarUm);
apiV1.get("/coord-estagio/:id_estagio", colecaoCoordEstagio.buscaPorIdEstagio);
apiV1.delete("/coord-estagio", colecaoCoordEstagio.apagaUmPorIds);

//ATIVIDADE
apiV1.post("/atividade", colecaoAtividade.adicionaUm);
apiV1.get("/atividade/:id_estagio", colecaoAtividade.listarPorIdEstagio);
apiV1.get("/atividade-todas", colecaoAtividade.listar);
apiV1.patch("/atividade/:id", colecaoAtividade.mudaNome);
apiV1.delete("/atividade/:id", colecaoAtividade.apagaUmPorId);

//LOCAL
apiV1.post("/local", colecaoLocal.adicionaUm);
apiV1.get("/local", colecaoLocal.listar);
apiV1.patch("/local/:id_local", colecaoLocal.mudaNome);
apiV1.delete("/local/:id_local", colecaoLocal.apagaUmPorId);

//ATIV-LOCAL
apiV1.post("/ativ-local", colecaoAtivLocal.associarUm);
apiV1.get("/ativ-local/:id_atividade", colecaoAtivLocal.buscarPorIdAtividade);
apiV1.delete("/ativ-local", colecaoAtivLocal.apagaUmPorIdsData);

//PREC-ATIV
apiV1.post("/prec-ativ", colecaoPrecAtiv.associarUm);
apiV1.get("/prec-ativ/:id_atividade", colecaoPrecAtiv.buscarPorIdAtividade);
apiV1.delete("/prec-ativ", colecaoPrecAtiv.apagaUmPorIds);

//ALUNO-ATIV
apiV1.post("/aluno-ativ", colecaoAlunoAtiv.associarUm);
apiV1.get("/aluno-ativ/:id_atividade", colecaoAlunoAtiv.buscarPorIdAtividade);
apiV1.delete("/aluno-ativ", colecaoAlunoAtiv.apagaUm);

//ESTAGIO-GRUPO
apiV1.post("/estagio-grupo", colecaoEstagioGrupo.associarUm);
apiV1.get("/estagio-grupo/:id_grupo", colecaoEstagioGrupo.buscarPorIdGrupo);
apiV1.delete("/estagio-grupo", colecaoEstagioGrupo.apagaUmPorIdsData);

//PRESENCA
apiV1.post("/presenca", colecaoPresenca.criarUma);
apiV1.get("/presenca", colecaoPresenca.listarTodas);
apiV1.get("/presenca-aluno/:id_aluno", colecaoPresenca.buscarPorIdAluno);
apiV1.get("/presenca-atividade/:id_atividade", colecaoPresenca.buscarPorIdAtividade);
apiV1.delete("/presenca/:id_presenca", colecaoPresenca.deletarPorId);

//LOGIN
apiV1.post("/login", colecaoJwt.login);
apiV1.get("/logout", acessoApi, colecaoJwt.logout);
export default apiV1;
