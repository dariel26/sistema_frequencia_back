import request from "supertest";
import app from "../../src/app";

const credencias = { login: "dariel.campos18@icloud.com", senha: "leirad123" };
let token = undefined;

const novoAluno = { nome: "Novo Aluno", senha: "123", login: "123" };
let id_usuario = undefined;

describe("Aluno", () => {
  test("Pegando token", async () => {
    const res = await request(app).post("/api/v1/login").send(credencias);

    expect(res.status).toEqual(200);

    token = res.body;
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

  test("Editando aluno", async () => {
    const res = await request(app)
      .put("/api/v1/aluno")
      .set({ token })
      .send({
        novosDados: {
          id_usuario,
          ...novoAluno,
        },
      });

    expect(res.status).toEqual(200);
  });

  test("Apagando aluno", async () => {
    const res = await request(app)
      .delete(`/api/v1/aluno/${[id_usuario].join(",")}`)
      .set({ token });

    expect(res.status).toEqual(200);
  });
});
