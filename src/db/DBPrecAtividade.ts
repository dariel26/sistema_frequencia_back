import { IPrecAtividade } from "../interfaces";
import db from "./db";

const DBPrecAtividade = {
  criar: async (dados: IPrecAtividade[]) => {
    const sql =
      "INSERT INTO PrecAtividade (id_preceptor, id_atividade) VALUES ?";
    const novosDados = dados.map(({ id_preceptor, id_atividade }) => [
      id_preceptor,
      id_atividade,
    ]);
    const res = await db.query(sql, [novosDados]);
    return res;
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM PrecAtividade WHERE id_atividade IN (?)";
    const res = await db.query(sql, [ids]);
    return res;
  },
};

export default DBPrecAtividade;
