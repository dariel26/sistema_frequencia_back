import { Request, Response } from "express";
import DBUsuario from "../db/DBUsuario";
import { userError } from "./userErrors";
import cMessages from "./messagesDev";
import { IUsuario, PAPEIS, TIPO_USUARIO } from "../interfaces";

const camposPreceptores: string[] = ["nome", "login", "senha"];
const papeis: PAPEIS[] = ["PRECEPTOR(A)"];
const tipo: TIPO_USUARIO = "PRECEPTOR";

const cPreceptor = {
  async criarVarios(req: Request, res: Response) {
    const { preceptores } = req.body;

    const message = cMessages.verificaNovos(preceptores, camposPreceptores);
    if (message) return res.status(400).json({ message });

    try {
      const dados: IUsuario[] = preceptores.map(
        ({
          nome,
          login,
          senha,
        }: {
          nome: string;
          login: string;
          senha: string;
        }) => ({
          nome,
          login,
          senha,
          papeis: JSON.stringify(papeis),
          papel_atual: papeis[0],
          tipo,
        })
      );
      await DBUsuario.criar(dados);
      const novosPreceptores = await DBUsuario.buscarPorTipo(tipo);

      res.status(200).json(novosPreceptores);
    } catch (err) {
      userError(err, res);
    }
  },

  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBUsuario.deletar(ids);
      res.status(200).json();
    } catch (err) {
      userError(err, res);
    }
  },

  async listar(_: Request, res: Response) {
    try {
      const preceptores = await DBUsuario.buscarPorTipo(tipo);
      res.status(200).json(preceptores);
    } catch (err) {
      userError(err, res);
    }
  },
  async editar(req: Request, res: Response) {
    const { novosDados } = req.body;

    if (!novosDados?.id_usuario)
      return res.status(400).json("O id do usuário deve ser passado");
    const message = cMessages.verificaEdicao(novosDados, camposPreceptores);
    if (message) return res.status(400).json({ message });

    try {
      await DBUsuario.editar(novosDados);
      res.status(200).json();
    } catch (err) {
      userError(err, res);
    }
  },
};

export default cPreceptor;
