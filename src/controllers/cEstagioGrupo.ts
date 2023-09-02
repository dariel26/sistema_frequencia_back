import { Request, Response } from "express";
import DBEstagioGrupo from "../db/DBEstagioGrupo";
import { trataErr } from "../errors";
import cUtils from "./cUtils";
import { dataFrontEmDataBD } from "../utils";

const camposEstagioGrupo = [
  "id_estagio",
  "id_grupo",
  "data_inicial",
  "data_final",
];

const cEstagioGrupo = {
  async criarVarios(req: Request, res: Response) {
    let { dados } = req.body;

    const message = cUtils.verificaNovos(dados, camposEstagioGrupo);
    if (message) return res.status(400).json({ message });

    try {
      dados = dados.map(
        (dado: {
          id_estagio: string;
          id_grupo: string;
          data_inicial: string;
          data_final: string;
        }) => ({
          id_estagio: dado.id_estagio,
          id_grupo: dado.id_grupo,
          data_inicial: dataFrontEmDataBD(dado.data_inicial),
          data_final: dataFrontEmDataBD(dado.data_final),
        })
      );

      await DBEstagioGrupo.criar(dados);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async editar(req: Request, res: Response) {
    let { novosDados } = req.body;

    const message = cUtils.verificaEdicao(novosDados, camposEstagioGrupo);
    if (message) return res.status(400).json({ message });

    try {
      if (novosDados.data_inicial)
        novosDados = {
          ...novosDados,
          data_inicial: dataFrontEmDataBD(novosDados.data_inicial),
        };
      if (novosDados.data_final)
        novosDados = {
          ...novosDados,
          data_final: dataFrontEmDataBD(novosDados.data_final),
        };

      await DBEstagioGrupo.editar(novosDados);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBEstagioGrupo.deletar(ids);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cEstagioGrupo;
