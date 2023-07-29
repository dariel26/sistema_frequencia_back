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
  editar: async (novosDados: { id_estagiogrupo: string; id_grupo: string }[]) => {
    let sql = "UPDATE EstagioGrupo SET ";
    let campos_disponiveis = ["id_grupo"];
    const campos_nulos: string[] = [];
    novosDados.forEach((e) => {
      if (e.id_grupo === undefined) campos_nulos.push("id_grupo");
    });
    campos_disponiveis = campos_disponiveis.filter(
      (campo) => !campos_nulos.includes(campo)
    );

    for (let i = 0; i < campos_disponiveis.length; i++) {
      const c = campos_disponiveis[i];
      const ultimoI = i === campos_disponiveis.length - 1;
      if (ultimoI) {
        sql += `${c}= CASE `;
        for (let j = 0; j < novosDados.length; j++) {
          const ultimoJ = j === novosDados.length - 1;
          if (ultimoJ) {
            sql += "WHEN id_estagiogrupo = ? THEN ? END ";
          } else {
            sql += "WHEN id_estagiogrupo = ? THEN ? ";
          }
        }
      } else {
        sql += `${c}= CASE `;
        for (let j = 0; j < novosDados.length; j++) {
          const ultimoJ = j === novosDados.length - 1;
          if (ultimoJ) {
            sql += "WHEN id_estagiogrupo = ? THEN ? END, ";
          } else {
            sql += "WHEN id_estagiogrupo = ? THEN ? ";
          }
        }
      }
    }
    const ids = novosDados.map(({ id_estagiogrupo }) => id_estagiogrupo);
    sql += ` WHERE id_estagiogrupo IN (${ids.map((item) => item).join(", ")})`;
    let values: any = [];
    for (let dado of novosDados) {
      const array = Object.values(dado);
      const id_estagiogrupo = array.shift();
      values.push(array.flatMap((valor) => [id_estagiogrupo, valor]));
    }
    values = values.flat();
    const res = await db.query(sql, values);
    return res;
  },
};

export default DBEstagioGrupo;
