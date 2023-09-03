import request from "supertest";
import app from "../../src/app";

const credencias = { login: "dariel.campos18@icloud.com", senha: "leirad123" };
let token = undefined;

const novoGrupo = { nome: "G1" };
let id_grupo = undefined;

const novoAluno = { nome: "Novo Aluno", senha: "123", login: "123" };
let id_usuario = undefined;

describe("Aluno-Grupo", () => {
  test("Pegando token", async () => {
    const res = await request(app).post("/api/v1/login").send(credencias);

    expect(res.status).toEqual(200);

    token = res.body;
  });

  test("Adicionando Grupo", async () => {
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

  test("Adicionando aluno", async () => {
    const res = await request(app)
      .post("/api/v1/aluno")
      .set({ token })
      .send({ alunos: [novoAluno] });

    expect(res.status).toEqual(200);
    expect(res.body.find(({ nome }) => nome === novoAluno.nome).nome).toEqual(
      novoAluno.nome
    );

    id_usuario = res.body.find(
      ({ nome }) => nome === novoAluno.nome
    ).id_usuario;
  });

  test("Adicionando Associação Aluno-Grupo", async () => {
    const res = await request(app)
      .post("/api/v1/aluno-grupo")
      .set({ token })
      .send({ dados: [{ id_grupo, id_usuario }] });

    expect(res.status).toEqual(200);
  });

  test("Apagando aluno", async () => {
    const res = await request(app)
      .delete(`/api/v1/aluno/${[id_usuario].join(",")}`)
      .set({ token });

    expect(res.status).toEqual(200);
  });

  test("Apagando Grupo", async () => {
    const res = await request(app)
      .delete(`/api/v1/grupo/${[id_grupo].join(",")}`)
      .set({ token });

    expect(res.status).toEqual(200);
  });
});
