import { Request, Response } from "express";
import DBAluno from "../db/DBAluno";
import { trataErr } from "../errors";

const cAluno = {
  async criarVarios(req: Request, res: Response) {
    const { alunos } = req.body;
    try {
      await DBAluno.criar(alunos);
      res.status(201).json({ message: "Alunos salvos!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBAluno.deletar(ids);
      res.status(200).json({ message: "Alunos deletados!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listar(_: Request, res: Response) {
    try {
      const alunos = await DBAluno.listar();
      res.status(200).json(alunos);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async editarVarios(req: Request, res: Response) {
    const { novosDados } = req.body;
    try {
      await DBAluno.editar(novosDados);
      res.status(200).json({ message: "Alunos atualizados!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cAluno;
