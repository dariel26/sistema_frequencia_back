import { compare } from "../cipher/cipher";
import db from "../db/db";
import { IUsuario } from "../interfaces";

export interface IToken {
  papel: String;
  nome: String;
  email?: String;
  matricula?: String;
}
export const tokenSecret = "djasAJDi@e23819#@(*!ksDAHS";

const DBToken = {
  login: async ({
    login,
    senha,
  }: {
    login: string;
    senha: string;
  }): Promise<IUsuario | undefined> => {
    const sql = "SELECT * FROM view_usuario WHERE login=?";
    const [usuarios] = await db.query(sql, [login]);
    if (usuarios.length < 1) {
      return undefined;
    } else {
      const usuario = usuarios[0];
      const senhaHash = usuario.senha;
      const corresponde = await compare(senha, senhaHash);
      if (!corresponde) return undefined;
      return usuario;
    }
  },
};

export default DBToken;
