import { requisicaoRuim, trataErr } from "../errors";
import DBAtivLocalAluno, { IAtivLocalAluno } from "../interfaces/IAtivLocalAluno";

const cAtivLocalAluno = {
  async associarUm(req: any, res: any) {
    const { id_atividade, id_local, data_hora, id_aluno } = req.body;
    if (requisicaoRuim(!DBAtivLocalAluno.valido(req.body), res)) return;
    try {
      const al: IAtivLocalAluno = { id_atividade, id_local, data_hora, id_aluno };
      await DBAtivLocalAluno.associar(al);
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async apagaUmPorIdsData(req: any, res: any) {
    const { id_atividade, id_local, data_hora, id_aluno } = req.body;
    if (requisicaoRuim(!DBAtivLocalAluno.valido(req.body), res)) return;
    try {
      await DBAtivLocalAluno.apagar({ id_atividade, id_local, data_hora, id_aluno });
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async buscarPorIdAtividade(req: any, res: any) {
    const { id_atividade } = req.params;
    try {
      const locaisEDatas = await DBAtivLocalAluno.buscarPorIdAtividade(id_atividade);
      res.status(200).json(locaisEDatas);
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cAtivLocalAluno;
