import db from "../db/db";

export interface IEstagio {
  id_estagio?: number;
  nome: string;
}

const DBEstagio = {
  valido(obj: any) {
    if (obj.nome === undefined) {
      return false;
    }
    return true;
  },
  async criar(e: IEstagio) {
    const sql = `insert into Estagio (nome) values ('${e.nome}')`;
    return await db.query(sql);
  },
  async listarEstagioGrupo() {
    const sql = `select * from view_estagio_grupo`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async listarEstagioAtividade() {
    const sql = `select * from view_estagio_atividade`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async editar(id_estagio: number, nome: string) {
    const sql = `update Estagio set nome='${nome}' where id_estagio=${id_estagio}`;
    return await db.query(sql);
  },
  async apagar(id_estagio: number) {
    const sql = `delete from Estagio where id_estagio=${id_estagio}`;
    return await db.query(sql);
  },
};

export default DBEstagio;
