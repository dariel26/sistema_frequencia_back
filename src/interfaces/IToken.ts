import db from "../db/db";

export interface IToken {
  papel: String;
  nome: String;
  email?: String;
  matricula?: String;
}
export const tokenSecret = "djasAJDi@e23819#@(*!ksDAHS";

const DBToken = {
  login: async ({ login, senha }: { login: string; senha: string }) => {
    let dados;
    const matricula = parseInt(login);
    if (!isNaN(matricula)) {
      dados = await db.query(
        `select nome, papel, matricula from Aluno where matricula='${matricula}' and senha=md5('${senha}') and estado=1`
      );
    } else {
      dados = await db.query(
        `select nome, papel, email from Coordenador where email='${login}' and senha=md5('${senha}') and estado=1`
      );
      if (dados[0][0] === undefined) {
        dados = await db.query(
          `select nome, papel, email from Preceptor where email='${login}' and senha=md5('${senha}') and estado=1`
        );
      }
    }
    return dados[0][0];
  },
};

export default DBToken;
