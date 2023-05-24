import { requisicaoRuim, trataErr } from "../errors";
import DBCoordenador, { ICoordenador } from "../interfaces/ICoordenador";

const cCoordenador = {
  async adicionaUm(req: any, res: any) {
    const { nome, senha, estado, papel, email } = req.body;
    if (requisicaoRuim(!DBCoordenador.valido(req.body), res)) return;
    try {
      const c: ICoordenador = { nome, senha, estado, papel, email };
      await DBCoordenador.criar(c);
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async buscaUmPorEmail(req: any, res: any) {
    const { email } = req.params;
    try {
      const c = await DBCoordenador.buscarPorEmail(email);
      res.status(200).json(c);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async apagaUmPorEmail(req: any, res: any) {
    const { email } = req.params;
    try {
      await DBCoordenador.deletar(email);
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
      await DBCoordenador.mudarEstado(email, estado);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listarTodos(_: any, res: any) {
    try {
      const coodenadores = await DBCoordenador.listar();
      res.status(200).json(coodenadores);
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cCoordenador;
