import app from "../../src/app";
import request from "supertest";
import { IEstagio } from "../../src/interfaces/IEstagio";
import { ICoordenador } from "../../src/interfaces/ICoordenador";

const c: ICoordenador = {
  nome: "CoordEstagio",
  estado: false,
  papel: "ADMIN",
  email: "esteemaileunico@gmail.com",
  senha: "leirad123",
};

const e: IEstagio = {
  nome: "NomeDeEstagioUnicoTambem",
};

let id_estagio: any;
let id_coordenador: any;

describe("Testando API CoordEstagio", () => {
  test("Adicionando Estagio", async () => {
    return await request(app).post("/api/v1/estagio").send(e).expect(201);
  });

  test("Adicionando Coordenador", async () => {
    return await request(app).post("/api/v1/coordenador").send([c]).expect(201);
  });

  test("Listando Coordenadores", async () => {
    const res = await request(app).get("/api/v1/coordenador").expect(200);
    expect(res.body).toBeInstanceOf(Array);
    id_coordenador = res.body[0].id_coordenador;
  });

  test("Pegando idEstagio ao listar Estagios", async () => {
    const res = await request(app).get("/api/v1/estagio").expect(200);
    id_estagio = res.body[0].id_estagio;
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Associando Coordenador a um Estagio", async () => {
    await request(app)
      .post("/api/v1/coord-estagio")
      .send({ id_coordenador: id_coordenador, id_estagio: id_estagio })
      .expect(201);
  });

  test("Buscando Coordenadores associados ao Estagio", async () => {
    const res = await request(app)
      .get("/api/v1/coord-estagio/" + id_estagio)
      .expect(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(1);
  });

  test("Deletando Associacao de Coordenador e Estagio", async () => {
    await request(app)
      .delete("/api/v1/coord-estagio")
      .send({ id_coordenador: id_coordenador, id_estagio: id_estagio })
      .expect(200);
  });

  test("Deletando Estagio por id", async () => {
    await request(app)
      .delete("/api/v1/estagio/" + id_estagio)
      .expect(200);
  });

  test("Deletando Coordenador por email", async () => {
    await request(app)
      .delete("/api/v1/coordenador/" + c.email)
      .expect(200);
  });
});
