import { Request, Response } from "express";
import DBDataAtividade from "../db/DBDataAtividade";
import { userError } from "./userErrors";
import cUtils from "./utilidades";

const cDataAtividade = {
  async criar(req: Request, res: Response) {
    let { datas, id_atividade } = req.body;
    try {
      datas = datas.map((data: string) => ({
        id_atividade,
        data: cUtils.dataFrontEmDataBD(data),
      }));

      await DBDataAtividade.criar(datas);
      res.status(201).json();
    } catch (err) {
      userError(err, res);
    }
  },
  async criarVarios(req: Request, res: Response) {
    let { datas, id_atividade } = req.body;
    try {
      datas = datas.map((data: string) => ({
        id_atividade,
        data: new Date(data).toISOString().slice(0, 10).replace("T", " "),
      }));
      await DBDataAtividade.deletar([id_atividade]);

      if (datas.length < 1) return res.status(201).json();
      await DBDataAtividade.criar(datas);
      res.status(201).json();
    } catch (err) {
      userError(err, res);
    }
  },
  async editarVarios(req: Request, res: Response) {
    const { novosDados } = req.body;
    try {
      await DBDataAtividade.editar(novosDados);
      res.status(200).json({ message: "Datas de atividades editadas!" });
    } catch (err) {
      userError(err, res);
    }
  },
  async deletar(req: Request, res: Response) {
    const ids = req.params.ids.split(",");

    try {
      await DBDataAtividade.deletarPorId(ids);
      res.status(200).json({ message: "Datas de atividades deletadas!" });
    } catch (err) {
      userError(err, res);
    }
  },
};

export default cDataAtividade;
