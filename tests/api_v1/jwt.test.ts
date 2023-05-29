import app from "../../src/app";
import request from "supertest";
import { ICoordenador } from "../../src/interfaces/ICoordenador";
import { IPreceptor } from "../../src/interfaces/IPreceptor";
import { IAluno } from "../../src/interfaces/IAluno";

const c: ICoordenador = {
  nome: "TEST JWT",
  estado: false,
  papel: "ADMIN",
  email: "EsteEmaildesteCOOrdenadoreUnico@gmail",
  senha: "leirad123",
};

const p: IPreceptor = {
  nome: "TEST JWT",
  estado: false,
  papel: "ADMIN",
  email: "emaildeTesteSousarEmTEste@gmail",
  senha: "leirad123",
};

const a: IAluno = {
  nome: "TEST JWT",
  estado: false,
  papel: "ADMIN",
  matricula: "12345678910",
  senha: "leirad123",
};
let token: any;

describe("Testando JWT", () => {
  test("Adicionando Coordenador", async () => {
    return await request(app).post("/api/v1/coordenador").send([c]).expect(201);
  });

  test("Adicionando Aluno", async () => {
    return await request(app).post("/api/v1/aluno").send([a]).expect(201);
  });

  test("Adicionando Preceptor", async () => {
    return await request(app).post("/api/v1/preceptor").send([p]).expect(201);
  });

  test("Realizando Login como Coordenandor", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send({ login: c.email, senha: c.senha })
      .expect(200);
    token = res.body;
    expect(res.body).toContain(String());
  });

  test("Realizando Login como Preceptor", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send({ login: p.email, senha: p.senha })
      .expect(200);
    expect(res.body).toContain(String());
  });

  test("Realizando Login como Aluno", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send({ login: a.matricula, senha: a.senha })
      .expect(200);
    expect(res.body).toContain(String());
  });

  test("Realizando Login sem parametros", async () => {
    await request(app).post("/api/v1/login").send({}).expect(400);
  });

  test("Realizando Logout", async () => {
    await request(app).get("/api/v1/logout").set({ token }).expect(200);
  });

  test("Realizando Logout sem token", async () => {
    await request(app).get("/api/v1/logout").expect(400);
  });

  test("Deletando Coordenador por email", async () => {
    await request(app)
      .delete("/api/v1/coordenador/" + c.email)
      .expect(200);
  });

  test("Deletando Preceptor por email", async () => {
    await request(app)
      .delete("/api/v1/preceptor/" + p.email)
      .expect(200);
  });

  test("Deletando Aluno por matricula", async () => {
    await request(app)
      .delete("/api/v1/aluno/" + a.matricula)
      .expect(200);
  });
});
