import { Request, Response } from "express";
import DBAtividade from "../db/DBAtividade";
import { trataErr } from "../errors";

const cAtividade = {
  async criarVarios(req: Request, res: Response) {
    const { atividades } = req.body;
    try {
      await DBAtividade.criar(atividades);
      res.status(201).json({ message: "Atividades salvos!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listar(_: Request, res: Response) {
    try {
      const atividades = await DBAtividade.listar();
      res.status(200).json(atividades);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBAtividade.deletar(ids);
      res.status(200).json({ message: "Atividades deletadas!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async editarVarios(req: Request, res: Response) {
    const { novosDados } = req.body;
    try {
      await DBAtividade.editar(novosDados);
      res.status(200).json({ message: "Atividades editadas!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cAtividade;
