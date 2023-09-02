import request from "supertest";
import app from "../../src/app";
import { IEstagio, IViewEstagio } from "../../src/interfaces";

const credencias = { login: "dariel.campos18@icloud.com", senha: "leirad123" };
let token = undefined;

const novoEstagio = { nome: "MFC Saúde Geral" };
let id_estagio = undefined;

const novoGrupo = { nome: "G1" };
let id_grupo = undefined;

let id_estagiogrupo: number | undefined = undefined;

describe("Estagio Grupo", () => {
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

  test("Associando grupo ao estagio", async () => {
    const res = await request(app)
      .post("/api/v1/estagio-grupo")
      .set({ token })
      .send({
        dados: [
          {
            id_estagio,
            id_grupo,
            data_inicial: new Date(),
            data_final: new Date(),
          },
        ],
      });
  });

  test("Buscando id_estaagiogrupo", async () => {
    const res = await request(app).get("/api/v1/estagio").set({ token });
    const estagios = res.body;
    const estagioAtual: IViewEstagio = estagios.find(
      (e: IViewEstagio) => e.id_estagio === id_estagio
    );
    const associacao = estagioAtual.grupos.find((g) => g.id_grupo === id_grupo);
    id_estagiogrupo = associacao?.id_estagiogrupo;
  });

  test("Editando Associação", async () => {
    const res = await request(app)
      .put(`/api/v1/estagio-grupo`)
      .set({ token })
      .send({ novosDados: { id_estagiogrupo, data_inicial: new Date() } });

    expect(res.status).toEqual(200);
  });

  test("Apagando associação", async () => {
    const res = await request(app)
      .delete(`/api/v1/estagio-grupo/${[id_estagiogrupo].join(",")}`)
      .set({ token });

    expect(res.status).toEqual(200);
  });

  test("Apagando grupo", async () => {
    const res = await request(app)
      .delete(`/api/v1/grupo/${[id_grupo].join(",")}`)
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
