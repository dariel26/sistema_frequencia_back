import { Request, Response } from "express";
import DBLocal from "../db/DBLocal";
import { trataErr } from "../errors";

const cLocal = {
  async criarVarios(req: Request, res: Response) {
    const { locais } = req.body;
    try {
      await DBLocal.criar(locais);
      res.status(201).json({ message: "Locais salvos!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listar(_: Request, res: Response) {
    try {
      const locais = await DBLocal.listar();
      res.status(200).json(locais);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBLocal.deletar(ids);
      res.status(200).json({ message: "Locais deletados!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async editarVarios(req: Request, res: Response) {
    const { novosDados } = req.body;
    try {
      await DBLocal.editar(novosDados);
      res.status(200).json({ message: "Locais editados!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cLocal;
