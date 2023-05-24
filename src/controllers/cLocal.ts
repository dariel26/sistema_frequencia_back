import { requisicaoRuim, trataErr } from "../errors";
import DBLocal, { ILocal } from "../interfaces/ILocal";

const cLocal = {
  async adicionaUm(req: any, res: any) {
    const { nome, coordenadas } = req.body;
    if (requisicaoRuim(!DBLocal.valido(req.body), res)) return;
    try {
      const l: ILocal = { nome, coordenadas };
      await DBLocal.criar(l);
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listar(_: any, res: any) {
    try {
      const locais = await DBLocal.listar();
      res.status(200).json(locais);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async apagaUmPorId(req: any, res: any) {
    const { id_local } = req.params;
    try {
      await DBLocal.apagar(parseInt(id_local));
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async mudaNome(req: any, res: any) {
    const { nome, coordenadas } = req.body;
    const { id_local } = req.params;
    if (requisicaoRuim(!DBLocal.valido(req.body), res)) return;
    try {
      await DBLocal.editar(parseInt(id_local), nome, coordenadas);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cLocal;
