import { Request, Response } from "express";
import DBDataAtividade from "../db/DBDataAtividade";
import { trataErr } from "../errors";

const cDataAtividade = {
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
