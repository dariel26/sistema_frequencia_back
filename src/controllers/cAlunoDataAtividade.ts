import { Request, Response } from "express";
import DBAlunoDataAtividade from "../db/DBAlunoDataAtividade";
import { trataErr } from "../errors";

const cAlunoDataAtividade = {
  async criarVarios(req: Request, res: Response) {
    const { dados } = req.body;
    try {
      await DBAlunoDataAtividade.deletar(
        dados.map(
          ({ id_dataatividade }: { id_dataatividade: string }) =>
            id_dataatividade
        )
      );
      await DBAlunoDataAtividade.criar(dados);
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cAlunoDataAtividade;
