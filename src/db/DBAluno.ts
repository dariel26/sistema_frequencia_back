import { cipher } from "../cipher/cipher";
import { IAluno } from "../interfaces";
import { PAPEL_ALUNO } from "../papeis";
import db from "./db";

const DBAluno = {
  criar: async (alunos: IAluno[]) => {
    const sql =
      "INSERT INTO Aluno (nome, senha, estado, papel, matricula) VALUES ?";
    const params: any[] = [];
    for (let { nome, matricula, senha } of alunos) {
      const senhaHash = await cipher(senha);
      params.push([nome, senhaHash, true, PAPEL_ALUNO, matricula]);
    }
    const res = await db.query(sql, [params]);
    return res;
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM Aluno WHERE id_aluno IN (?)";
    const res = await db.query(sql, [ids]);
    return res;
  },
  editar: async (
    novosDados: Array<{
      id_aluno: string;
      nome: string;
      senha: string;
      matricula: string;
      id_grupo: string;
    }>
  ) => {
    let sql = "UPDATE Aluno SET ";
    let campos_disponiveis = ["nome", "senha", "matricula", "id_grupo"];
    const campos_nulos: string[] = [];
    novosDados.forEach((c) => {
      if (c.nome === undefined) campos_nulos.push("nome");
      if (c.senha === undefined) campos_nulos.push("senha");
      if (c.matricula === undefined) campos_nulos.push("matricula");
      if (c.id_grupo === undefined) campos_nulos.push("id_grupo");
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
            sql += "WHEN id_aluno = ? THEN ? END ";
          } else {
            sql += "WHEN id_aluno = ? THEN ? ";
          }
        }
      } else {
        sql += `${c}= CASE `;
        for (let j = 0; j < novosDados.length; j++) {
          const ultimoJ = j === novosDados.length - 1;
          if (ultimoJ) {
            sql += "WHEN id_aluno = ? THEN ? END, ";
          } else {
            sql += "WHEN id_aluno = ? THEN ? ";
          }
        }
      }
    }
    const ids = novosDados.map(({ id_aluno }) => id_aluno);
    sql += ` WHERE id_aluno IN (${ids.map((item) => item).join(", ")})`;
    let values: any = [];
    for (let dado of novosDados) {
      if (dado.senha !== undefined) {
        dado.senha = await cipher(dado.senha);
      }
      const array = Object.values(dado);
      const id_aluno = array.shift();
      values.push(array.flatMap((valor) => [id_aluno, valor]));
    }
    values = values.flat();
    const res = await db.query(sql, values);
    return res;
  },
  listar: async () => {
    const sql =
      "SELECT * FROM view_aluno ORDER BY nome ASC";
    const [linhas] = await db.query(sql);
    return linhas;
  },
};

export default DBAluno;
