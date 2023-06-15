import db from "../db/db";

export interface IAtivLocalAluno {
  id_atividade: number;
  id_local: number;
  id_aluno: number;
  id_ativlocal?: number;
  data_hora: Date;
}

const DBAtivLocalAluno = {
  valido(obj: any) {
    if (
      obj.id_atividade === undefined ||
      obj.id_local === undefined ||
      obj.data_hora === undefined ||
      obj.id_aluno === undefined
    ) {
      return false;
    }
    return true;
  },
  async associar(al: IAtivLocalAluno) {
    const sql = `insert into AtivLocalAluno (id_atividade, id_local, data_hora, id_aluno) 
    values (${al.id_atividade}, ${al.id_local}, '${al.data_hora}', '${al.id_aluno}')`;
    return await db.query(sql);
  },
  async buscarPorIdAtividade(id_atividade: number) {
    const sql = `select L.nome, L.id_local, L.coordenadas, AL.data_hora from AtivLocalAluno as AL, Local as L 
    where AL.id_atividade = ${id_atividade} and AL.id_local = L.id_local`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async apagar(al: IAtivLocalAluno) {
    const sql = `delete from AtivLocal 
    where id_atividade=${al.id_atividade} and id_local=${al.id_local} and data_hora='${al.data_hora}' and id_aluno='${al.id_aluno}'`;
    return await db.query(sql);
  },
};

export default DBAtivLocalAluno;
