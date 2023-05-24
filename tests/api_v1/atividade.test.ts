import app from "../../src/app";
import request from "supertest";
import { IAtividade } from "../../src/interfaces/IAtividade";
import { IEstagio } from "../../src/interfaces/IEstagio";

const a: IAtividade = {
  id_estagio: 0,
  nome: "nomeDeEstagioImpossivel",
};

const e: IEstagio = {
  nome: "Umestagiorelativamentenovo",
};

let id_estagio: any;
let id_atividade: any;

describe("Testando API Atividade", () => {
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

  test("Adicionando Atividade sem Parametros", async () => {
    await request(app).post("/api/v1/atividade/").send({}).expect(400);
  });

  test("Adicionando Atividade repetida", async () => {
    await request(app).post("/api/v1/atividade/").send(a).expect(500);
  });

  test("Listando Atividades", async () => {
    const res = await request(app).get("/api/v1/atividade").expect(200);
    id_atividade = res.body[0].id_atividade;
    expect(res.body.length).toEqual(1);
  });

  test("Mudando nome da atividade por id", async () => {
    await request(app)
      .patch("/api/v1/atividade/" + id_atividade)
      .send({ nome: "Novo nome atividade" })
      .expect(200);
  });

  test("Verificando mudança de nome da atividade", async () => {
    const res = await request(app).get("/api/v1/atividade").expect(200);
    expect(res.body[0].nome).toEqual("Novo nome atividade");
  });

  test("Listando atividade por id_estagio", async () => {
    const res = await request(app)
      .get("/api/v1/atividade/" + id_estagio)
      .expect(200);
    expect(res.body.length).toEqual(1);
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
