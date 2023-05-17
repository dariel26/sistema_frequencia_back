import express from "express";
import colecaoAluno from "../../colecao/colecaoAluno";
import colecaoAtividade from "../../colecao/colecaoAtividade";
import colecaoCoordenador from "../../colecao/colecaoCoordenador";
import colecaoCoordEstagio from "../../colecao/colecaoCoordEstagio";
import colecaoEstagio from "../../colecao/colecaoEstagio";
import colecaoJwt from "../../colecao/colecaoJwt";
import colecaoPreceptor from "../../colecao/colecaoPreceptor";
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
apiV1.patch("/preceptor/:email", colecaoPreceptor.atualizaEstadoPorEmail);
apiV1.delete("/preceptor/:email", colecaoPreceptor.apagaUmPorEmail);

//ALUNO
apiV1.post("/aluno", colecaoAluno.adicionaUm);
apiV1.get("/aluno/:matricula", colecaoAluno.buscaUmPorMatricula);
apiV1.patch("/aluno/:matricula", colecaoAluno.atualizaEstadoPorMatricula);
apiV1.delete("/aluno/:matricula", colecaoAluno.apagaUmPorMatricula);

//ESTAGIO
apiV1.post("/estagio", colecaoEstagio.adicionaUm);
apiV1.get("/estagio", colecaoEstagio.listar);
apiV1.patch("/estagio/:id", colecaoEstagio.mudaNome);
apiV1.delete("/estagio/:id", colecaoEstagio.apagaUmPorId);

//COORDESTAGIO
apiV1.post("/coord-estagio", colecaoCoordEstagio.associarUm);
apiV1.get("/coord-estagio", colecaoCoordEstagio.listar);
apiV1.delete("/coord-estagio", colecaoCoordEstagio.apagaUmPorIds);

//ATIVIDADE
apiV1.post("/atividade", colecaoAtividade.adicionaUm);
apiV1.get("/atividade/:id_estagio", colecaoAtividade.listarPorIdEstagio);
apiV1.get("/atividade-todas", colecaoAtividade.listar);
apiV1.patch("/atividade/:id", colecaoAtividade.mudaNome);
apiV1.delete("/atividade/:id", colecaoAtividade.apagaUmPorId);

//LOGIN
apiV1.post("/login", colecaoJwt.login);
apiV1.get("/logout", acessoApi, colecaoJwt.logout);
export default apiV1;
