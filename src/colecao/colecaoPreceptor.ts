import { requisicaoRuim, trataErr } from "../errors";
import DBPreceptor, { IPreceptor } from "../interfaces/IPreceptor";

const colecaoPreceptor = {
  async adicionaUm(req: any, res: any) {
    const { nome, senha, estado, papel, email } = req.body;
    if (requisicaoRuim(!DBPreceptor.valido(req.body), res)) return;
    try {
      const p: IPreceptor = { nome, senha, estado, papel, email };
      await DBPreceptor.criar(p);
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async buscaUmPorEmail(req: any, res: any) {
    const { email } = req.params;
    try {
      const p = await DBPreceptor.buscarPorEmail(email);
      res.status(200).json(p);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async apagaUmPorEmail(req: any, res: any) {
    const { email } = req.params;
    try {
      await DBPreceptor.deletar(email);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async atualizaEstadoPorEmail(req: any, res: any) {
    const estado: boolean = req.body.estado;
    const { email } = req.params;
    if (requisicaoRuim(estado === undefined, res)) return;
    try {
      await DBPreceptor.mudarEstado(email, estado);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listarTodos(_: any, res: any) {
    try {
      const preceptores = await DBPreceptor.listar();
      res.status(200).json(preceptores);
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default colecaoPreceptor;
