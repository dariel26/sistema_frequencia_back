import { IAlunoDataAtividade } from "../interfaces";
import db from "./db";

const DBAlunoDataAtividade = {
  buscar: async (id_usuario: string) => {
    const sql = "SELECT * FROM view_presenca WHERE id_usuario IN (?)";
    const [presencas] = await db.query(sql, [id_usuario]);
    return presencas;
  },
  buscarPorId: async (id_alunodataatividade: string) => {
    const sql = "SELECT * FROM view_presenca WHERE id_alunodataatividade IN (?)";
    const [presencas] = await db.query(sql, [id_alunodataatividade]);
    return presencas;
  },
  criar: async (dados: IAlunoDataAtividade[]) => {
    const sql =
      "INSERT INTO AlunoDataAtividade (id_usuario, id_atividade, estado, data) VALUES ?";
    const novosDados = dados.map(({ id_usuario, id_atividade, data, estado }) => [
      id_usuario,
      id_atividade,
      estado,
      data,
    ]);
    const res = await db.query(sql, [novosDados]);
    return res;
  },
  deletarPartindoDe: async (id: number, dataAmanha: string) => {
    const sql =
      "DELETE FROM AlunoDataAtividade WHERE id_atividade IN (?) AND data >= ?";
    const res = await db.query(sql, [id, dataAmanha]);
    return res;
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM AlunoDataAtividade WHERE id_atividade IN (?)";
    const res = await db.query(sql, [ids]);
    return res;
  },
  editar: async (
    novosDados: {
      id_alunodataatividade: string;
      estado: string;
    }[]
  ) => {
    let sql = "UPDATE AlunoDataAtividade SET ";
    let campos_disponiveis = ["estado"];
    const campos_nulos: string[] = [];
    novosDados.forEach((g) => {
      if (g.estado === undefined) campos_nulos.push("estado");
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
            sql += "WHEN id_alunodataatividade = ? THEN ? END ";
          } else {
            sql += "WHEN id_alunodataatividade = ? THEN ? ";
          }
        }
      } else {
        sql += `${c}= CASE `;
        for (let j = 0; j < novosDados.length; j++) {
          const ultimoJ = j === novosDados.length - 1;
          if (ultimoJ) {
            sql += "WHEN id_alunodataatividade = ? THEN ? END, ";
          } else {
            sql += "WHEN id_alunodataatividade = ? THEN ? ";
          }
        }
      }
    }
    const ids = novosDados.map(({ id_alunodataatividade }) => id_alunodataatividade);
    sql += ` WHERE id_alunodataatividade IN (${ids.map((item) => item).join(", ")})`;
    let values: any = [];
    for (let dado of novosDados) {
      //TODO a ordem dos valores do objeto influenciam e podem dar valores errados
      const array = Object.values(dado);
      const id_alunodataatividade = array.shift();
      values.push(array.flatMap((valor) => [id_alunodataatividade, valor]));
    }
    values = values.flat();
    const res = await db.query(sql, values);
    return res;
  },
};

export default DBAlunoDataAtividade;
