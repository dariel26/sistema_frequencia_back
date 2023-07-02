import { IAlunoDataAtividade } from "../interfaces";
import db from "./db";

const DBAlunoDataAtividade = {
  criar: async (dados: IAlunoDataAtividade[]) => {
    const sql =
      "INSERT INTO AlunoDataAtividade (id_aluno, id_dataatividade) VALUES ?";
    const novosDados = dados.map(({ id_aluno, id_dataatividade }) => [
      id_aluno,
      id_dataatividade,
    ]);
    const res = await db.query(sql, [novosDados]);
    return res;
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM AlunoDataAtividade WHERE id_dataatividade IN (?)";
    const res = await db.query(sql, [ids]);
    return res;
  },
};

export default DBAlunoDataAtividade;
