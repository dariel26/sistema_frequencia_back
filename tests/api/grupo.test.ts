import request from "supertest";
import app from "../../src/app";

const credencias = { login: "dariel.campos18@icloud.com", senha: "leirad123" };
let token = undefined;

const novoGrupo = { nome: "G1" };
let id_grupo = undefined;

describe("Grupo", () => {
  test("Pegando token", async () => {
    const res = await request(app).post("/api/v1/login").send(credencias);

    expect(res.status).toEqual(200);

    token = res.body;
  });

  test("Adicionando grupo", async () => {
    const res = await request(app)
      .post("/api/v1/grupo")
      .set({ token })
      .send({ grupos: [novoGrupo] });

    expect(res.status).toEqual(200);
    expect(
      res.body.find(({ nome_grupo }) => nome_grupo === novoGrupo.nome)
        .nome_grupo
    ).toEqual(novoGrupo.nome);

    id_grupo = res.body.find(
      ({ nome_grupo }) => nome_grupo === novoGrupo.nome
    ).id_grupo;
  });

  test("Editando grupo", async () => {
    const res = await request(app)
      .put(`/api/v1/grupo`)
      .set({ token })
      .send({ novosDados: { id_grupo, nome: "G2" } });

    expect(res.status).toEqual(200);
  });

  test("Apagando grupo", async () => {
    const res = await request(app)
      .delete(`/api/v1/grupo/${[id_grupo].join(",")}`)
      .set({ token });

    expect(res.status).toEqual(200);
  });
});
