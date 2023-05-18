import db from "../db/db";

export interface IPrecAtiv {
  id_atividade: number;
  id_preceptor: number;
}

const DBPrecAtiv = {
  valido(obj: any) {
    if (obj.id_atividade === undefined || obj.id_preceptor === undefined) {
      return false;
    }
    return true;
  },
  async associar(pa: IPrecAtiv) {
    const sql = `insert into PrecAtiv (id_atividade, id_preceptor) values (${pa.id_atividade}, ${pa.id_preceptor})`;
    return await db.query(sql);
  },
  async buscarPorIdAtividade(id_atividade: number) {
    const sql = `select P.id_preceptor, P.nome, P.email from PrecAtiv as PA, Preceptor as P 
    where PA.id_atividade = ${id_atividade} and PA.id_preceptor = P.id_preceptor`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async apagar(pa: IPrecAtiv) {
    const sql = `delete from PrecAtiv where id_atividade=${pa.id_atividade} and id_preceptor=${pa.id_preceptor}`;
    return await db.query(sql);
  },
};

export default DBPrecAtiv;
