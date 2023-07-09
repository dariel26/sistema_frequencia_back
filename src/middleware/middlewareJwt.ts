require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../db/db";
import { trataErr } from "../errors";
import { CustomRequest, IToken } from "../interfaces";

export const tokenSecret = "djasAJDi@e23819#@(*!ksDAHS";

export default async function acessoPadrao(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { token } = req.headers;
  try {
    if (process.env.NODE_ENV === "test") return next();
    if (token === undefined)
      return res
        .status(401)
        .json({ message: "Você não possui chave de acesso!" });
    if (Array.isArray(token))
      return res.status(401).json({ message: "Token Inválido!" });
    const infoToken = jwt.verify(token, tokenSecret);
    await db.query("delete from jwt where validade < NOW()");
    const dados = await db.query(`select * from jwt where token='${token}'`);
    if (dados[0][0] === undefined) {
      const requisicao = req as CustomRequest;
      requisicao.infoToken = infoToken as IToken;
      setTimeout(() => {
        return next();
      }, 1000)
        
    } else {
      return res.status(401).json();
    }
  } catch (err) {
    trataErr(err, res);
  }
}
