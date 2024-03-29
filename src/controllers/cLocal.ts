import { Request, Response } from "express";
import DBLocal from "../db/DBLocal";
import { userError } from "./userErrors";
import cMessages from "./messagesDev";

const camposLocal = ["nome"];

const cLocal = {
  async criarVarios(req: Request, res: Response) {
    const { locais } = req.body;

    const message = cMessages.verificaNovos(locais, camposLocal);
    if (message) return res.status(400).json({ message });

    try {
      await DBLocal.criar(locais);
      const novosLocais = await DBLocal.listar();
      res.status(200).json(novosLocais);
    } catch (err) {
      userError(err, res);
    }
  },
  async listar(_: Request, res: Response) {
    try {
      const locais = await DBLocal.listar();
      res.status(200).json(locais);
    } catch (err) {
      userError(err, res);
    }
  },
  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBLocal.deletar(ids);
      res.status(200).json();
    } catch (err) {
      userError(err, res);
    }
  },
  async editar(req: Request, res: Response) {
    const { novosDados } = req.body;

    const message = cMessages.verificaEdicao(novosDados, camposLocal);
    if (message) return res.status(400).json({ message });

    try {
      await DBLocal.editar(novosDados);
      res.status(200).json();
    } catch (err) {
      userError(err, res);
    }
  },
};

export default cLocal;
