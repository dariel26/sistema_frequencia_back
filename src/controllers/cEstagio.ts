import { requisicaoRuim, trataErr } from "../errors";
import DBEstagio, { IEstagio } from "../interfaces/IEstagio";

const cEstagio = {
  async adicionaUm(req: any, res: any) {
    const { nome } = req.body;
    if (requisicaoRuim(!DBEstagio.valido(req.body), res)) return;
    try {
      const e: IEstagio = { nome };
      await DBEstagio.criar(e);
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listar(_: any, res: any) {
    try {
      const estagios = await DBEstagio.listar();
      res.status(200).json(estagios);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async apagaUmPorId(req: any, res: any) {
    const { id } = req.params;
    try {
      await DBEstagio.apagar(parseInt(id));
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async mudaNome(req: any, res: any) {
    const nome: string = req.body.nome;
    const { id } = req.params;
    if (requisicaoRuim(nome === undefined, res)) return;
    try {
      await DBEstagio.editar(parseInt(id), nome);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cEstagio;
