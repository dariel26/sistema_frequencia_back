import { requisicaoRuim, trataErr } from "../errors";
import DBAluno, { IAluno } from "../interfaces/IAluno";

const cAluno = {
  async adicionaUm(req: any, res: any) {
    const { nome, senha, estado, papel, matricula } = req.body;
    if (requisicaoRuim(!DBAluno.valido(req.body), res)) return;
    try {
      const a: IAluno = { nome, senha, estado, papel, matricula };
      await DBAluno.criar(a);
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
  async apagaUmPorMatricula(req: any, res: any) {
    const { matricula } = req.params;
    try {
      await DBAluno.deletar(matricula);
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
