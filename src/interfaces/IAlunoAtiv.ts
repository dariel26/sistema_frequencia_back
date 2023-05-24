import db from "../db/db";

export interface IAlunoAtiv {
  id_atividade: number;
  id_aluno: number;
}

const DBAlunoAtiv = {
  valido(obj: any) {
    if (obj.id_atividade === undefined || obj.id_aluno === undefined) {
      return false;
    }
    return true;
  },
  async associar(aa: IAlunoAtiv) {
    const sql = `insert into AlunoAtiv (id_atividade, id_aluno) values (${aa.id_atividade}, ${aa.id_aluno})`;
    return await db.query(sql);
  },
  async buscarPorIdAtividade(id_atividade: number) {
    const sql = `select A.id_aluno, A.nome, A.matricula from AlunoAtiv as AA, Aluno as A 
    where AA.id_atividade = ${id_atividade} and AA.id_aluno = A.id_aluno`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async apagar(aa: IAlunoAtiv) {
    const sql = `delete from AlunoAtiv where id_atividade=${aa.id_atividade} and id_aluno=${aa.id_aluno}`;
    return await db.query(sql);
  },
  async listar() {
    const sql = `select * from AlunoAtiv`;
    const dados = await db.query(sql);
    return dados[0];
  },
};

export default DBAlunoAtiv;
