import app from "../../src/app";
import request from "supertest";
import { ILocal } from "../../src/interfaces/ILocal";
import { IPresenca } from "../../src/interfaces/IPresenca";
import { IAluno } from "../../src/interfaces/IAluno";
import { IAtividade } from "../../src/interfaces/IAtividade";
import { IEstagio } from "../../src/interfaces/IEstagio";

const al: IAluno = {
  nome: "teste",
  estado: false,
  papel: "ALUNO",
  matricula: "123321123321",
  senha: "teste123",
};

const l: ILocal = {
  nome: "localmassa",
  coordenadas: '{ "lat": "321312", "lon": "331230" }',
};

const at: IAtividade = {
  id_estagio: 0,
  nome: "nomeDeEstagioImpossivel",
};

const e: IEstagio = {
  nome: "Umestagiorelativamentenovo",
};

const p: IPresenca = {
  data_hora: new Date(2023, 5, 15, 13, 30),
  estado: true,
  periodo: "matutino",
  id_aluno: 0,
  id_atividade: 0,
  id_local: 0,
  coordenadas: '{ "lat": "321310", "lon": "331228" }',
};

let id_aluno: number;
let id_estagio: number;
let id_atividade: number;
let id_local: number;
let id_presenca: number;

describe("Testando API Presenca", () => {
  test("Adicionando Local", async () => {
    return await request(app).post("/api/v1/local").send(l).expect(201);
  });

  test("Adicionando Estagio", async () => {
    return await request(app).post("/api/v1/estagio").send(e).expect(201);
  });

  test("Adicionando Aluno", async () => {
    return await request(app).post("/api/v1/aluno").send(al).expect(201);
  });

  test("Listando Estagios existentes", async () => {
    const res = await request(app).get("/api/v1/estagio").expect(200);
    id_estagio = res.body[0].id_estagio;
    expect(res.body.length).toEqual(1);
  });

  test("Adicionando Atividade", async () => {
    await request(app)
      .post("/api/v1/atividade/")
      .send({ ...at, id_estagio })
      .expect(201);
  });

  test("Listando Atividades", async () => {
    const res = await request(app).get("/api/v1/atividade-todas").expect(200);
    id_atividade = res.body[0].id_atividade;
    expect(res.body.length).toEqual(1);
  });

  test("Listando todos os Aluno", async () => {
    const res = await request(app).get("/api/v1/aluno-todos").expect(200);
    id_aluno = res.body[0].id_aluno;
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Listando Locais existentes", async () => {
    const res = await request(app).get("/api/v1/local").expect(200);
    id_local = res.body[0].id_local;
    expect(res.body.length).toEqual(1);
  });

  test("Associando Atividade a um Local", async () => {
    await request(app)
      .post("/api/v1/ativ-local")
      .send({
        id_atividade,
        id_local,
        data_hora: new Date(2023, 5, 15, 13, 30)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
      })
      .expect(201);
  });

  test("Adicionando Presenca", async () => {
    await request(app)
      .post("/api/v1/presenca")
      .send({
        ...p,
        id_aluno,
        id_atividade,
        data_hora: p.data_hora.toISOString().slice(0, 19).replace("T", " "),
      })
      .expect(201);
  });

  test("Adicionando Presenca sem atributos", async () => {
    await request(app)
      .post("/api/v1/presenca")
      .send({
        id_aluno,
        id_atividade,
        data_hora: p.data_hora.toISOString().slice(0, 19).replace("T", " "),
      })
      .expect(500);
  });

  test("Adicionando Presenca com coordenadas longes", async () => {
    const res = await request(app)
      .post("/api/v1/presenca")
      .send({
        ...p,
        id_aluno,
        id_atividade,
        data_hora: p.data_hora.toISOString().slice(0, 19).replace("T", " "),
        coordenadas: '{"lat": 1, "lon": 1}',
      })
      .expect(400);
    expect(res.body.badLocal).toEqual(true);
  });

  test("Listando todas as presencas", async () => {
    const res = await request(app).get("/api/v1/presenca").expect(200);
    id_presenca = res.body[0].id_presenca;
    expect(res.body.length).toEqual(1);
  });

  test("Deletando Presenca por id", async () => {
    await request(app)
      .delete("/api/v1/presenca/" + id_presenca)
      .expect(200);
  });

  test("Deletando Associacao de Local e Atividade", async () => {
    await request(app)
      .delete("/api/v1/ativ-local")
      .send({
        id_atividade,
        id_local,
        data_hora: new Date(2023, 5, 15, 13, 30)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
      })
      .expect(200);
  });

  test("Deletando Aluno por matricula", async () => {
    await request(app)
      .delete("/api/v1/aluno/" + al.matricula)
      .expect(200);
  });

  test("Deletando Local por id", async () => {
    await request(app)
      .delete("/api/v1/local/" + id_local)
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
