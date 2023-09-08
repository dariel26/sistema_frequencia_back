import request from "supertest";
import app from "../../src/app";

const credencias = { login: "dariel.campos18@icloud.com", senha: "leirad123" };
let token = undefined;

const alunoA = { nome: "Novo AlunoA", senha: "111", login: "111" };
let id_usuarioA = undefined;
const alunoB = { nome: "Novo AlunoB", senha: "222", login: "222" };
let id_usuarioB = undefined;
const alunoC = { nome: "Novo AlunoC", senha: "333", login: "333" };
let id_usuarioC = undefined;

const grupoA = { nome: "G1" };
let id_grupoA = undefined;
const grupoB = { nome: "G2" };
let id_grupoB = undefined;
const grupoC = { nome: "G3" };
let id_grupoC = undefined;

const estagioA = { nome: "MFC" };
let id_estagioA = undefined;
const estagioB = { nome: "Pediatria" };
let id_estagioB = undefined;
const estagioC = { nome: "Ginecologia" };
let id_estagioC = undefined;

const atividadeA = { nome: "Geral", id_estagio: null };
let id_atividadeA = undefined;
const atividadeB = { nome: "Pediatria" };
let id_atividadeB = undefined;

//TODO as datas testadas aqui devem ser colocadas em variaveis
// para facilitar futuras mudanças.
describe("Atividade", () => {
  test("Pegando token", async () => {
    const res = await request(app).post("/api/v1/login").send(credencias);

    expect(res.status).toEqual(200);

    token = res.body;
  });

  test("Adicionando alunos", async () => {
    const res = await request(app)
      .post("/api/v1/aluno")
      .set({ token })
      .send({ alunos: [alunoA, alunoB, alunoC] });

    expect(res.status).toEqual(200);

    id_usuarioA = res.body.find(({ nome }) => nome === alunoA.nome).id_usuario;
    id_usuarioB = res.body.find(({ nome }) => nome === alunoB.nome).id_usuario;
    id_usuarioC = res.body.find(({ nome }) => nome === alunoC.nome).id_usuario;
  });

  test("Adicionando grupos", async () => {
    const res = await request(app)
      .post("/api/v1/grupo")
      .set({ token })
      .send({ grupos: [grupoA, grupoB, grupoC] });

    expect(res.status).toEqual(200);

    id_grupoA = res.body.find(
      ({ nome_grupo }) => nome_grupo === grupoA.nome
    ).id_grupo;
    id_grupoB = res.body.find(
      ({ nome_grupo }) => nome_grupo === grupoB.nome
    ).id_grupo;
    id_grupoC = res.body.find(
      ({ nome_grupo }) => nome_grupo === grupoC.nome
    ).id_grupo;
  });

  test("Adicionando Associações Aluno-Grupo", async () => {
    const res = await request(app)
      .post("/api/v1/aluno-grupo")
      .set({ token })
      .send({
        dados: [
          { id_grupo: id_grupoA, id_usuario: id_usuarioA },
          { id_grupo: id_grupoB, id_usuario: id_usuarioB },
          { id_grupo: id_grupoC, id_usuario: id_usuarioC },
        ],
      });

    expect(res.status).toEqual(200);
  });

  test("Adicionando estagio", async () => {
    const res = await request(app)
      .post("/api/v1/estagio")
      .set({ token })
      .send({ estagios: [estagioA, estagioB, estagioC] });

    expect(res.status).toEqual(200);

    id_estagioA = res.body.find(
      ({ nome_estagio }) => nome_estagio === estagioA.nome
    ).id_estagio;
    id_estagioB = res.body.find(
      ({ nome_estagio }) => nome_estagio === estagioB.nome
    ).id_estagio;
    id_estagioC = res.body.find(
      ({ nome_estagio }) => nome_estagio === estagioC.nome
    ).id_estagio;
  });

  test("Associando grupo ao estagio", async () => {
    //Em 2100 Devem ser mudadas todas as datas para um futuro mais longe para poder funcionar o teste
    const res = await request(app)
      .post("/api/v1/estagio-grupo")
      .set({ token })
      .send({
        dados: [
          {
            id_estagio: id_estagioA,
            id_grupo: id_grupoA,
            data_inicial: new Date(2100, 8, 18),
            data_final: new Date(2100, 8, 30),
          },
          {
            id_estagio: id_estagioA,
            id_grupo: id_grupoB,
            data_inicial: new Date(2100, 8, 31),
            data_final: new Date(2100, 9, 18),
          },
          {
            id_estagio: id_estagioA,
            id_grupo: id_grupoC,
            data_inicial: new Date(2100, 9, 19),
            data_final: new Date(2100, 10, 4),
          },
          {
            id_estagio: id_estagioB,
            id_grupo: id_grupoA,
            data_inicial: new Date(2100, 8, 31),
            data_final: new Date(2100, 9, 18),
          },
          {
            id_estagio: id_estagioB,
            id_grupo: id_grupoB,
            data_inicial: new Date(2100, 9, 19),
            data_final: new Date(2100, 10, 4),
          },
          {
            id_estagio: id_estagioB,
            id_grupo: id_grupoC,
            data_inicial: new Date(2100, 8, 18),
            data_final: new Date(2100, 8, 30),
          },
          {
            id_estagio: id_estagioC,
            id_grupo: id_grupoA,
            data_inicial: new Date(2100, 9, 19),
            data_final: new Date(2100, 10, 4),
          },
          {
            id_estagio: id_estagioC,
            id_grupo: id_grupoB,
            data_inicial: new Date(2100, 8, 18),
            data_final: new Date(2100, 8, 30),
          },
          {
            id_estagio: id_estagioC,
            id_grupo: id_grupoC,
            data_inicial: new Date(2100, 8, 31),
            data_final: new Date(2100, 9, 18),
          },
        ],
      });
    expect(res.status).toEqual(200);
  });

  test("Adicionando atividades", async () => {
    const res = await request(app)
      .post("/api/v1/atividade")
      .set({ token })
      .send({
        atividades: [atividadeA, { ...atividadeB, id_estagio: id_estagioA }],
      });

    expect(res.status).toEqual(200);

    id_atividadeA = res.body.find(
      ({ nome_atividade }) => nome_atividade === atividadeA.nome
    ).id_atividade;
    id_atividadeB = res.body.find(
      ({ nome_atividade }) => nome_atividade === atividadeB.nome
    ).id_atividade;
  });

  test("Editando atividade Geral", async () => {
    const res = await request(app)
      .put("/api/v1/atividade")
      .set({ token })
      .send({
        novosDados: {
          id_atividade: id_atividadeA,
          segunda: true,
          intervalo_alunos: "0-5",
          alunos_no_dia: 3,
        },
      });
    const atividades = await request(app)
      .get("/api/v1/atividade")
      .set({ token });

    expect(res.status).toEqual(200);
    expect(atividades.body[0].datas.length).toEqual(7);
    //Em 2100 pode ser que este teste falhe.
    expect(atividades.body[0].datas[0].data).toEqual("2100-09-20");
  });

  test("Editando atividade de estagio", async () => {
    const res = await request(app)
      .put("/api/v1/atividade")
      .set({ token })
      .send({
        novosDados: {
          id_atividade: id_atividadeB,
          segunda: true,
          intervalo_alunos: "0-5",
          alunos_no_dia: 3,
        },
      });
    const atividades = await request(app)
      .get("/api/v1/atividade")
      .set({ token });

    expect(res.status).toEqual(200);
    //Em 2100 pode ser que este teste falhe.
    expect(
      atividades.body[1].datas.map(({ data, alunos }) => ({ data, ...alunos }))
    ).toEqual([
      {
        "0": { nome: alunoA.nome, estado: "CRIADA", id_aluno: id_usuarioA },
        data: "2100-09-20",
      },
      {
        "0": { nome: alunoA.nome, estado: "CRIADA", id_aluno: id_usuarioA },
        data: "2100-09-27",
      },
      {
        "0": { nome: alunoB.nome, estado: "CRIADA", id_aluno: id_usuarioB },
        data: "2100-10-04",
      },
      {
        "0": { nome: alunoB.nome, estado: "CRIADA", id_aluno: id_usuarioB },
        data: "2100-10-11",
      },
      {
        "0": { nome: alunoB.nome, estado: "CRIADA", id_aluno: id_usuarioB },
        data: "2100-10-18",
      },
      {
        "0": { nome: alunoC.nome, estado: "CRIADA", id_aluno: id_usuarioC },
        data: "2100-10-25",
      },
      {
        "0": { nome: alunoC.nome, estado: "CRIADA", id_aluno: id_usuarioC },
        data: "2100-11-01",
      },
    ]);
  });

  test("Apagando Atividades", async () => {
    const res = await request(app)
      .delete(`/api/v1/atividade/${[id_atividadeA, id_atividadeB].join(",")}`)
      .set({ token });

    expect(res.status).toEqual(200);
  });

  test("Apagando Estagio", async () => {
    const res = await request(app)
      .delete(
        `/api/v1/estagio/${[id_estagioA, id_estagioB, id_estagioC].join(",")}`
      )
      .set({ token });

    expect(res.status).toEqual(200);
  });

  test("Apagando grupos", async () => {
    const res = await request(app)
      .delete(`/api/v1/grupo/${[id_grupoA, id_grupoB, id_grupoC].join(",")}`)
      .set({ token });

    expect(res.status).toEqual(200);
  });

  test("Apagando alunos", async () => {
    const res = await request(app)
      .delete(
        `/api/v1/aluno/${[id_usuarioA, id_usuarioB, id_usuarioC].join(",")}`
      )
      .set({ token });

    expect(res.status).toEqual(200);
  });
});
