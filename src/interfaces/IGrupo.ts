import db from "../db/db";

export interface IGrupo {
  id_grupo?: number;
  nome: string;
}

const DBGrupo = {
  valido(obj: any) {
    if (obj.nome === undefined) {
      return false;
    }
    return true;
  },
  async criar(g: IGrupo) {
    const sql = `insert into Grupo (nome) values ('${g.nome}')`;
    return await db.query(sql);
  },
  async listar() {
    const sql = `select * from view_grupo_aluno`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async editar(id_grupo: number, nome: string) {
    const sql = `update Grupo set nome='${nome}' where id_grupo=${id_grupo}`;
    return await db.query(sql);
  },
  async apagar(id_grupo: number) {
    const sql = `delete from Grupo where id_grupo=${id_grupo}`;
    return await db.query(sql);
  },
};

export default DBGrupo;
