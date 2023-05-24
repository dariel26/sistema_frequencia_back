import { requisicaoRuim, trataErr } from "../errors";
import DBGrupo, { IGrupo } from "../interfaces/IGrupo";

const cGrupo = {
  async adicionaUm(req: any, res: any) {
    const { nome } = req.body;
    if (requisicaoRuim(!DBGrupo.valido(req.body), res)) return;
    try {
      const g: IGrupo = { nome };
      await DBGrupo.criar(g);
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listar(_: any, res: any) {
    try {
      const grupos = await DBGrupo.listar();
      res.status(200).json(grupos);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async apagaUmPorId(req: any, res: any) {
    const { id_grupo } = req.params;
    try {
      await DBGrupo.apagar(parseInt(id_grupo));
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async mudaNome(req: any, res: any) {
    const nome: string = req.body.nome;
    const { id_grupo } = req.params;
    if (requisicaoRuim(nome === undefined, res)) return;
    try {
      await DBGrupo.editar(parseInt(id_grupo), nome);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cGrupo;
