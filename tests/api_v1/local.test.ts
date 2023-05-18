import app from "../../src/app";
import request from "supertest";
import { ILocal } from "../../src/interfaces/ILocal";

const l: ILocal = {
  nome: "localmassa",
  coordenadas: '{ "lat": "321312", "lon": "331230" }',
};

let id_local: any;

describe("Testando API Local", () => {
  test("Adicionando Local", async () => {
    return await request(app).post("/api/v1/local").send(l).expect(201);
  });

  test("Adicionando Local sem atributos", async () => {
    return await request(app).post("/api/v1/local").send({}).expect(400);
  });

  test("Adicionando Local nome repetido", async () => {
    const res = await request(app).post("/api/v1/local").send(l).expect(500);
    expect(res.body.existe).toEqual(true);
  });

  test("Listando Locais existentes", async () => {
    const res = await request(app).get("/api/v1/local").expect(200);
    id_local = res.body[0].id_local;
    expect(res.body.length).toEqual(1);
  });

  test("Mudando nome de Local existente por id", async () => {
    await request(app)
      .patch("/api/v1/local/" + id_local)
      .send({ nome: "Novo Nome", coordenadas: '{ "lat": "2", "lon": "3" }' })
      .expect(200);
  });

  test("Mudando nome de Local existente por id sem enviar coordenadas", async () => {
    await request(app)
      .patch("/api/v1/local/" + id_local)
      .send({ nome: "Novo Nome" })
      .expect(400);
  });

  test("Verificando nome mudado do Local", async () => {
    const res = await request(app).get("/api/v1/local").expect(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        {
          nome: "Novo Nome",
          id_local: id_local,
          coordenadas: { lat: "2", lon: "3" },
        },
      ])
    );
  });

  test("Deletando Local por id", async () => {
    await request(app)
      .delete("/api/v1/local/" + id_local)
      .expect(200);
  });
});
