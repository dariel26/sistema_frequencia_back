import { Request, Response } from "express";
import DBPreceptor from "../db/DBPreceptor";
import { trataErr } from "../errors";

const cPreceptor = {
  async criarVarios(req: Request, res: Response) {
    const { preceptores } = req.body;
    try {
      await DBPreceptor.criar(preceptores);
      const novosPreceptores = await DBPreceptor.listar();
      res.status(201).json(novosPreceptores);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBPreceptor.deletar(ids);
      res.status(200).json({ message: "Preceptores deletados!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async editarVarios(req: Request, res: Response) {
    const { novosDados } = req.body;
    try {
      await DBPreceptor.editar(novosDados);
      res.status(200).json({ message: "Preceptores editados!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listar(_: any, res: any) {
    try {
      const preceptores = await DBPreceptor.listar();
      res.status(200).json(preceptores);
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cPreceptor;
