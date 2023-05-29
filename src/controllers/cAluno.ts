import { requisicaoRuim, trataErr } from "../errors";
import DBAluno, { IAluno } from "../interfaces/IAluno";

const cAluno = {
  async adicionaVarios(req: any, res: any) {
    const alunos = req.body;
    if (requisicaoRuim(!Array.isArray(alunos), res)) return;
    for (let a of alunos) {
      if (requisicaoRuim(!DBAluno.valido(a), res)) return;
    }
    try {
      for (let a of alunos) {
        await DBAluno.criar(a);
      }
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async buscaUmPorMatricula(req: any, res: any) {
    const { matricula } = req.params;
    try {
      const a = await DBAluno.buscarPorMatricula(matricula);
      res.status(200).json(a);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async apagaVariosPorMatricula(req: any, res: any) {
    const matriculas = req.body;
    if (requisicaoRuim(!Array.isArray(matriculas), res)) return;
    for (let m of matriculas) {
      if (requisicaoRuim(m === undefined, res)) return;
    }
    try {
      for (let m of matriculas) {
        await DBAluno.deletar(m);
      }
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async atualizaNomePorMatricula(req: any, res: any) {
    const nome: string = req.body.nome;
    const { matricula } = req.params;
    if (requisicaoRuim(nome === undefined, res)) return;
    try {
      await DBAluno.mudarNome(matricula, nome);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listarTodos(_: any, res: any) {
    try {
      const alunos = await DBAluno.listar();
      res.status(200).json(alunos);
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cAluno;
