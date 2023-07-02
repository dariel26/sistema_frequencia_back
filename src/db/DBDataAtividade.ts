import { IDataAtividade } from "../interfaces";
import db from "./db";

const DBDataAtividade = {
  criar: async (dados: IDataAtividade[]) => {
    const sql =
      "INSERT INTO DataAtividade (id_atividade, data, excluida) VALUES ?";
    const novosDados = dados.map(({ id_atividade, data }) => [
      id_atividade,
      data,
      false,
    ]);
    const res = await db.query(sql, [novosDados]);
    return res;
  },
  editar: async (
    novosDados: Array<{
      id_dataatividade: string;
      excluida: string;
    }>
  ) => {
    let sql = "UPDATE DataAtividade SET ";
    let campos_disponiveis = ["excluida"];
    const campos_nulos: string[] = [];
    novosDados.forEach((c) => {
      if (c.excluida === undefined) campos_nulos.push("excluida");
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
            sql += "WHEN id_dataatividade = ? THEN ? END ";
          } else {
            sql += "WHEN id_dataatividade = ? THEN ? ";
          }
        }
      } else {
        sql += `${c}= CASE `;
        for (let j = 0; j < novosDados.length; j++) {
          const ultimoJ = j === novosDados.length - 1;
          if (ultimoJ) {
            sql += "WHEN id_dataatividade = ? THEN ? END, ";
          } else {
            sql += "WHEN id_dataatividade = ? THEN ? ";
          }
        }
      }
    }
    const ids = novosDados.map(({ id_dataatividade }) => id_dataatividade);
    sql += ` WHERE id_dataatividade IN (${ids.map((item) => item).join(", ")})`;
    let values: any = [];
    for (let dado of novosDados) {
      const array = Object.values(dado);
      const id_dataatividade = array.shift();
      values.push(array.flatMap((valor) => [id_dataatividade, valor]));
    }
    values = values.flat();
    const res = await db.query(sql, values);
    return res;
  },
  deletar: async (ids: Array<string>) => {
    console.log(ids);
    const sql = "DELETE FROM DataAtividade WHERE id_atividade IN (?)";
    const res = await db.query(sql, [ids]);
    return res;
  },
};

export default DBDataAtividade;
