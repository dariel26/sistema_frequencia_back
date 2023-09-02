import { IGrupo, IViewGrupo } from "../interfaces";
import db from "./db";

const DBGrupo = {
  criar: async (grupos: IGrupo[]) => {
    const sql = "INSERT INTO Grupo (nome) VALUES ?";
    const novosGrupos = grupos.map(({ nome }) => [nome]);
    const res = await db.query(sql, [novosGrupos]);
    return res;
  },
  listar: async (): Promise<IViewGrupo[]> => {
    const sql = `SELECT * FROM view_grupo`;
    const [linhas] = await db.query(sql);
    return linhas;
  },
  editar: async (dados: { nome: string; id_grupo: string }) => {
    let sql = "UPDATE Grupo SET nome=? WHERE id_grupo=?";
    await db.query(sql, [dados.nome, dados.id_grupo]);
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM Grupo WHERE id_grupo IN (?)";
    return await db.query(sql, [ids]);
  },
};

export default DBGrupo;
