require("dotenv").config();
import jwt from "jsonwebtoken";
import db from "../db/db";
import { requisicaoRuim, trataErr } from "../errors";
import { IToken, tokenSecret } from "../interfaces/IToken";

const colecaoJwt = {
  async login(req: any, res: any) {
    const { email, matricula, senha } = req.body;
    if (
      requisicaoRuim(
        senha === undefined || (email === undefined && matricula === undefined),
        res
      )
    )
      return;

    try {
      let dados: any;
      if (matricula !== undefined) {
        dados = await db.query(
          `select nome, papel, matricula from Aluno where matricula='${matricula}' and senha=md5('${senha}') and estado=1`
        );
      } else {
        dados = await db.query(
          `select nome, papel, email from Coordenador where email='${email}' and senha=md5('${senha}') and estado=1`
        );
        if (dados[0][0] === undefined) {
          dados = await db.query(
            `select nome, papel, email from Preceptor where email='${email}' and senha=md5('${senha}') and estado=1`
          );
        }
      }
      if (dados[0][0] === undefined) {
        return res.status(401).json({ credenciaisEstado: false });
      } else {
        const pessoa = dados[0][0];
        const infoToken: IToken = {
          nome: pessoa.nome,
          papel: pessoa.papel,
          matricula: pessoa.matricula,
          email: pessoa.email,
        };
        const token = jwt.sign(infoToken, tokenSecret, { expiresIn: "24h" });
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

export default colecaoJwt;
