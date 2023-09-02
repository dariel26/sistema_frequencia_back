import request from "supertest";
import app from "../../src/app";

const credencias = { login: "dariel.campos18@icloud.com", senha: "leirad123" };
let token = undefined;

const novoPreceptor = {
  nome: "Novo Preceptor",
  senha: "123",
  login: "preceptor@dada.com",
};
let id_usuario = undefined;

describe("Preceptor", () => {
  test("Pegando token", async () => {
    const res = await request(app).post("/api/v1/login").send(credencias);

    expect(res.status).toEqual(200);

    token = res.body;
  });

  test("Adicionando preceptor", async () => {
    const res = await request(app)
      .post("/api/v1/preceptor")
      .set({ token })
      .send({ preceptores: [novoPreceptor] });

    expect(res.status).toEqual(200);
    expect(
      res.body.find(
        ({ nome, tipo }) => nome === novoPreceptor.nome && tipo === "PRECEPTOR"
      ).nome
    ).toEqual(novoPreceptor.nome);

    id_usuario = res.body.find(
      ({ nome, tipo }) => nome === novoPreceptor.nome && tipo === "PRECEPTOR"
    ).id_usuario;
  });

  test("Editando preceptor", async () => {
    const res = await request(app)
      .put("/api/v1/preceptor")
      .set({ token })
      .send({
        novosDados: {
          id_usuario,
          ...novoPreceptor,
        },
      });

    expect(res.status).toEqual(200);
  });

  test("Apagando preceptor", async () => {
    const res = await request(app)
      .delete(`/api/v1/preceptor/${[id_usuario].join(",")}`)
      .set({ token });

    expect(res.status).toEqual(200);
  });
});
