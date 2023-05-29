import app from "../../src/app";
import request from "supertest";
import { ICoordenador, PAPEL_ADMIN } from "../../src/interfaces/ICoordenador";

const c: ICoordenador = {
  nome: "Dariel",
  estado: true,
  papel: "COORDENADOR(A)",
  email: "umEmailNovo@gmail.com",
  senha: "leirad123",
};

describe("Testando API Coordenador", () => {
  test("Adicionando Coordenador", async () => {
    return await request(app).post("/api/v1/coordenador").send([c]).expect(201);
  });

  test("Listando Coordenadores", async () => {
    const res = await request(app).get("/api/v1/coordenador").expect(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Adicionando Coordenador sem atributos", async () => {
    return await request(app).post("/api/v1/coordenador").send({}).expect(400);
  });

  test("Adicionando Coordenador email repetido", async () => {
    const res = await request(app)
      .post("/api/v1/coordenador")
      .send([c])
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

  test("Atualizando Coordenador existente por email", async () => {
    await request(app)
      .patch("/api/v1/coordenador/" + c.email)
      .send({ papel: PAPEL_ADMIN, nome: c.nome})
      .expect(200);
  });

  test("Mudando papel de Coordenador existente por email sem enviar estado", async () => {
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
        papel: PAPEL_ADMIN,
      })
    );
  });

  test("Deletando Coordenador por email", async () => {
    await request(app)
      .post("/api/v1/coordenador/delete")
      .send([c.email])
      .expect(200);
  });

  test("Buscando Coordenador inexistente por email", async () => {
    const res = await request(app)
      .get("/api/v1/coordenador/" + c.email)
      .expect(200);
    expect(res.body).toEqual("");
  });
});
