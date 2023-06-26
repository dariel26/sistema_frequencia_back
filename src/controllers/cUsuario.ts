import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { compare } from "../cipher/cipher";
import DBAluno from "../db/DBAluno";
import DBCoordenador from "../db/DBCoordenador";
import DBPreceptor from "../db/DBPreceptor";
import DBUsuario from "../db/DBUsuario";
import { trataErr } from "../errors";
import { CustomRequest, IToken, IUsuario } from "../interfaces";
import { defineHabilidadesPara } from "../middleware/habilidades";
import { tokenSecret } from "../middleware/middlewareJwt";
import { PAPEL_ADMIN, PAPEL_COORDENADOR, PAPEL_PRECEPTOR } from "../papeis";

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
            const infoUsuario: IUsuario = {
              nome: usuario.nome,
              papel: usuario.papel,
              login: usuario.login,
              id: usuario.id,
            };
            const token = jwt.sign(infoUsuario, tokenSecret, {
              expiresIn: "24h",
            });
            res.status(200).json(token);
          } else {
            return res.status(401).json({ message: "Senha Incorreta" });
          }
        }
      }
    } catch (err) {
      trataErr(err, res);
    }
  },

  async logout(req: Request, res: Response) {
    const { token } = req.headers;
    try {
      if (token === undefined)
        return res.status(400).json({ message: "Token vazio" });
      if (Array.isArray(token))
        return res.status(400).json({ message: "Token inválido" });
      DBUsuario.invalidarToken(token);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },

  async retornaInfoUsuario(req: Request, res: Response) {
    try {
      const requisicao = req as CustomRequest;
      const infoToken: IToken = requisicao.infoToken;
      const habilidades = defineHabilidadesPara(infoToken);
      const infoUsuario: IUsuario = {
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
      trataErr(err, res);
    }
  },

  async mudarSenha(req: Request, res: Response) {
    const { novosDados } = req.body;
    const requisicao = req as CustomRequest;
    const infoToken = requisicao.infoToken;
    try {
      if (
        infoToken.papel === PAPEL_COORDENADOR ||
        infoToken.papel === PAPEL_ADMIN
      ) {
        await DBCoordenador.editar(
          novosDados.map(({ id, senha }: { id: string; senha: string }) => ({
            id_coordenador: id,
            senha,
          }))
        );
      } else if (infoToken.papel === PAPEL_PRECEPTOR) {
        await DBPreceptor.editar(
          novosDados.map(({ id, senha }: { id: string; senha: string }) => ({
            id_preceptor: id,
            senha,
          }))
        );
      } else {
        await DBAluno.editar(
          novosDados.map(({ id, senha }: { id: string; senha: string }) => ({
            id_aluno: id,
            senha,
          }))
        );
      }
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cUsuario;
