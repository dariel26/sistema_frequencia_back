import { IEstagio, IViewEstagio } from "../interfaces";
import db from "./db";

const DBEstagio = {
  criar: async (estagios: IEstagio[]) => {
    const sql = "INSERT INTO Estagio (nome) VALUES ?";
    const novosEstagios = estagios.map(({ nome }) => [nome]);
    const res = await db.query(sql, [novosEstagios]);
    return res;
  },
  listar: async (): Promise<IViewEstagio[]> => {
    const sql = `SELECT * FROM view_estagio ORDER BY id_estagio`;
    const [linhas] = await db.query(sql);
    return linhas;
  },
  editar: async (dados: { nome: string; id_estagio: string }) => {
    let sql = "UPDATE Estagio SET nome=? WHERE id_estagio=?";
    await db.query(sql, [dados.nome, dados.id_estagio]);
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM Estagio WHERE id_estagio IN (?)";
    return await db.query(sql, [ids]);
  },
};

export default DBEstagio;
