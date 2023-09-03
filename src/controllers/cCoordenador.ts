import { Request, Response } from "express";
import DBUsuario from "../db/DBUsuario";
import { trataErr } from "../errors";
import cMessages from "./cMessages";
import { IUsuario, PAPEIS, TIPO_USUARIO } from "../interfaces";

const camposCoordenador: string[] = ["nome", "login", "senha"];
const papeis: PAPEIS[] = ["COORDENADOR(A)"];
const tipo: TIPO_USUARIO = "COORDENADOR";

const cCoordenador = {
  async criarVarios(req: Request, res: Response) {
    const { coordenadores } = req.body;

    const message = cMessages.verificaNovos(coordenadores, camposCoordenador);
    if (message) return res.status(400).json({ message });

    try {
      const dados: IUsuario[] = coordenadores.map(
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
      const novosCoordenadores = await DBUsuario.buscarPorTipo(tipo);

      res.status(200).json(novosCoordenadores);
    } catch (err) {
      trataErr(err, res);
    }
  },

  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBUsuario.deletar(ids);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },

  async listar(_: Request, res: Response) {
    try {
      const coordenadores = await DBUsuario.buscarPorTipo(tipo);
      res.status(200).json(coordenadores);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async editar(req: Request, res: Response) {
    const { novosDados } = req.body;

    const message = cMessages.verificaEdicao(novosDados, camposCoordenador);
    if (message) return res.status(400).json({ message });

    try {
      await DBUsuario.editar(novosDados);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cCoordenador;
