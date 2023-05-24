import app from "../../src/app";
import request from "supertest";
import { IAluno } from "../../src/interfaces/IAluno";

const a: IAluno = {
  nome: "teste",
  estado: false,
  papel: "ALUNO(A)",
  matricula: "123321123321",
  senha: "teste123",
};

describe("Testando API Aluno", () => {
  test("Adicionando Aluno", async () => {
    return await request(app).post("/api/v1/aluno").send(a).expect(201);
  });

  test("Listando todos os Aluno", async () => {
    const res = await request(app).get("/api/v1/aluno-todos").expect(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Adicionando Aluno sem atributos", async () => {
    return await request(app).post("/api/v1/aluno").send({}).expect(400);
  });

  test("Adicionando Aluno matricula repetida", async () => {
    const res = await request(app).post("/api/v1/aluno").send(a).expect(500);
    expect(res.body.existe).toEqual(true);
  });

  test("Buscando Aluno existente por matricula", async () => {
    const res = await request(app)
      .get("/api/v1/aluno/" + a.matricula)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        nome: a.nome,
        matricula: a.matricula,
        estado: a.estado ? 1 : 0,
        papel: a.papel,
      })
    );
  });

  test("Mudando estado de Aluno existente por matricula", async () => {
    await request(app)
      .patch("/api/v1/aluno/" + a.matricula)
      .send({ estado: true })
      .expect(200);
  });

  test("Mudando estado de Aluno existente por matricula sem enviar estado", async () => {
    await request(app)
      .patch("/api/v1/aluno/" + a.matricula)
      .send({})
      .expect(400);
  });

  test("Verificando estado mudado do Aluno", async () => {
    const res = await request(app)
      .get("/api/v1/aluno/" + a.matricula)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        nome: a.nome,
        matricula: a.matricula,
        estado: 1,
        papel: a.papel,
      })
    );
  });

  test("Deletando Aluno por matricula", async () => {
    await request(app)
      .delete("/api/v1/aluno/" + a.matricula)
      .expect(200);
  });

  test("Buscando Aluno inexistente por matricula", async () => {
    const res = await request(app)
      .get("/api/v1/aluno/" + a.matricula)
      .expect(200);
    expect(res.body).toEqual("");
  });
});
