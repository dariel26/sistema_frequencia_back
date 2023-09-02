import request from "supertest";
import app from "../../src/app";

const credencias = { login: "dariel.campos18@icloud.com", senha: "leirad123" };
let token = undefined;

const novoCoordenador = {
  nome: "Novo Coordenador",
  senha: "123",
  login: "coordenador@123.com",
};
let id_usuario = undefined;

describe("Coordenador", () => {
  test("Pegando token", async () => {
    const res = await request(app).post("/api/v1/login").send(credencias);

    expect(res.status).toEqual(200);

    token = res.body;
  });

  test("Adicionando coordenador", async () => {
    const res = await request(app)
      .post("/api/v1/coordenador")
      .set({ token })
      .send({ coordenadores: [novoCoordenador] });

    expect(res.status).toEqual(200);
    expect(
      res.body.find(
        ({ nome, tipo }) =>
          nome === novoCoordenador.nome && tipo === "COORDENADOR"
      ).nome
    ).toEqual(novoCoordenador.nome);

    id_usuario = res.body.find(
      ({ nome, tipo }) =>
        nome === novoCoordenador.nome && tipo === "COORDENADOR"
    ).id_usuario;
  });

  test("Editando coordenador", async () => {
    const res = await request(app)
      .put("/api/v1/coordenador")
      .set({ token })
      .send({
        novosDados: {
          id_usuario,
          ...novoCoordenador,
        },
      });

    expect(res.status).toEqual(200);
  });

  test("Apagando coordenador", async () => {
    const res = await request(app)
      .delete(`/api/v1/coordenador/${[id_usuario].join(",")}`)
      .set({ token });

    expect(res.status).toEqual(200);
  });
});
