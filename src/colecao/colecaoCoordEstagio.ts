import { requisicaoRuim, trataErr } from "../errors";
import DBCoordEstagio, { ICoordEstagio } from "../interfaces/ICoordEstagio";

const colecaoCoordEstagio = {
  async associarUm(req: any, res: any) {
    const { id_coordenador, id_estagio } = req.body;
    if (requisicaoRuim(!DBCoordEstagio.valido(req.body), res)) return;
    try {
      const ce: ICoordEstagio = { id_coordenador, id_estagio };
      await DBCoordEstagio.associar(ce);
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listar(_: any, res: any) {
    try {
      const associacoes = await DBCoordEstagio.listar();
      res.status(200).json(associacoes);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async apagaUmPorIds(req: any, res: any) {
    const { id_coordenador, id_estagio } = req.body;
    if (requisicaoRuim(!DBCoordEstagio.valido(req.body), res)) return;
    try {
      await DBCoordEstagio.apagar({ id_coordenador, id_estagio });
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default colecaoCoordEstagio;
