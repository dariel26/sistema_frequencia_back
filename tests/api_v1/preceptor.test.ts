import app from "../../src/app";
import request from "supertest";
import { IPreceptor } from "../../src/interfaces/IPreceptor";

const p: IPreceptor = {
  nome: "Bruna Costa",
  estado: true,
  papel: "PRECEPTOR(A)",
  email: "brunaaaaaa@gmailc.odmasda",
  senha: "bruna123",
};

describe("Testando API Preceptor", () => {
  test("Adicionando Preceptor", async () => {
    return await request(app).post("/api/v1/preceptor").send(p).expect(201);
  });

  test("Listando Preceptores", async () => {
    const res = await request(app).get("/api/v1/preceptor").expect(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Adicionando Preceptor sem atributos", async () => {
    return await request(app).post("/api/v1/preceptor").send({}).expect(400);
  });

  test("Adicionando Preceptor email repetido", async () => {
    const res = await request(app)
      .post("/api/v1/preceptor")
      .send(p)
      .expect(500);
    expect(res.body.existe).toEqual(true);
  });

  test("Buscando Preceptor existente por email", async () => {
    const res = await request(app)
      .get("/api/v1/preceptor/" + p.email)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        nome: p.nome,
        email: p.email,
        estado: p.estado ? 1 : 0,
        papel: p.papel,
      })
    );
  });

  test("Mudando nome do Preceptor existente por email", async () => {
    await request(app)
      .patch("/api/v1/preceptor/" + p.email)
      .send({ nome: 'novoNome' })
      .expect(200);
  });

  test("Mudando estado de Preceptor existente por email sem enviar estado", async () => {
    await request(app)
      .patch("/api/v1/preceptor/" + p.email)
      .send({})
      .expect(400);
  });

  test("Verificando estado mudado do Preceptor", async () => {
    const res = await request(app)
      .get("/api/v1/preceptor/" + p.email)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        nome: 'novoNome',
        email: p.email,
        estado: 1,
        papel: p.papel,
      })
    );
  });

  test("Deletando Preceptor por email", async () => {
    const res = await request(app)
      .delete("/api/v1/preceptor/" + p.email)
      .expect(200);
  });

  test("Buscando Preceptor inexistente por email", async () => {
    const res = await request(app)
      .get("/api/v1/preceptor/" + p.email)
      .expect(200);
    expect(res.body).toEqual("");
  });
});
