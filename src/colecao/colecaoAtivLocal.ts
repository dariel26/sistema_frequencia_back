import { requisicaoRuim, trataErr } from "../errors";
import DBAtivLocal, { IAtivLocal } from "../interfaces/IAtivLocal";

const colecaoAtivLocal = {
  async associarUm(req: any, res: any) {
    const { id_atividade, id_local, data_hora } = req.body;
    if (requisicaoRuim(!DBAtivLocal.valido(req.body), res)) return;
    try {
      const al: IAtivLocal = { id_atividade, id_local, data_hora };
      await DBAtivLocal.associar(al);
      res.status(201).json();
    } catch (err) {
        console.log(err);
      trataErr(err, res);
    }
  },
  async apagaUmPorIdsData(req: any, res: any) {
    const { id_atividade, id_local, data_hora } = req.body;
    if (requisicaoRuim(!DBAtivLocal.valido(req.body), res)) return;
    try {
      await DBAtivLocal.apagar({ id_atividade, id_local, data_hora });
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async buscarPorIdAtividade(req: any, res: any) {
    const { id_atividade } = req.params;
    try {
      const locaisEDatas = await DBAtivLocal.buscarPorIdAtividade(id_atividade);
      res.status(200).json(locaisEDatas);
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default colecaoAtivLocal;
