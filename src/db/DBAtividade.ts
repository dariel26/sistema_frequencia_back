import { IAtividade } from "../interfaces";
import db from "./db";

const DBAtividade = {
  criar: async (atividades: IAtividade[]) => {
    const sql =
      "INSERT INTO Atividade (nome, id_estagio, hora_inicial, hora_final, intervalo_alunos, alunos_no_dia) VALUES ?";
    const novasAtividades = atividades.map(
      ({
        nome,
        id_estagio,
        hora_inicial,
        hora_final,
        intervalo_alunos,
        alunos_no_dia,
      }) => [
        nome,
        id_estagio,
        hora_inicial,
        hora_final,
        intervalo_alunos,
        alunos_no_dia,
      ]
    );
    const res = await db.query(sql, [novasAtividades]);
    return res;
  },
  listar: async () => {
    const sql = `SELECT * FROM view_atividade`;
    const [linhas] = await db.query(sql);
    return linhas;
  },
  editar: async (
    novosDados: {
      id_atividade: string;
      id_estagio: string;
      nome: string;
      hora_inicial: string;
      hora_final: string;
      intervalo_alunos: string;
      alunos_no_dia: string;
    }[]
  ) => {
    let sql = "UPDATE Atividade SET ";
    let campos_disponiveis = [
      "nome",
      "id_estagio",
      "hora_inicial",
      "hora_final",
      "intervalo_alunos",
      "alunos_no_dia",
    ];
    const campos_nulos: string[] = [];
    novosDados.forEach((g) => {
      if (g.nome === undefined) campos_nulos.push("nome");
      if (g.id_estagio === undefined) campos_nulos.push("id_estagio");
      if (g.hora_inicial === undefined) campos_nulos.push("hora_inicial");
      if (g.hora_final === undefined) campos_nulos.push("hora_final");
      if (g.intervalo_alunos === undefined)
        campos_nulos.push("intervalo_alunos");
      if (g.alunos_no_dia === undefined) campos_nulos.push("alunos_no_dia");
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
