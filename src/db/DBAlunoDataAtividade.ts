import { ESTADO_PRESENCA, IAlunoDataAtividade } from "../interfaces";
import db from "./db";

const DBAlunoDataAtividade = {
  buscar: async (id_usuario: string) => {
    const sql = "SELECT * FROM view_presenca WHERE id_usuario IN (?)";
    const [presencas] = await db.query(sql, [id_usuario]);
    return presencas;
  },
  buscarPorData: async (datas: {
    data_inicial: string;
    data_final: string;
  }) => {
    const sql = "SELECT * FROM view_presenca WHERE data >= ? AND data <= ? ";
    const [presencas] = await db.query(sql, [
      datas.data_inicial,
      datas.data_final,
    ]);
    return presencas;
  },
  buscarPorId: async (id_alunodataatividade: string) => {
    const sql =
      "SELECT * FROM view_presenca WHERE id_alunodataatividade IN (?)";
    const [presencas] = await db.query(sql, [id_alunodataatividade]);
    return presencas;
  },
  criar: async (dados: IAlunoDataAtividade[]) => {
    const sql =
      "INSERT INTO AlunoDataAtividade (id_usuario, id_atividade, estado, data, periodo, id_dataatividade) VALUES ?";
    const novosDados = dados.map(
      ({
        id_usuario,
        id_atividade,
        data,
        estado,
        periodo,
        id_dataatividade,
      }) => [id_usuario, id_atividade, estado, data, periodo, id_dataatividade]
    );
    const res = await db.query(sql, [novosDados]);
    return res;
  },
  deletarPartindoDe: async (id: number, dataAmanha: string) => {
    const sql =
      "DELETE FROM AlunoDataAtividade WHERE id_atividade IN (?) AND data >= ?";
    const res = await db.query(sql, [id, dataAmanha]);
    return res;
  },
  deletar: async (dados: { data: string; id_atividade: number }[]) => {
    const ids = dados.map(({ id_atividade }) => id_atividade);
    const datas = dados.map(({ data }) => data);
    const sql =
      "DELETE FROM AlunoDataAtividade WHERE id_atividade IN (?) AND data IN (?)";
    const res = await db.query(sql, [ids, datas]);
    return res;
  },
  limpar: async (id_atividade: string) => {
    const sql = "DELETE FROM AlunoDataAtividade WHERE id_atividade IN (?)";
    const res = await db.query(sql, [id_atividade]);
    return res;
  },
  editar: async (novosDados: {
    id_alunodataatividade: number;
    estado: string;
  }) => {
    let sql = "UPDATE AlunoDataAtividade SET";
    const valores = [];

    if (novosDados.estado) {
      sql += " estado=?,";
      valores.push(novosDados.estado);
    }

    sql = sql.slice(0, -1);
    sql += ` WHERE id_alunodataatividade=?`;
    valores.push(novosDados.id_alunodataatividade);

    await db.query(sql, valores);
  },
};

export default DBAlunoDataAtividade;
