import { Request, Response } from "express";
import DBDataAtividade from "../db/DBDataAtividade";
import { trataErr } from "../errors";

const cDataAtividade = {
  async criarVarios(req: Request, res: Response) {
    let { dados } = req.body;
    try {
      dados = dados.map(
        ({ id_atividade, data }: { id_atividade: string; data: string }) => ({
          id_atividade,
          data: new Date(data).toISOString().slice(0, 10).replace("T", " "),
        })
      );
      await DBDataAtividade.deletar(
        dados.map(({ id_atividade }: { id_atividade: string }) => id_atividade)
      );
      await DBDataAtividade.criar(dados);
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async editarVarios(req: Request, res: Response) {
    const { novosDados } = req.body;
    console.log(novosDados);
    try {
      await DBDataAtividade.editar(novosDados);
      res.status(200).json({ message: "Datas de atividades editadas!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cDataAtividade;
