import { requisicaoRuim, trataErr } from "../errors";
import DBEstagioGrupo, { IEstagioGrupo } from "../interfaces/IEstagioGrupo";

const cEstagioGrupo = {
  async associarUm(req: any, res: any) {
    let { id_grupo, id_estagio, data_inicio, data_final } = req.body;
    if (requisicaoRuim(!DBEstagioGrupo.valido(req.body), res)) return;
    try {
      data_inicio = new Date(data_inicio)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");
      data_final = new Date(data_final)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");
      const eg: IEstagioGrupo = {
        id_grupo,
        id_estagio,
        data_inicio,
        data_final,
      };
      console.log(eg);
      await DBEstagioGrupo.associar(eg);
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async apagaUmPorIdsData(req: any, res: any) {
    const { id_grupo, id_estagio } = req.params;
    if (requisicaoRuim(id_grupo === undefined || id_estagio === undefined, res))
      return;
    try {
      await DBEstagioGrupo.apagar({ id_grupo, id_estagio });
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

export default cEstagioGrupo;
