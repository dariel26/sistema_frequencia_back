import { requisicaoRuim, trataErr } from "../errors";
import DBPrecAtiv, { IPrecAtiv } from "../interfaces/IPrecAtiv";

const cPrecAtiv = {
  async associarUm(req: any, res: any) {
    const { id_atividade, id_preceptor } = req.body;
    if (requisicaoRuim(!DBPrecAtiv.valido(req.body), res)) return;
    try {
      const pa: IPrecAtiv = { id_atividade, id_preceptor };
      await DBPrecAtiv.associar(pa);
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async apagaUmPorIds(req: any, res: any) {
    const { id_atividade, id_preceptor } = req.body;
    if (requisicaoRuim(!DBPrecAtiv.valido(req.body), res)) return;
    try {
      await DBPrecAtiv.apagar({ id_atividade, id_preceptor });
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async buscarPorIdAtividade(req: any, res: any) {
    const { id_atividade } = req.params;
    try {
      const preceptores = await DBPrecAtiv.buscarPorIdAtividade(id_atividade);
      res.status(200).json(preceptores);
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cPrecAtiv;
