import { IAlunoGrupo } from "../interfaces";
import db from "./db";

const DBAlunoGrupo = {
  criar: async (dados: IAlunoGrupo[]) => {
    const sql = "INSERT INTO AlunoGrupo (id_usuario, id_grupo) VALUES ?";
    const novosDados = dados.map(({ id_usuario, id_grupo }) => [
      id_usuario,
      id_grupo,
    ]);
    const res = await db.query(sql, [novosDados]);
    return res;
  },
  deletar: async (idsAlunos: Array<string>) => {
    const sql = "DELETE FROM AlunoGrupo WHERE id_usuario IN (?)";
    const res = await db.query(sql, [idsAlunos]);
    return res;
  },
};

export default DBAlunoGrupo;
