import { ICoordEstagio } from "../interfaces";
import db from "./db";

const DBCoordEstagio = {
  criar: async (dados: ICoordEstagio[]) => {
    const sql =
      "INSERT INTO CoordEstagio (id_usuario, id_estagio) VALUES ?";
    const novosDados = dados.map(({ id_usuario, id_estagio }) => [
      id_usuario,
      id_estagio,
    ]);
    const res = await db.query(sql, [novosDados]);
    return res;
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM CoordEstagio WHERE id_estagio IN (?)";
    const res = await db.query(sql, [ids]);
    return res;
  },
};

export default DBCoordEstagio;
