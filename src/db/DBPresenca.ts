import { IPresenca } from "../interfaces";
import db from "./db";

const DBPresenca = {
  criar: async (presencas: IPresenca[]) => {
    const sql =
      "INSERT INTO Presenca (id_aluno, id_dataatividade, id_atividade, hora_marcada, id_local, data, estado, coordenadas) VALUES ?";
    const novasPresencas = presencas.map(
      ({
        id_aluno,
        id_dataatividade,
        id_atividade,
        hora_marcada,
        id_local,
        data,
        coordenadas
      }) => [
        id_aluno,
        id_dataatividade,
        id_atividade,
        hora_marcada,
        id_local,
        data,
        "TOTAL",
        coordenadas
      ]
    );
    const res = await db.query(sql, [novasPresencas]);
    return res;
  },
  listar: async () => {
    const sql = `SELECT * FROM Presenca`;
    const [linhas] = await db.query(sql);
    return linhas;
  },
  editar: async (novosDados: { id_presenca: string; estado: string }[]) => {
    let sql = "UPDATE Presenca SET ";
    let campos_disponiveis = ["estado"];
    const campos_nulos: string[] = [];
    novosDados.forEach((p) => {
      if (p.estado === undefined) campos_nulos.push("estado");
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
            sql += "WHEN id_presenca = ? THEN ? END ";
          } else {
            sql += "WHEN id_presenca = ? THEN ? ";
          }
        }
      } else {
        sql += `${c}= CASE `;
        for (let j = 0; j < novosDados.length; j++) {
          const ultimoJ = j === novosDados.length - 1;
          if (ultimoJ) {
            sql += "WHEN id_presenca = ? THEN ? END, ";
          } else {
            sql += "WHEN id_presenca = ? THEN ? ";
          }
        }
      }
    }
    const ids = novosDados.map(({ id_presenca }) => id_presenca);
    sql += ` WHERE id_presenca IN (${ids.map((item) => item).join(", ")})`;
    let values: any = [];
    for (let dado of novosDados) {
      const array = Object.values(dado);
      const id_presenca = array.shift();
      values.push(array.flatMap((valor) => [id_presenca, valor]));
    }
    values = values.flat();
    const res = await db.query(sql, values);
    return res;
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM Presenca WHERE id_presenca IN (?)";
    return await db.query(sql, [ids]);
  },
};

export default DBPresenca;
