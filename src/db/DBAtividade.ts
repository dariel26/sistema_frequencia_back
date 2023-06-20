import { IAtividade } from "../interfaces";
import db from "./db";

const DBAtividade = {
  criar: async (atividades: IAtividade[]) => {
    const sql = "INSERT INTO Atividade (nome, id_estagio) VALUES ?";
    const novasAtividades = atividades.map(({ nome, id_estagio }) => [
      nome,
      id_estagio,
    ]);
    const res = await db.query(sql, [novasAtividades]);
    return res;
  },
  listar: async () => {
    const sql = `SELECT * FROM Atividade`;
    const [linhas] = await db.query(sql);
    return linhas;
  },
  editar: async (
    novosDados: { id_atividade: string; nome: string; id_estagio: string }[]
  ) => {
    let sql = "UPDATE Atividade SET ";
    let campos_disponiveis = ["nome", "id_estagio"];
    const campos_nulos: string[] = [];
    novosDados.forEach((a) => {
      if (a.nome === undefined) campos_nulos.push("nome");
      if (a.id_estagio === undefined) campos_nulos.push("id_estagio");
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
            sql += "WHEN id_atividade = ? THEN ? END ";
          } else {
            sql += "WHEN id_atividade = ? THEN ? ";
          }
        }
      } else {
        sql += `${c}= CASE `;
        for (let j = 0; j < novosDados.length; j++) {
          const ultimoJ = j === novosDados.length - 1;
          if (ultimoJ) {
            sql += "WHEN id_atividade = ? THEN ? END, ";
          } else {
            sql += "WHEN id_atividade = ? THEN ? ";
          }
        }
      }
    }
    const ids = novosDados.map(({ id_atividade }) => id_atividade);
    sql += ` WHERE id_atividade IN (${ids.map((item) => item).join(", ")})`;
    let values: any = [];
    for (let dado of novosDados) {
      const array = Object.values(dado);
      const id_atividade = array.shift();
      values.push(array.flatMap((valor) => [id_atividade, valor]));
    }
    values = values.flat();
    const res = await db.query(sql, values);
    return res;
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM Atividade WHERE id_atividade IN (?)";
    return await db.query(sql, [ids]);
  },
};

export default DBAtividade;
