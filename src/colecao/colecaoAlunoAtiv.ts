import { requisicaoRuim, trataErr } from "../errors";
import DBAlunoAtiv from "../interfaces/IAlunoAtiv";

const colecaoAlunoAtiv = {
  async associarUm(req: any, res: any) {
    const { id_atividade, id_aluno } = req.body;
    if (requisicaoRuim(!DBAlunoAtiv.valido(req.body), res)) return;
    try {
      await DBAlunoAtiv.associar({ id_atividade, id_aluno });
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async apagaUm(req: any, res: any) {
    const { id_atividade, id_aluno } = req.body;
    if (requisicaoRuim(!DBAlunoAtiv.valido(req.body), res)) return;
    try {
      await DBAlunoAtiv.apagar({ id_atividade, id_aluno });
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async buscarPorIdAtividade(req: any, res: any) {
    const { id_atividade } = req.params;
    try {
      const alunos = await DBAlunoAtiv.buscarPorIdAtividade(id_atividade);
      res.status(200).json(alunos);
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default colecaoAlunoAtiv;
