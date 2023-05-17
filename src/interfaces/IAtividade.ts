import db from "../db/db";

export interface IAtividade {
  id_atividade?: number;
  id_estagio: number;
  nome: string;
}

const DBAtividade = {
  valido(obj: any) {
    if (obj.nome === undefined || obj.id_estagio === undefined) {
      return false;
    }
    return true;
  },
  async criar(a: IAtividade) {
    const sql = `insert into Atividade (nome, id_estagio) values ('${a.nome}', ${a.id_estagio})`;
    return await db.query(sql);
  },
  async listar() {
    const sql = `select * from Atividade`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async listarPorIdEstagio(id_estagio: number) {
    const sql = `select * from Atividade where id_estagio=${id_estagio}`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async editar(id_atividade: number, nome: string) {
    const sql = `update Atividade set nome='${nome}' where id_atividade=${id_atividade}`;
    return await db.query(sql);
  },
  async apagar(id_atividade: number) {
    const sql = `delete from Atividade where id_atividade=${id_atividade}`;
    return await db.query(sql);
  },
};

export default DBAtividade;
