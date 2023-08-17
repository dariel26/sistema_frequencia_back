import { IEstagio } from "../interfaces";
import db from "./db";

const DBEstagio = {
  criar: async (estagios: IEstagio[]) => {
    const sql = "INSERT INTO Estagio (nome) VALUES ?";
    const novosEstagios = estagios.map(({ nome }) => [nome]);
    const res = await db.query(sql, [novosEstagios]);
    return res;
  },
  listar: async () => {
    const sql = `SELECT * FROM view_estagio ORDER BY id_estagio`;
    const [linhas] = await db.query(sql);
    return linhas;
  },
  editar: async (novosDados: { id_estagio: string; nome: string }[]) => {
    let sql = "UPDATE Estagio SET ";
    let campos_disponiveis = ["nome"];
    const campos_nulos: string[] = [];
    novosDados.forEach((e) => {
      if (e.nome === undefined) campos_nulos.push("nome");
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
            sql += "WHEN id_estagio = ? THEN ? END ";
          } else {
            sql += "WHEN id_estagio = ? THEN ? ";
          }
        }
      } else {
        sql += `${c}= CASE `;
        for (let j = 0; j < novosDados.length; j++) {
          const ultimoJ = j === novosDados.length - 1;
          if (ultimoJ) {
            sql += "WHEN id_estagio = ? THEN ? END, ";
          } else {
            sql += "WHEN id_estagio = ? THEN ? ";
          }
        }
      }
    }
    const ids = novosDados.map(({ id_estagio }) => id_estagio);
    sql += ` WHERE id_estagio IN (${ids.map((item) => item).join(", ")})`;
    let values: any = [];
    for (let dado of novosDados) {
      const array = Object.values(dado);
      const id_estagio = array.shift();
      values.push(array.flatMap((valor) => [id_estagio, valor]));
    }
    values = values.flat();
    const res = await db.query(sql, values);
    return res;
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM Estagio WHERE id_estagio IN (?)";
    return await db.query(sql, [ids]);
  },
};

export default DBEstagio;
