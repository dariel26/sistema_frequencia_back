import { ILocalAtividade } from "../interfaces";
import db from "./db";

const DBLocalAtividade = {
  criar: async (dados: ILocalAtividade[]) => {
    const sql =
      "INSERT INTO LocalAtividade (id_local, id_atividade) VALUES ?";
    const novosDados = dados.map(({ id_local, id_atividade }) => [
      id_local,
      id_atividade,
    ]);
    const res = await db.query(sql, [novosDados]);
    return res;
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM LocalAtividade WHERE id_atividade IN (?)";
    const res = await db.query(sql, [ids]);
    return res;
  },
};

export default DBLocalAtividade;
