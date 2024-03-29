import { Request, Response } from "express";
import DBEstagio from "../db/DBEstagio";
import { userError } from "./userErrors";
import cMessages from "./messagesDev";

const camposEstagios = ["nome"];

const cEstagio = {
  async criarVarios(req: Request, res: Response) {
    const { estagios } = req.body;

    const message = cMessages.verificaNovos(estagios, camposEstagios);
    if (message) return res.status(400).json({ message });

    try {
      await DBEstagio.criar(estagios);
      const novosEstagios = await DBEstagio.listar();
      res.status(200).json(novosEstagios);
    } catch (err) {
      userError(err, res);
    }
  },
  async listar(_: Request, res: Response) {
    try {
      const estagios = await DBEstagio.listar();
      res.status(200).json(estagios);
    } catch (err) {
      userError(err, res);
    }
  },
  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBEstagio.deletar(ids);
      res.status(200).json();
    } catch (err) {
      userError(err, res);
    }
  },
  async editar(req: Request, res: Response) {
    const { novosDados } = req.body;

    const message = cMessages.verificaEdicao(novosDados, camposEstagios);
    if (message) return res.status(400).json({ message });

    try {
      await DBEstagio.editar(novosDados);
      res.status(200).json();
    } catch (err) {
      userError(err, res);
    }
  },
};

export default cEstagio;
