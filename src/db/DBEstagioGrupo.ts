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
    const sql = "DELETE FROM EstagioGrupo WHERE id_estagiogrupo IN (?)";
    const res = await db.query(sql, [ids]);
    return res;
  },
  editar: async (dados: {
    id_estagiogrupo: string;
    id_grupo: string;
    id_estagio: string;
    data_inicial: string;
    data_final: string;
  }) => {
    let sql = "UPDATE EstagioGrupo SET";
    const valores = [];

    if (dados.id_grupo) {
      sql += " id_grupo=?,";
      valores.push(dados.id_grupo);
    }
    if (dados.id_estagio) {
      sql += " id_estagio=?,";
      valores.push(dados.id_estagio);
    }
    if (dados.data_inicial) {
      sql += " data_inicial=?,";
      valores.push(dados.data_inicial);
    }
    if (dados.data_final) {
      sql += " data_final=?,";
      valores.push(dados.data_final);
    }

    sql = sql.slice(0, -1);
    sql += ` WHERE id_estagiogrupo=?`;
    valores.push(dados.id_estagiogrupo);

    await db.query(sql, valores);
  },
};

export default DBEstagioGrupo;
