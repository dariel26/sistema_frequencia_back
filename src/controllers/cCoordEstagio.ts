import { Request, Response } from "express";
import DBCoordEstagio from "../db/DBCoordEstagio";
import { trataErr } from "../errors";
import cUtils from "./cUtils";

const camposCoordEstagio = ["id_estagio", "id_usuario"];

const cCoordEstagio = {
  async criarVarios(req: Request, res: Response) {
    const { dados } = req.body;

    const message = cUtils.verificaNovos(dados, camposCoordEstagio);
    if (message) return res.status(400).json({ message });

    try {
      await DBCoordEstagio.deletar(
        dados.map(({ id_estagio }: { id_estagio: string }) => id_estagio)
      );
      await DBCoordEstagio.criar(dados);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cCoordEstagio;
