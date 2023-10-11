import { Request, Response } from "express";
import cMessages from "./messagesDev";
import { CustomRequest, ISubscricao } from "../interfaces";
import DBSubscricao from "../db/DBSubscricao";
import { userError } from "./userErrors";

const cSubscricao = {
  async criaSubscricao(req: Request, res: Response) {
    const { dados } = req.body;

    const message = cMessages.verificaEdicao(dados, ["subscricao"]);
    if (message) return res.status(400).json({ message });
    if (!dados?.id_usuario)
      return res.status(400).json({ message: "O id_usuario é necessário" });

    const dadosNormalizados: ISubscricao = {
      id_usuario: dados.id_usuario,
      endpoint: dados.subscricao.endpoint,
      expiracao: dados.subscricao.expirationTime,
      u_key: dados.subscricao.keys.p256dh,
      autenticidade: dados.subscricao.keys.auth,
    };
    try {
      await DBSubscricao.deletar([dados.id_usuario]);
      await DBSubscricao.criar([dadosNormalizados]);
      res.status(200).json();
    } catch (err) {
      userError(err, res);
    }
  },

  async revogaSubscricao(req: Request, res: Response) {
    const { id_usuario } = req.params;
    try {
      await DBSubscricao.deletar([id_usuario]);
      res.status(200).json();
    } catch (err) {
      userError(err, res);
    }
  },

  async possuiSubscricao(req: Request, res: Response) {
    const requisicao = req as CustomRequest;

    try {
      const subscricoes = await DBSubscricao.listar();
      if (
        subscricoes.some(
          (s) => s.id_usuario === requisicao.infoToken.id_usuario
        )
      )
        res.status(200).json(true);
      else res.status(200).json(false);
    } catch (err) {
      userError(err, res);
    }
  },
};

export default cSubscricao;
