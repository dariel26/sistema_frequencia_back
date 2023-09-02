import request from "supertest";
import app from "../../src/app";

const credencias = { login: "dariel.campos18@icloud.com", senha: "leirad123" };
let token = undefined;

const novoEstagio = { nome: "MFC Saúde Geral" };
let id_estagio = undefined;

const novoCoordenador = {
  nome: "Novo Coordenador",
  senha: "123",
  login: "coordenador@123.com",
};
let id_usuario = undefined;

describe("Coord-Estagio", () => {
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
    expect(
      res.body.find(({ nome_estagio }) => nome_estagio === novoEstagio.nome)
        .nome_estagio
    ).toEqual(novoEstagio.nome);

    id_estagio = res.body.find(
      ({ nome_estagio }) => nome_estagio === novoEstagio.nome
    ).id_estagio;
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

  test("Adicionando Associação Coord-Estagio", async () => {
    const res = await request(app)
      .post("/api/v1/coord-estagio")
      .set({ token })
      .send({ dados: [{ id_estagio, id_usuario }] });

    expect(res.status).toEqual(200);
  });

  test("Apagando coordenador", async () => {
    const res = await request(app)
      .delete(`/api/v1/coordenador/${[id_usuario].join(",")}`)
      .set({ token });

    expect(res.status).toEqual(200);
  });

  test("Apagando Estagio", async () => {
    const res = await request(app)
      .delete(`/api/v1/estagio/${[id_estagio].join(",")}`)
      .set({ token });

    expect(res.status).toEqual(200);
  });
});
