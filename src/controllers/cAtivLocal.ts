import { Request, Response } from "express";
import DBAtivLocal from "../db/DBAtivLocal";
import { trataErr } from "../errors";

const cAtivLocal = {
  async criarVarios(req: Request, res: Response) {
    const { dados } = req.body;
    try {
      await DBAtivLocal.criar(dados);
      res.status(201).json({ message: "Atividades asociadas!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listar(_: Request, res: Response) {
    try {
      const dados = await DBAtivLocal.listar();
      res.status(200).json(dados);
    } catch (err) {
      trataErr(err, res);
    }
  },

  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBAtivLocal.deletar(ids);
      res.status(200).json({ message: "Atividades desasociadas!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async editarVarios(req: Request, res: Response) {
    const { novosDados } = req.body;
    try {
      await DBAtivLocal.editar(novosDados);
      res.status(200).json({ message: "Asocições editadas!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cAtivLocal;
