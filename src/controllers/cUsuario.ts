import { Request, Response } from "express";
import { requisicaoRuim, trataErr } from "../errors";
import DBAluno from "../interfaces/IAluno";
import DBCoordenador, {
  PAPEL_ADMIN,
  PAPEL_COORDENADOR,
} from "../interfaces/ICoordenador";
import DBPreceptor, { PAPEL_PRECEPTOR } from "../interfaces/IPreceptor";
import DBToken from "../interfaces/IToken";
import { defineHabilidadesPara } from "../middleware/habilidades";

const cUsuario = {
  async retornaInfoUsuario(req: any, res: any) {
    try {
      const infoToken = req.infoToken;
      const habilidades = defineHabilidadesPara(infoToken);
      const infoUsuario = {
        ...infoToken,
        regrasHabilidades: habilidades.rules,
      };
      return res.status(200).json(infoUsuario);
    } catch (err) {
      res.status(500).json();
    }
  },
  async usuarioSenhaPadrao(req: any, res: any) {
    let { login, senha } = req.body;
    if (requisicaoRuim(senha === undefined || login === undefined, res)) return;
    try {
      const pessoa = await DBToken.login({ login, senha });
      if (pessoa === undefined) {
        res.status(200).json(false);
      } else {
        res.status(200).json(true);
      }
    } catch (err) {
      trataErr(err, res);
    }
  },
  async mudarSenha(req: any, res: any) {
    const {senha} = req.body;
    const infoToken = req.infoToken;
    if (requisicaoRuim(senha === undefined, res)) return;
    try {
      if (
        infoToken.papel === PAPEL_COORDENADOR ||
        infoToken.papel === PAPEL_ADMIN
      ) {
        await DBCoordenador.mudarSenha(infoToken.email, senha);
      } else if (infoToken.papel === PAPEL_PRECEPTOR) {
        await DBPreceptor.mudarSenha(infoToken.email, senha);
      } else {
        await DBAluno.mudarSenha(infoToken.matricula, senha);
      }
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cUsuario;
