import { ILocal } from "../interfaces";
import db from "./db";

const DBLocal = {
  criar: async (locais: ILocal[]) => {
    const sql = "INSERT INTO Local (nome, coordenadas) VALUES ?";
    const novosLocais = locais.map(({ nome, coordenadas }) => [
      nome,
      coordenadas,
    ]);
    const res = await db.query(sql, [novosLocais]);
    return res;
  },
  listar: async (): Promise<ILocal[]> => {
    const sql = `SELECT * FROM Local`;
    const [linhas] = await db.query(sql);
    return linhas;
  },
  editar: async (dados: { nome: string; id_local: string }) => {
    let sql = "UPDATE Local SET nome=? WHERE id_local=?";
    await db.query(sql, [dados.nome, dados.id_local]);
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM Local WHERE id_local IN (?)";
    return await db.query(sql, [ids]);
  },
};

export default DBLocal;
