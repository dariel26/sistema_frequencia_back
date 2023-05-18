import app from "../../src/app";
import request from "supertest";
import { IGrupo } from "../../src/interfaces/IGrupo";

const g: IGrupo = {
  nome: "nomeNovoDeGrupo",
};

let id_grupo: any;

describe("Testando API Grupo", () => {
  test("Adicionando Grupo", async () => {
    return await request(app).post("/api/v1/grupo").send(g).expect(201);
  });

  test("Adicionando Grupo sem atributos", async () => {
    return await request(app).post("/api/v1/grupo").send({}).expect(400);
  });

  test("Adicionando Grupo nome repetido", async () => {
    const res = await request(app).post("/api/v1/grupo").send(g).expect(500);
    expect(res.body.existe).toEqual(true);
  });

  test("Listando Grupos existentes", async () => {
    const res = await request(app).get("/api/v1/grupo").expect(200);
    id_grupo = res.body[0].id_grupo;
    expect(res.body.length).toEqual(1);
  });

  test("Mudando nome de Grupo existente por id", async () => {
    await request(app)
      .patch("/api/v1/grupo/" + id_grupo)
      .send({ nome: "Novo Nome" })
      .expect(200);
  });

  test("Mudando nome de Grupo existente por id sem enviar nome", async () => {
    await request(app)
      .patch("/api/v1/grupo/" + id_grupo)
      .send({})
      .expect(400);
  });

  test("Verificando nome mudado do Grupo", async () => {
    const res = await request(app).get("/api/v1/grupo").expect(200);
    expect(res.body).toEqual(
      expect.arrayContaining([{ nome: "Novo Nome", id_grupo: id_grupo }])
    );
  });

  test("Deletando Grupo por id", async () => {
    await request(app)
      .delete("/api/v1/grupo/" + id_grupo)
      .expect(200);
  });
});
