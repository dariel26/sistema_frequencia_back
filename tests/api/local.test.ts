import request from "supertest";
import app from "../../src/app";

const credencias = { login: "dariel.campos18@icloud.com", senha: "leirad123" };
let token = undefined;

const novoLocal = { nome: "UFSC" };
let id_local = undefined;

describe("Local", () => {
  test("Pegando token", async () => {
    const res = await request(app).post("/api/v1/login").send(credencias);

    expect(res.status).toEqual(200);

    token = res.body;
  });

  test("Adicionando local", async () => {
    const res = await request(app)
      .post("/api/v1/local")
      .set({ token })
      .send({ locais: [novoLocal] });

    expect(res.status).toEqual(200);
    expect(res.body.find(({ nome }) => nome === novoLocal.nome).nome).toEqual(
      novoLocal.nome
    );

    id_local = res.body.find(({ nome }) => nome === novoLocal.nome).id_local;
  });

  test("Editando local", async () => {
    const res = await request(app)
      .put(`/api/v1/local`)
      .set({ token })
      .send({ novosDados: { id_local, nome: "Novo Local" } });

    expect(res.status).toEqual(200);
  });

  test("Apagando local", async () => {
    const res = await request(app)
      .delete(`/api/v1/local/${[id_local].join(",")}`)
      .set({ token });

    expect(res.status).toEqual(200);
  });
});
