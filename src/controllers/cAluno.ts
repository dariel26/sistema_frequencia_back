import { Request, Response } from "express";
import DBUsuario from "../db/DBUsuario";
import { userError } from "./userErrors";
import cMessages from "./messagesDev";
import { IUsuario, PAPEIS, TIPO_USUARIO } from "../interfaces";

const camposAlunos: string[] = ["nome", "login", "senha"];
const papeis: PAPEIS[] = ["ALUNO(A)"];
const tipo: TIPO_USUARIO = "ALUNO";

const cAluno = {
  async criarVarios(req: Request, res: Response) {
    const { alunos } = req.body;

    const message = cMessages.verificaNovos(alunos, camposAlunos);
    if (message) return res.status(400).json({ message });

    try {
      const dados: IUsuario[] = alunos.map(
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
      const novosAlunos = await DBUsuario.listarAlunos();

      res.status(200).json(novosAlunos);
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
      const alunos = await DBUsuario.listarAlunos();
      res.status(200).json(alunos);
    } catch (err) {
      userError(err, res);
    }
  },
  async editar(req: Request, res: Response) {
    const { novosDados } = req.body;

    const message = cMessages.verificaEdicao(novosDados, camposAlunos);
    if (message) return res.status(400).json({ message });

    try {
      await DBUsuario.editar(novosDados);
      res.status(200).json();
    } catch (err) {
      userError(err, res);
    }
  },
};

export default cAluno;
