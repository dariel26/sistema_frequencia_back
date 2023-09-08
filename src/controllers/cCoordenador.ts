import { Request, Response } from "express";
import DBUsuario from "../db/DBUsuario";
import { userError } from "./userErrors";
import cMessages from "./messagesDev";
import { IUsuario, PAPEIS, TIPO_USUARIO } from "../interfaces";

const camposCoordenador: string[] = ["nome", "login", "senha"];
const camposCoordenadorEdicao: string[] = ["nome", "login", "senha", "papeis"];
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
      userError(err, res);
    }
  },

  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      const admins = await coordenadoresADMINS();
      if (admins.length === 1 && ids.includes(admins[0].id_usuario.toString()))
        return userError(new Error("NO ADMINS"), res);
      await DBUsuario.deletar(ids);
      res.status(200).json();
    } catch (err) {
      userError(err, res);
    }
  },

  async listar(_: Request, res: Response) {
    try {
      const coordenadores = await DBUsuario.buscarPorTipo(tipo);
      res.status(200).json(coordenadores);
    } catch (err) {
      userError(err, res);
    }
  },
  async editar(req: Request, res: Response) {
    const { novosDados } = req.body;

    if (typeof novosDados?.id_usuario !== "number")
      return res
        .status(400)
        .json({ message: "O id do usuário não está sendo enviado" });
    const message = cMessages.verificaEdicao(
      novosDados,
      camposCoordenadorEdicao
    );
    if (message) return res.status(400).json({ message });

    try {
      if (novosDados.papeis)
        if (!novosDados.papeis.includes("ADMIN")) {
          const admins = await coordenadoresADMINS();
          if (
            admins.length === 1 &&
            admins[0].id_usuario === novosDados.id_usuario
          )
            return userError(new Error("NO ADMINS"), res);
        }
      await DBUsuario.editar(novosDados);
      res.status(200).json();
    } catch (err) {
      userError(err, res);
    }
  },
};

export default cCoordenador;

export async function coordenadoresADMINS() {
  let coordenadores = await DBUsuario.listar();
  coordenadores = coordenadores.filter(({ tipo }) => tipo === "COORDENADOR");

  const admins = coordenadores.filter(({ papeis }) => papeis.includes("ADMIN"));
  return admins;
}
