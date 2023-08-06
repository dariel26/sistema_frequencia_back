import { Request, Response } from "express";
import DBPresenca from "../db/DBPresenca";
import { trataErr } from "../errors";

const cPresenca = {
  async criarVarias(req: Request, res: Response) {
    const { presenca } = req.body;
    try {
      console.log(presenca);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async deletarVarias(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBPresenca.deletar(ids);
      res.status(200).json({ message: "Presencas deletadas!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listar(_: Request, res: Response) {
    try {
      const alunos = await DBPresenca.listar();
      res.status(200).json(alunos);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async editarVarios(req: Request, res: Response) {
    const { novosDados } = req.body;
    try {
      await DBPresenca.editar(novosDados);
      const alunosAtualizados = await DBPresenca.listar();
      res.status(200).json(alunosAtualizados);
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cPresenca;
