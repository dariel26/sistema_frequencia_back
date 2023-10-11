import { ISubscricao } from "../interfaces";
import db from "./db";

const DBSubscricao = {
  criar: async (dados: ISubscricao[]) => {
    const sql =
      "INSERT INTO subscricao (id_usuario, endpoint, expiracao, u_key, autenticidade) VALUES ?";
    const novosDados = dados.map(
      ({ id_usuario, endpoint, expiracao, u_key, autenticidade }) => [
        id_usuario,
        endpoint,
        expiracao,
        u_key,
        autenticidade,
      ]
    );
    const res = await db.query(sql, [novosDados]);
    return res;
  },
  deletar: async (idsUsuarios: Array<string>) => {
    const sql = "DELETE FROM subscricao WHERE id_usuario IN (?)";
    const res = await db.query(sql, [idsUsuarios]);
    return res;
  },
  listar: async (): Promise<ISubscricao[]> => {
    const sql = "SELECT * FROM subscricao";
    const [linhas] = await db.query(sql);
    return linhas;
  },
};

export default DBSubscricao;
