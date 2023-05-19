import app from "../../src/app";
import request from "supertest";
import { IEstagio } from "../../src/interfaces/IEstagio";
import { IGrupo } from "../../src/interfaces/IGrupo";

const e: IEstagio = {
  nome: "nomeDeEstagioImpossivel",
};

const g: IGrupo = {
  nome: "nomeNovoDeGrupo",
};

let id_grupo: any;
let id_estagio: any;

describe("Testando API EstagioGrupo", () => {
  test("Adicionando Estagio", async () => {
    return await request(app).post("/api/v1/estagio").send(e).expect(201);
  });

  test("Listando Estagios existentes", async () => {
    const res = await request(app).get("/api/v1/estagio").expect(200);
    id_estagio = res.body[0].id_estagio;
    expect(res.body.length).toEqual(1);
  });

  test("Adicionando Grupo", async () => {
    return await request(app).post("/api/v1/grupo").send(g).expect(201);
  });

  test("Listando Grupos existentes", async () => {
    const res = await request(app).get("/api/v1/grupo").expect(200);
    id_grupo = res.body[0].id_grupo;
    expect(res.body.length).toEqual(1);
  });

  test("Associando Grupo a um Estagio", async () => {
    await request(app)
      .post("/api/v1/estagio-grupo")
      .send({
        id_estagio,
        id_grupo,
        data: new Date(2023, 5, 15)
          .toISOString()
          .slice(0, 10)
          .replace("T", " "),
      })
      .expect(201);
  });

  test("Buscando Estagios associados aos Grupos", async () => {
    const res = await request(app)
      .get("/api/v1/estagio-grupo/" + id_grupo)
      .expect(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(1);
  });

  test("Deletando Associacao de Estagio e Grupo", async () => {
    await request(app)
      .delete("/api/v1/estagio-grupo")
      .send({
        id_estagio,
        id_grupo,
        data: new Date(2023, 5, 15)
          .toISOString()
          .slice(0, 10)
          .replace("T", " "),
      })
      .expect(200);
  });

  test("Deletando Grupo por id", async () => {
    await request(app)
      .delete("/api/v1/grupo/" + id_grupo)
      .expect(200);
  });

  test("Deletando Estagio por id", async () => {
    await request(app)
      .delete("/api/v1/estagio/" + id_estagio)
      .expect(200);
  });
});
