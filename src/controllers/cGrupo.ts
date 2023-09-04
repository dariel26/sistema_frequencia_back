import { Request, Response } from "express";
import DBGrupo from "../db/DBGrupo";
import { trataErr } from "./userErrors";
import cMessages from "./messagesDev";

const camposGrupos = ["nome"];

const cGrupo = {
  async criarVarios(req: Request, res: Response) {
    const { grupos } = req.body;

    const message = cMessages.verificaNovos(grupos, camposGrupos);
    if (message) return res.status(400).json({ message });

    try {
      await DBGrupo.criar(grupos);
      const novosGrupos = await DBGrupo.listar();

      res.status(200).json(novosGrupos);
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
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },

  async editar(req: Request, res: Response) {
    const { novosDados } = req.body;

    const message = cMessages.verificaEdicao(novosDados, camposGrupos);
    if (message) return res.status(400).json({ message });

    try {
      await DBGrupo.editar(novosDados);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cGrupo;
