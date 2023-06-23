import { IAtivLocal } from "../interfaces";
import db from "./db";

const DBAtivLocal = {
  criar: async (dados: IAtivLocal[]) => {
    const sql = "INSERT INTO AtivLocal (id_atividade, id_local, id_preceptor) VALUES ?";
    const novosDados = dados.map(({ id_atividade, id_local, id_preceptor }) => [id_atividade, id_local, id_preceptor]);
    const res = await db.query(sql, [novosDados]);
    return res;
  },
  listar: async () => {
    const sql = `SELECT * FROM view_atividade_local`;
    const [linhas] = await db.query(sql);
    return linhas;
  },
  editar: async (novosDados: { id_atividadelocal: string; id_local: string, id_preceptor: string }[]) => {
    let sql = "UPDATE AtivLocal SET ";
    let campos_disponiveis = ["id_local", "id_preceptor"];
    const campos_nulos: string[] = [];
    novosDados.forEach((d) => {
      if (d.id_local === undefined) campos_nulos.push("id_local");
      if (d.id_preceptor === undefined) campos_nulos.push("id_preceptor");
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
            sql += "WHEN id_atividadelocal = ? THEN ? END ";
          } else {
            sql += "WHEN id_atividadelocal = ? THEN ? ";
          }
        }
      } else {
        sql += `${c}= CASE `;
        for (let j = 0; j < novosDados.length; j++) {
          const ultimoJ = j === novosDados.length - 1;
          if (ultimoJ) {
            sql += "WHEN id_atividadelocal = ? THEN ? END, ";
          } else {
            sql += "WHEN id_atividadelocal = ? THEN ? ";
          }
        }
      }
    }
    const ids = novosDados.map(({ id_atividadelocal }) => id_atividadelocal);
    sql += ` WHERE id_atividadelocal IN (${ids.map((item) => item).join(", ")})`;
    let values: any = [];
    for (let dado of novosDados) {
      const array = Object.values(dado);
      const id_atividadelocal = array.shift();
      values.push(array.flatMap((valor) => [id_atividadelocal, valor]));
    }
    values = values.flat();
    const res = await db.query(sql, values);
    return res;
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM AtivLocal WHERE id_atividadelocal IN (?)";
    return await db.query(sql, [ids]);
  },
};

export default DBAtivLocal;
