import request from "supertest";
import app from "../../src/app";

const credencias = { login: "dariel.campos18@icloud.com", senha: "leirad123" };
let token = undefined;

const novoEstagio = { nome: "MFC Saúde Geral" };
let id_estagio = undefined;

describe("Estagio", () => {
  test("Pegando token", async () => {
    const res = await request(app).post("/api/v1/login").send(credencias);

    expect(res.status).toEqual(200);

    token = res.body;
  });

  test("Adicionando estagio", async () => {
    const res = await request(app)
      .post("/api/v1/estagio")
      .set({ token })
      .send({ estagios: [novoEstagio] });

    expect(res.status).toEqual(200);
    expect(res.body.find(({ nome_estagio }) => nome_estagio === novoEstagio.nome).nome_estagio).toEqual(
      novoEstagio.nome
    );

    id_estagio = res.body.find(
      ({ nome_estagio }) => nome_estagio === novoEstagio.nome
    ).id_estagio;
  });

  test("Editando Estagio", async () => {
    const res = await request(app)
      .put(`/api/v1/estagio`)
      .set({ token })
      .send({ novosDados: { id_estagio, nome: "Novo Estagio" } });

    expect(res.status).toEqual(200);
  });

  test("Apagando Estagio", async () => {
    const res = await request(app)
      .delete(`/api/v1/estagio/${[id_estagio].join(",")}`)
      .set({ token });

    expect(res.status).toEqual(200);
  });
});
