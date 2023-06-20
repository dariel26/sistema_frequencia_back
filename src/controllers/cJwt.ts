require("dotenv").config();
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../db/db";
import { requisicaoRuim, trataErr } from "../errors";
import { IUsuario } from "../interfaces";
import DBToken, { tokenSecret } from "../interfaces/IToken";

const cJwt = {
  async login(req: Request, res: Response) {
    let { login, senha } = req.body;
    if (requisicaoRuim(senha === undefined || login === undefined, res)) return;

    try {
      const pessoa = await DBToken.login({ login, senha });
      if (pessoa === undefined) {
        return res.status(401).json({ message: "Credencias Incorretas" });
      } else {
        const usuario: IUsuario = {
          nome: pessoa.nome,
          papel: pessoa.papel,
          login: pessoa.login,
          id: pessoa.id,
        };
        const token = jwt.sign(usuario, tokenSecret, { expiresIn: "24h" });
        res.status(200).json(token);
      }
    } catch (err) {
      trataErr(err, res);
    }
  },
  async logout(req: any, res: any) {
    const { token } = req.headers;
    if (requisicaoRuim(token === undefined, res)) return;
    try {
      const sql = `insert into jwt (token, validade) values('${token}', NOW() + INTERVAL 24 HOUR)`;
      await db.query(sql);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cJwt;
