import app from "../../src/app";
import request from "supertest";
import { IPreceptor } from "../../src/interfaces/IPreceptor";
import { IAtividade } from "../../src/interfaces/IAtividade";
import { IEstagio } from "../../src/interfaces/IEstagio";

const p: IPreceptor = {
  nome: "PrecNovo",
  estado: false,
  papel: "PROFESSOR(A)",
  email: "novoprec@gmail.com",
  senha: "leirad123",
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
let id_preceptor: any;

describe("Testando API PrecAtiv", () => {
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

  test("Adicionando Preceptor", async () => {
    return await request(app).post("/api/v1/preceptor").send(p).expect(201);
  });

  test("Listando Preceptores", async () => {
    const res = await request(app).get("/api/v1/preceptor").expect(200);
    id_preceptor = res.body[0].id_preceptor;
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Associando Preceptor a uma Atividade", async () => {
    await request(app)
      .post("/api/v1/prec-ativ")
      .send({ id_atividade, id_preceptor })
      .expect(201);
  });

  test("Buscando Preceptores associados à Atividade", async () => {
    const res = await request(app)
      .get("/api/v1/prec-ativ/" + id_atividade)
      .expect(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(1);
  });

  test("Deletando Associacao de Preceptor e Atividade", async () => {
    await request(app)
      .delete("/api/v1/prec-ativ")
      .send({ id_atividade, id_preceptor })
      .expect(200);
  });

  test("Deletando Preceptor por email", async () => {
    await request(app)
      .delete("/api/v1/preceptor/" + p.email)
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
