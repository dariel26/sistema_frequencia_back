import app from "../../src/app";
import request from "supertest";
import { IAtividade } from "../../src/interfaces/IAtividade";
import { ILocal } from "../../src/interfaces/ILocal";
import { IEstagio } from "../../src/interfaces/IEstagio";

const e: IEstagio = {
  nome: "nomeDeEstagioImpossivel",
};

const l: ILocal = {
  nome: "localmassa",
  coordenadas: '{ "lat": "321312", "lon": "331230" }',
};

const a: IAtividade = {
  id_estagio: 0,
  nome: "nomeDeEstagioImpossivel",
};

let id_local: any;
let id_atividade: any;
let id_estagio: any;

describe("Testando API AtivLocal", () => {
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

  test("Adicionando Local", async () => {
    return await request(app).post("/api/v1/local").send(l).expect(201);
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

  test("Buscando Locais associados à Atividade", async () => {
    const res = await request(app)
      .get("/api/v1/ativ-local/" + id_atividade)
      .expect(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(1);
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
