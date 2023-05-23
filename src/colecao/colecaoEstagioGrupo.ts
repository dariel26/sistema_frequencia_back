import { requisicaoRuim, trataErr } from "../errors";
import DBEstagioGrupo, { IEstagioGrupo } from "../interfaces/IEstagioGrupo";

const colecaoEstagioGrupo = {
  async associarUm(req: any, res: any) {
    const { id_grupo, id_estagio, data } = req.body;
    if (requisicaoRuim(!DBEstagioGrupo.valido(req.body), res)) return;
    try {
      const eg: IEstagioGrupo = { id_grupo, id_estagio, data };
      await DBEstagioGrupo.associar(eg);
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async apagaUmPorIdsData(req: any, res: any) {
    const { id_grupo, id_estagio, data } = req.body;
    if (requisicaoRuim(!DBEstagioGrupo.valido(req.body), res)) return;
    try {
      await DBEstagioGrupo.apagar({ id_grupo, id_estagio, data });
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async buscarPorIdGrupo(req: any, res: any) {
    const { id_grupo } = req.params;
    try {
      const estagiosEDatas = await DBEstagioGrupo.buscarPorIdGrupo(id_grupo);
      res.status(200).json(estagiosEDatas);
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default colecaoEstagioGrupo;
