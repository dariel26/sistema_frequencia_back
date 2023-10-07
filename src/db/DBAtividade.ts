import { IAtividade, IViewAtividade } from "../interfaces";
import db from "./db";

const DBAtividade = {
  criar: async (atividades: IAtividade[]) => {
    const sql =
      "INSERT INTO Atividade (nome, id_estagio, hora_inicial, hora_final, periodo) VALUES ?";
    const novasAtividades = atividades.map(
      ({ nome, id_estagio, hora_inicial, hora_final, periodo }) => [
        nome,
        id_estagio,
        hora_inicial,
        hora_final,
        periodo,
      ]
    );
    const res = await db.query(sql, [novasAtividades]);
    return res;
  },
  listar: async (): Promise<IViewAtividade[]> => {
    const sql = `SELECT * FROM view_atividade`;
    const [linhas] = await db.query(sql);
    return linhas;
  },
  editar: async (dados: {
    id_atividade: string;
    id_estagio: string;
    nome: string;
    hora_inicial: string;
    hora_final: string;
    periodo: string;
  }) => {
    let sql = "UPDATE Atividade SET";
    const valores = [];

    if (dados.id_estagio) {
      sql += " id_estagio=?,";
      valores.push(dados.id_estagio);
    }
    if (dados.nome) {
      sql += " nome=?,";
      valores.push(dados.nome);
    }
    if (dados.hora_inicial) {
      sql += " hora_inicial=?,";
      valores.push(dados.hora_inicial);
    }
    if (dados.hora_final) {
      sql += " hora_final=?,";
      valores.push(dados.hora_final);
    }
    if (dados.periodo) {
      sql += " periodo=?,";
      valores.push(dados.periodo);
    }

    sql = sql.slice(0, -1);
    sql += ` WHERE id_atividade=?`;
    valores.push(dados.id_atividade);

    await db.query(sql, valores);
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM Atividade WHERE id_atividade IN (?)";
    return await db.query(sql, [ids]);
  },
};

export default DBAtividade;
