import { Request, Response } from "express";
import DBLocalAtividade from "../db/DBLocalAtividade";
import { userError } from "./userErrors";

const cLocalAtividade = {
  async criarVarios(req: Request, res: Response) {
    const { dados } = req.body;
    try {
      await DBLocalAtividade.deletar(
        dados.map(({ id_atividade }: { id_atividade: string }) => id_atividade)
      );
      await DBLocalAtividade.criar(dados);
      res.status(201).json();
    } catch (err) {
      userError(err, res);
    }
  },
};

export default cLocalAtividade;
