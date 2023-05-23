import db from "../db/db";

export interface IAtivLocal {
  id_atividade: number;
  id_local: number;
  id_ativlocal?: number;
  data_hora: Date;
}

const DBAtivLocal = {
  valido(obj: any) {
    if (
      obj.id_atividade === undefined ||
      obj.id_local === undefined ||
      obj.data_hora === undefined
    ) {
      return false;
    }
    return true;
  },
  async associar(al: IAtivLocal) {
    const sql = `insert into AtivLocal (id_atividade, id_local, data_hora) 
    values (${al.id_atividade}, ${al.id_local}, '${al.data_hora}')`;
    return await db.query(sql);
  },
  async buscarPorIdAtividade(id_atividade: number) {
    const sql = `select L.nome, L.id_local, L.coordenadas, AL.data_hora from AtivLocal as AL, Local as L 
    where AL.id_atividade = ${id_atividade} and AL.id_local = L.id_local`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async apagar(al: IAtivLocal) {
    const sql = `delete from AtivLocal 
    where id_atividade=${al.id_atividade} and id_local=${al.id_local} and data_hora='${al.data_hora}'`;
    return await db.query(sql);
  },
};

export default DBAtivLocal;
