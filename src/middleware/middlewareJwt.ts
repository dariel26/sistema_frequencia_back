import jwt from "jsonwebtoken";
import db from "../db/db";
import { requisicaoRuim, trataErr } from "../errors";
import { tokenSecret } from "../interfaces/IToken";

export default async function acessoApi(req: any, res: any, next: any) {
  const { token } = req.headers;
  try {
    if (requisicaoRuim(token === undefined, res)) return;
    const infoToken = jwt.verify(token, tokenSecret);
    await db.query("delete from jwt where validade < NOW()");
    const dados = await db.query(`select * from jwt where token='${token}'`);
    if (dados[0][0] === undefined) {
      req.infoToken = infoToken;
      return next();
    } else {
      return res.status(401).json();
    }
  } catch (err) {
    trataErr(err, res);
  }
}
