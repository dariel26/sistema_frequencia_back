import { IAlunoDataAtividade } from "../interfaces";
import db from "./db";

const DBAlunoDataAtividade = {
  criar: async (dados: IAlunoDataAtividade[]) => {
    const sql =
      "INSERT INTO AlunoDataAtividade (id_aluno, id_atividade, estado, data) VALUES ?";
    const novosDados = dados.map(({ id_aluno, id_atividade, data, estado }) => [
      id_aluno,
      id_atividade,
      estado,
      data,
    ]);
    const res = await db.query(sql, [novosDados]);
    return res;
  },
  deletarSemPresencas: async (ids: Array<string>) => {
    const sql = "DELETE FROM AlunoDataAtividade WHERE id_atividade IN (?) AND estado != '1'";
    const res = await db.query(sql, [ids]);
    return res;
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM AlunoDataAtividade WHERE id_atividade IN (?)";
    const res = await db.query(sql, [ids]);
    return res;
  },
};

export default DBAlunoDataAtividade;
