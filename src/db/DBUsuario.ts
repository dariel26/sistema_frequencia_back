import { compare } from "../cipher/cipher";
import db from "./db";
import { IUsuario } from "../interfaces";

export interface IToken {
  papel: String;
  nome: String;
  email?: String;
  matricula?: String;
}
export const tokenSecret = "djasAJDi@e23819#@(*!ksDAHS";

const DBUsuario = {
  buscaPorLogin: async (login: string): Promise<IUsuario> => {
    const sql = "SELECT * FROM view_usuario WHERE login=?";
    const [usuarios] = await db.query(sql, [login]);
    return usuarios[0];
  },
};

export default DBUsuario;
