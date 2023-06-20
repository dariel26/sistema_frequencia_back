import { cipher } from "../cipher/cipher";
import { IPreceptor } from "../interfaces";
import { PAPEL_PRECEPTOR } from "../papeis";
import db from "./db";

const DBPreceptor = {
  criar: async (preceptores: IPreceptor[]) => {
    const sql =
      "INSERT INTO Preceptor (nome, senha, estado, papel, email) VALUES ?";
    const params: any[] = [];
    for (let { nome, email, senha } of preceptores) {
      const senhaHash = await cipher(senha);
      params.push([nome, senhaHash, true, PAPEL_PRECEPTOR, email]);
    }
    const res = await db.query(sql, [params]);
    return res;
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM Preceptor WHERE id_preceptor IN (?)";
    const res = await db.query(sql, [ids]);
    return res;
  },
  editar: async (
    novosDados: Array<{
      id_preceptor: string;
      nome: string;
      senha: string;
      email: string;
    }>
  ) => {
    let sql = "UPDATE Preceptor SET ";
    let campos_disponiveis = ["nome", "senha", "email"];
    const campos_nulos: string[] = [];
    novosDados.forEach((c) => {
      if (c.nome === undefined) campos_nulos.push("nome");
      if (c.senha === undefined) campos_nulos.push("senha");
      if (c.email === undefined) campos_nulos.push("email");
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
            sql += "WHEN id_preceptor = ? THEN ? END ";
          } else {
            sql += "WHEN id_preceptor = ? THEN ? ";
          }
        }
      } else {
        sql += `${c}= CASE `;
        for (let j = 0; j < novosDados.length; j++) {
          const ultimoJ = j === novosDados.length - 1;
          if (ultimoJ) {
            sql += "WHEN id_preceptor = ? THEN ? END, ";
          } else {
            sql += "WHEN id_preceptor = ? THEN ? ";
          }
        }
      }
    }
    const ids = novosDados.map(({ id_preceptor }) => id_preceptor);
    sql += ` WHERE id_preceptor IN (${ids.map((item) => item).join(", ")})`;
    let values: any = [];
    for (let dado of novosDados) {
      if (dado.senha !== undefined) {
        dado.senha = await cipher(dado.senha);
      }
      const array = Object.values(dado);
      const id_preceptor = array.shift();
      values.push(array.flatMap((valor) => [id_preceptor, valor]));
    }
    values = values.flat();
    const res = await db.query(sql, values);
    return res;
  },
  listar: async () => {
    const sql =
      "SELECT id_preceptor, nome, email, papel, estado FROM Preceptor ORDER BY nome ASC";
    const [linhas] = await db.query(sql);
    return linhas;
  },
};

export default DBPreceptor;
