import { IEstagioGrupo } from "../interfaces";
import db from "./db";

const DBEstagioGrupo = {
  criar: async (dados: IEstagioGrupo[]) => {
    const sql =
      "INSERT INTO EstagioGrupo (id_grupo, id_estagio, data_inicial, data_final) VALUES ?";
    const novosDados = dados.map(
      ({ id_grupo, id_estagio, data_inicial, data_final }) => [
        id_grupo,
        id_estagio,
        data_inicial,
        data_final,
      ]
    );
    const res = await db.query(sql, [novosDados]);
    return res;
  },
  deletar: async (ids: Array<string>) => {
    console.log(ids);
    const sql = "DELETE FROM EstagioGrupo WHERE id_estagiogrupo IN (?)";
    const res = await db.query(sql, [ids]);
    return res;
  },
};

export default DBEstagioGrupo;
