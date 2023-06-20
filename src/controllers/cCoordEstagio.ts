import { Request, Response } from "express";
import DBCoordEstagio from "../db/DBCoordEstagio";
import { trataErr } from "../errors";

const cCoordEstagio = {
  async criarVarios(req: Request, res: Response) {
    const { dados } = req.body;
    try {
      await DBCoordEstagio.deletar(
        dados.map(({ id_estagio }: { id_estagio: string }) => id_estagio)
      );
      await DBCoordEstagio.criar(dados);
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cCoordEstagio;
