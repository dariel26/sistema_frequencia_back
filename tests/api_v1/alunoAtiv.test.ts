import app from "../../src/app";
import request from "supertest";
import { IAtividade } from "../../src/interfaces/IAtividade";
import { IEstagio } from "../../src/interfaces/IEstagio";
import { IAluno } from "../../src/interfaces/IAluno";

const al: IAluno = {
  nome: "teste",
  estado: false,
  papel: "ALUNO",
  matricula: "123321123321",
  senha: "teste123",
};

const a: IAtividade = {
  id_estagio: 0,
  nome: "nomeDeEstagioImpossivel",
};

const e: IEstagio = {
  nome: "Umestagiorelativamentenovo",
};

let id_estagio: any;
let id_atividade: any;
let id_aluno: any;

describe("Testando API AlunoAtiv", () => {
  test("Adicionando Estagio", async () => {
    return await request(app).post("/api/v1/estagio").send(e).expect(201);
  });

  test("Listando Estagios existentes", async () => {
    const res = await request(app).get("/api/v1/estagio").expect(200);
    id_estagio = res.body[0].id_estagio;
    expect(res.body.length).toEqual(1);
  });

  test("Adicionando Atividade", async () => {
    await request(app)
      .post("/api/v1/atividade/")
      .send({ ...a, id_estagio })
      .expect(201);
  });

  test("Listando Atividades", async () => {
    const res = await request(app).get("/api/v1/atividade").expect(200);
    id_atividade = res.body[0].id_atividade;
    expect(res.body.length).toEqual(1);
  });

  test("Adicionando Aluno", async () => {
    return await request(app).post("/api/v1/aluno").send(al).expect(201);
  });

  test("Listando todos os Aluno", async () => {
    const res = await request(app).get("/api/v1/aluno").expect(200);
    id_aluno = res.body[0].id_aluno;
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Associando Aluno a uma Atividade", async () => {
    await request(app)
      .post("/api/v1/aluno-ativ")
      .send({ id_atividade, id_aluno })
      .expect(201);
  });

  test("Listando todos Alunos associados à Atividade", async () => {
    const res = await request(app).get("/api/v1/aluno-ativ").expect(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(1);
  });

  test("Buscando Alunos associados à Atividade", async () => {
    const res = await request(app)
      .get("/api/v1/aluno-ativ/" + id_atividade)
      .expect(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(1);
  });

  test("Deletando Várias Associacoes de Aluno e Atividade", async () => {
    await request(app)
      .delete("/api/v1/aluno-ativ")
      .send({ id_atividade, id_aluno })
      .expect(200);
  });

  test("Deletando Aluno por matricula", async () => {
    await request(app)
      .delete("/api/v1/aluno/" + al.matricula)
      .expect(200);
  });

  test("Apagando atividade por id", async () => {
    await request(app)
      .delete("/api/v1/atividade/" + id_atividade)
      .expect(200);
  });

  test("Deletando Estagio por id", async () => {
    await request(app)
      .delete("/api/v1/estagio/" + id_estagio)
      .expect(200);
  });
});
