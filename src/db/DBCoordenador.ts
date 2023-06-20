import { cipher } from "../cipher/cipher";
import { ICoordenador } from "../interfaces";
import { PAPEL_COORDENADOR } from "../papeis";
import db from "./db";

const DBCoordenador = {
  criar: async (coordenadores: ICoordenador[]) => {
    const sql =
      "INSERT INTO Coordenador (nome, senha, estado, papel, email) VALUES ?";
    const params: any[] = [];
    for (let { nome, email, senha } of coordenadores) {
      const senhaHash = await cipher(senha);
      params.push([nome, senhaHash, true, PAPEL_COORDENADOR, email]);
    }
    const res = await db.query(sql, [params]);
    return res;
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM Coordenador WHERE id_coordenador IN (?)";
    const res = await db.query(sql, [ids]);
    return res;
  },
  editar: async (
    novosDados: Array<{
      id_coordenador: string;
      nome: string;
      senha: string;
      email: string;
      papel: string;
    }>
  ) => {
    let sql = "UPDATE Coordenador SET ";
    let campos_disponiveis = ["nome", "senha", "email", "papel"];
    const campos_nulos: string[] = [];
    novosDados.forEach((c) => {
      if (c.nome === undefined) campos_nulos.push("nome");
      if (c.senha === undefined) campos_nulos.push("senha");
      if (c.email === undefined) campos_nulos.push("email");
      if (c.papel === undefined) campos_nulos.push("papel");
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
            sql += "WHEN id_coordenador = ? THEN ? END ";
          } else {
            sql += "WHEN id_coordenador = ? THEN ? ";
          }
        }
      } else {
        sql += `${c}= CASE `;
        for (let j = 0; j < novosDados.length; j++) {
          const ultimoJ = j === novosDados.length - 1;
          if (ultimoJ) {
            sql += "WHEN id_coordenador = ? THEN ? END, ";
          } else {
            sql += "WHEN id_coordenador = ? THEN ? ";
          }
        }
      }
    }
    const ids = novosDados.map(({ id_coordenador }) => id_coordenador);
    sql += ` WHERE id_coordenador IN (${ids.map((item) => item).join(", ")})`;
    let values: any = [];
    for (let dado of novosDados) {
      if (dado.senha !== undefined) {
        dado.senha = await cipher(dado.senha);
      }
      const array = Object.values(dado);
      const id_coordenador = array.shift();
      values.push(array.flatMap((valor) => [id_coordenador, valor]));
    }
    values = values.flat();
    const res = await db.query(sql, values);
    return res;
  },
  listar: async () => {
    const sql =
      "SELECT id_coordenador, nome, email, papel, estado FROM Coordenador ORDER BY nome ASC";
    const [linhas] = await db.query(sql);
    return linhas;
  },
};

export default DBCoordenador;
