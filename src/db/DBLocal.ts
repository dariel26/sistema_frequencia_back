import { ILocal } from "../interfaces";
import db from "./db";

const DBLocal = {
  criar: async (locais: ILocal[]) => {
    const sql = "INSERT INTO Local (nome, coordenadas) VALUES ?";
    const novosLocais = locais.map(({ nome, coordenadas }) => [nome, coordenadas]);
    const res = await db.query(sql, [novosLocais]);
    return res;
  },
  listar: async () => {
    const sql = `SELECT * FROM Local`;
    const [linhas] = await db.query(sql);
    return linhas;
  },
  editar: async (novosDados: { id_local: string; nome: string, coordenadas: string }[]) => {
    let sql = "UPDATE Local SET ";
    let campos_disponiveis = ["nome", "coordenadas"];
    const campos_nulos: string[] = [];
    novosDados.forEach((l) => {
      if (l.nome === undefined) campos_nulos.push("nome");
      if (l.coordenadas === undefined) campos_nulos.push("coordenadas");
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
            sql += "WHEN id_local = ? THEN ? END ";
          } else {
            sql += "WHEN id_local = ? THEN ? ";
          }
        }
      } else {
        sql += `${c}= CASE `;
        for (let j = 0; j < novosDados.length; j++) {
          const ultimoJ = j === novosDados.length - 1;
          if (ultimoJ) {
            sql += "WHEN id_local = ? THEN ? END, ";
          } else {
            sql += "WHEN id_local = ? THEN ? ";
          }
        }
      }
    }
    const ids = novosDados.map(({ id_local }) => id_local);
    sql += ` WHERE id_local IN (${ids.map((item) => item).join(", ")})`;
    let values: any = [];
    for (let dado of novosDados) {
      const array = Object.values(dado);
      const id_local = array.shift();
      values.push(array.flatMap((valor) => [id_local, valor]));
    }
    values = values.flat();
    const res = await db.query(sql, values);
    return res;
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM Local WHERE id_local IN (?)";
    return await db.query(sql, [ids]);
  },
};

export default DBLocal;
