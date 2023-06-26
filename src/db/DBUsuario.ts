import db from "./db";
import { IUsuario } from "../interfaces";

const DBUsuario = {
  buscaPorLogin: async (login: string): Promise<IUsuario> => {
    const sql = "SELECT * FROM view_usuario WHERE login=?";
    const [usuarios] = await db.query(sql, [login]);
    return usuarios[0];
  },
  invalidarToken: async (token: string) => {
    const sql = `INSERT INTO jwt (token, validade) VALUES('${token}', NOW() + INTERVAL 24 HOUR)`;
    await db.query(sql);
  },
};

export default DBUsuario;
