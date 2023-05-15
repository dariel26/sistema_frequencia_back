import app from "../../src/app";
import request from "supertest";
import { ICoordenador } from "../../src/interfaces/ICoordenador";

const c: ICoordenador = {
  nome: "Dariel",
  estado: false,
  papel: "ADMIN",
  email: "asdfgh.daac@gmail.com",
  senha: "leirad123",
};

describe("Testando API Coordenador", () => {
  test("Adicionando Coordenador", async () => {
    return await request(app).post("/api/v1/coordenador").send(c).expect(201);
  });

  test("Adicionando Coordenador sem atributos", async () => {
    return await request(app).post("/api/v1/coordenador").send({}).expect(400);
  });

  test("Adicionando Coordenador email repetido", async () => {
    const res = await request(app)
      .post("/api/v1/coordenador")
      .send(c)
      .expect(500);
    expect(res.body.existe).toEqual(true);
  });

  test("Buscando Coordenador existente por email", async () => {
    const res = await request(app)
      .get("/api/v1/coordenador/" + c.email)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        nome: c.nome,
        email: c.email,
        estado: c.estado ? 1 : 0,
        papel: c.papel,
      })
    );
  });

  test("Mudando estado de Coordenador existente por email", async () => {
    await request(app)
      .patch("/api/v1/coordenador/" + c.email)
      .send({ estado: true })
      .expect(200);
  });

  test("Mudando estado de Coordenador existente por email sem enviar estado", async () => {
    await request(app)
      .patch("/api/v1/coordenador/" + c.email)
      .send({})
      .expect(400);
  });

  test("Verificando estado mudado do Coordenador", async () => {
    const res = await request(app)
      .get("/api/v1/coordenador/" + c.email)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        nome: c.nome,
        email: c.email,
        estado: 1,
        papel: c.papel,
      })
    );
  });

  test("Deletando Coordenador por email", async () => {
    await request(app)
      .delete("/api/v1/coordenador/" + c.email)
      .expect(200);
  });

  test("Buscando Coordenador inexistente por email", async () => {
    const res = await request(app)
      .get("/api/v1/coordenador/" + c.email)
      .expect(200);
    expect(res.body).toEqual("");
  });
});
