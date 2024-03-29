import { Request, Response } from "express";
import DBPrecAtividade from "../db/DBPrecAtividade";
import { userError } from "./userErrors";

const cPrecAtividade = {
  async criarVarios(req: Request, res: Response) {
    const { dados } = req.body;
    try {
      await DBPrecAtividade.deletar(
        dados.map(({ id_atividade }: { id_atividade: string }) => id_atividade)
      );
      await DBPrecAtividade.criar(dados);
      res.status(201).json();
    } catch (err) {
      userError(err, res);
    }
  },
};

export default cPrecAtividade;
