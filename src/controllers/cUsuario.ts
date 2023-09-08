import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { compare } from "../cipher/cipher";
import DBUsuario from "../db/DBUsuario";
import { userError } from "./userErrors";
import { CustomRequest, IInfoUsuario, IUsuario } from "../interfaces";
import { defineHabilidadesPara } from "../middleware/habilidades";
import { tokenSecret } from "../middleware/middlewareJwt";
import cMessages from "./messagesDev";
import { coordenadoresADMINS } from "./cCoordenador";

const camposUsuario = ["papel_atual", "senha"];

const cUsuario = {
  async login(req: Request, res: Response) {
    let { login, senha } = req.body;

    try {
      const usuario = await DBUsuario.buscaPorLogin(login);
      if (usuario === undefined) {
        return res.status(401).json({ message: "Login Incorreto" });
      } else {
        const hashSenha = usuario.senha;
        if (hashSenha === undefined)
          res
            .status(500)
            .json({ message: "O usuário não possui senha no banco de dados" });
        else {
          if (await compare(senha, hashSenha)) {
            const token = criaToken(usuario);
            res.status(200).json(token);
          } else {
            return res.status(401).json({ message: "Senha Incorreta" });
          }
        }
      }
    } catch (err) {
      userError(err, res);
    }
  },

  async logout(req: Request, res: Response) {
    const { token } = req.headers;

    if (token === undefined)
      return res.status(400).json({ message: "Token vazio" });
    if (Array.isArray(token))
      return res.status(400).json({ message: "Token inválido" });

    try {
      DBUsuario.invalidarToken(token);
      res.status(200).json();
    } catch (err) {
      userError(err, res);
    }
  },

  async retornaInfoUsuario(req: Request, res: Response) {
    try {
      const requisicao = req as CustomRequest;
      const infoToken: IInfoUsuario = requisicao.infoToken;
      const habilidades = defineHabilidadesPara(infoToken);
      const infoUsuario: IInfoUsuario = {
        ...infoToken,
        regrasHabilidades: habilidades.rules,
      };
      return res.status(200).json(infoUsuario);
    } catch (err) {
      res.status(500).json();
    }
  },

  async usuarioSenhaPadrao(req: Request, res: Response) {
    const requisicao = req as CustomRequest;
    const login = requisicao.infoToken.login;
    try {
      const usuario = await DBUsuario.buscaPorLogin(login);
      if (usuario === undefined) {
        res.status(404).json({ message: "Usuario não existe!" });
      } else {
        const hashSenha = usuario.senha;
        if (hashSenha === undefined)
          res
            .status(500)
            .json({ message: "O usuário não possui senha no banco de dados" });
        else {
          if (await compare(login, hashSenha))
            res.status(200).json({ padrao: true });
          else {
            res.status(200).json({ padrao: false });
          }
        }
      }
    } catch (err) {
      userError(err, res);
    }
  },
  async editar(req: Request, res: Response) {
    const { novosDados } = req.body;

    if (typeof novosDados?.id_usuario !== "number")
      return res.status(400).json({ message: "O id do usuário está faltando" });
    const message = cMessages.verificaEdicao(novosDados, camposUsuario);
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
      const usuario = await DBUsuario.buscarPorId(novosDados.id_usuario);
      const token = criaToken(usuario);
      res.status(200).json(token);
    } catch (err) {
      userError(err, res);
    }
  },
};

export default cUsuario;

function criaToken(usuario: IUsuario) {
  const infoUsuario: IInfoUsuario = {
    nome: usuario.nome,
    papel_atual: usuario.papel_atual,
    papeis: usuario.papeis,
    login: usuario.login,
    id_usuario: usuario.id_usuario,
    tipo: usuario.tipo,
  };
  const token = jwt.sign(infoUsuario, tokenSecret, {
    expiresIn: "24h",
  });
  return token;
}
