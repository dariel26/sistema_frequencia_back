import { IGrupo } from "../interfaces";
import db from "./db";

const DBGrupo = {
  criar: async (grupos: IGrupo[]) => {
    const sql = "INSERT INTO Grupo (nome) VALUES ?";
    const novosGrupos = grupos.map(({ nome }) => [nome]);
    const res = await db.query(sql, [novosGrupos]);
    return res;
  },
  listar: async () => {
    const sql = `SELECT * FROM view_grupo`;
    const [linhas] = await db.query(sql);
    return linhas;
  },
  editar: async (novosDados: { id_grupo: string; nome: string }[]) => {
    let sql = "UPDATE Grupo SET ";
    let campos_disponiveis = ["nome"];
    const campos_nulos: string[] = [];
    novosDados.forEach((g) => {
      if (g.nome === undefined) campos_nulos.push("nome");
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
            sql += "WHEN id_grupo = ? THEN ? END ";
          } else {
            sql += "WHEN id_grupo = ? THEN ? ";
          }
        }
      } else {
        sql += `${c}= CASE `;
        for (let j = 0; j < novosDados.length; j++) {
          const ultimoJ = j === novosDados.length - 1;
          if (ultimoJ) {
            sql += "WHEN id_grupo = ? THEN ? END, ";
          } else {
            sql += "WHEN id_grupo = ? THEN ? ";
          }
        }
      }
    }
    const ids = novosDados.map(({ id_grupo }) => id_grupo);
    sql += ` WHERE id_grupo IN (${ids.map((item) => item).join(", ")})`;
    let values: any = [];
    for (let dado of novosDados) {
      const array = Object.values(dado);
      const id_grupo = array.shift();
      values.push(array.flatMap((valor) => [id_grupo, valor]));
    }
    values = values.flat();
    const res = await db.query(sql, values);
    return res;
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM Grupo WHERE id_grupo IN (?)";
    return await db.query(sql, [ids]);
  },
};

export default DBGrupo;
