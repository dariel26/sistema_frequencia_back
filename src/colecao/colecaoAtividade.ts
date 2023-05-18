import { requisicaoRuim, trataErr } from "../errors";
import DBAtividade, { IAtividade } from "../interfaces/IAtividade";

const colecaoAtividade = {
  async adicionaUm(req: any, res: any) {
    const { nome, id_estagio } = req.body;
    if (requisicaoRuim(!DBAtividade.valido(req.body), res)) return;
    try {
      const a: IAtividade = { nome, id_estagio };
      await DBAtividade.criar(a);
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listar(_: any, res: any) {
    try {
      const atividades = await DBAtividade.listar();
      res.status(200).json(atividades);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listarPorIdEstagio(req: any, res: any) {
    const id_estagio = parseInt(req.params.id_estagio);
    try {
      const atividades = await DBAtividade.listarPorIdEstagio(id_estagio);
      res.status(200).json(atividades);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async apagaUmPorId(req: any, res: any) {
    const { id } = req.params;
    try {
      await DBAtividade.apagar(parseInt(id));
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
      await DBAtividade.editar(parseInt(id), nome);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default colecaoAtividade;
