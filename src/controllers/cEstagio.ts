import { Request, Response } from "express";
import DBEstagio from "../db/DBEstagio";
import { trataErr } from "../errors";

const cEstagio = {
  async criarVarios(req: Request, res: Response) {
    const { estagios } = req.body;
    try {
      await DBEstagio.criar(estagios);
      res.status(201).json({ message: "Estágios salvos!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listar(_: Request, res: Response) {
    try {
      const estagios = await DBEstagio.listar();
      res.status(200).json(estagios);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBEstagio.deletar(ids);
      res.status(200).json({ message: "Estágios deletados!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async editarVarios(req: Request, res: Response) {
    const { novosDados } = req.body;
    try {
      await DBEstagio.editar(novosDados);
      res.status(200).json({ message: "Estágios editados!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cEstagio;
