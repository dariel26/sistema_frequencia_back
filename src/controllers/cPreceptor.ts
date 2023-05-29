import { requisicaoRuim, trataErr } from "../errors";
import DBPreceptor, { IPreceptor } from "../interfaces/IPreceptor";

const cPreceptor = {
  async adicionaVarios(req: any, res: any) {
    const preceptores = req.body;
    if (requisicaoRuim(!Array.isArray(preceptores), res)) return;
    for (let p of preceptores) {
      if (requisicaoRuim(!DBPreceptor.valido(p), res)) return;
    }
    try {
      for (let p of preceptores) {
        await DBPreceptor.criar(p);
      }
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
  async apagaVariosPorEmail(req: any, res: any) {
    const emails = req.body;
    if (requisicaoRuim(!Array.isArray(emails), res)) return;
    for (let email of emails) {
      if (requisicaoRuim(email === undefined, res)) return;
    }
    try {
      for (let email of emails) {
        await DBPreceptor.deletar(email);
      }
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async atualizaNomePorEmail(req: any, res: any) {
    const nome: string = req.body.nome;
    const { email } = req.params;
    if (requisicaoRuim(nome === undefined, res)) return;
    try {
      await DBPreceptor.mudarNome(email, nome);
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

export default cPreceptor;
