import { Request, Response } from "express";
import DBGrupo from "../db/DBGrupo";
import { trataErr } from "../errors";

const cGrupo = {
  async criarVarios(req: Request, res: Response) {
    const { grupos } = req.body;
    try {
      await DBGrupo.criar(grupos);
      res.status(201).json({ message: "Grupos salvos!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listar(_: Request, res: Response) {
    try {
      const grupos = await DBGrupo.listar();
      res.status(200).json(grupos);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBGrupo.deletar(ids);
      res.status(200).json({ message: "Grupos deletados!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async editarVarios(req: Request, res: Response) {
    const { novosDados } = req.body;
    try {
      await DBGrupo.editar(novosDados);
      res.status(200).json({ message: "Grupos editados!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cGrupo;
