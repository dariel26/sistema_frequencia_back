import app from "../../src/app";
import request from "supertest";
import { IEstagio } from "../../src/interfaces/IEstagio";

const e: IEstagio = {
  nome: "testeEstagio",
};
let id: any;

describe("Testando API Estagio", () => {
  test("Adicionando Estagio", async () => {
    return await request(app).post("/api/v1/estagio").send(e).expect(201);
  });

  test("Adicionando Estagio sem atributos", async () => {
    return await request(app).post("/api/v1/estagio").send({}).expect(400);
  });

  test("Adicionando Estagio nome repetido", async () => {
    const res = await request(app).post("/api/v1/estagio").send(e).expect(500);
    expect(res.body.existe).toEqual(true);
  });

  test("Listando Estagios existentes", async () => {
    const res = await request(app).get("/api/v1/estagio").expect(200);
    id = res.body[0].id_estagio;
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Mudando nome de Estagio existente por id", async () => {
    await request(app)
      .patch("/api/v1/estagio/" + id)
      .send({ nome: "Novo Nome" })
      .expect(200);
  });

  test("Mudando nome de Estagio existente por id sem enviar nome", async () => {
    await request(app)
      .patch("/api/v1/estagio/" + id)
      .send({})
      .expect(400);
  });

  test("Verificando nome mudado do Estagio", async () => {
    const res = await request(app).get("/api/v1/estagio").expect(200);
    expect(res.body).toEqual(
      expect.arrayContaining([{ nome: "Novo Nome", id_estagio: id }])
    );
  });

  test("Deletando Estagio por id", async () => {
    await request(app)
      .delete("/api/v1/estagio/" + id)
      .expect(200);
  });
});
