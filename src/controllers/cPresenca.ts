import { requisicaoRuim, trataErr } from "../errors";
import DBPresenca from "../interfaces/IPresenca";

const cPresenca = {
  async listarTodas(_: any, res: any) {
    try {
      const presencas = await DBPresenca.listar();
      res.status(200).json(presencas);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async buscarPorIdAluno(req: any, res: any) {
    const id_aluno = req.params.id_aluno;
    try {
      const presencas = await DBPresenca.buscarPorAluno(id_aluno);
      res.status(200).json(presencas);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async buscarPorIdAtividade(req: any, res: any) {
    const id_atividade = req.params.id_atividade;
    try {
      const presencas = await DBPresenca.buscarPorAtividade(id_atividade);
      res.status(200).json(presencas);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async deletarPorId(req: any, res: any) {
    const id_presenca = req.params.id_presenca;
    try {
      await DBPresenca.apagarPorId(id_presenca);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async criarUma(req: any, res: any) {
  },
};

export default cPresenca;
