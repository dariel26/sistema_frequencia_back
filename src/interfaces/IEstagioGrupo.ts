import db from "../db/db";

export interface IEstagioGrupo {
  id_estagio: number;
  id_grupo: number;
  id_estagiogrupo?: number;
  data: Date;
}

const DBEstagioGrupo = {
  valido(obj: any) {
    if (
      obj.id_grupo === undefined ||
      obj.id_estagio === undefined ||
      obj.data === undefined
    ) {
      return false;
    }
    return true;
  },
  async associar(eg: IEstagioGrupo) {
    const sql = `insert into EstagioGrupo (id_estagio, id_grupo, data) 
    values (${eg.id_estagio}, ${eg.id_grupo}, '${eg.data}')`;
    return await db.query(sql);
  },
  async buscarPorIdGrupo(id_grupo: number) {
    const sql = `select E.nome, E.id_estagio, EG.data from Estagio as E, EstagioGrupo as EG 
    where EG.id_grupo = ${id_grupo} and EG.id_estagio = E.id_estagio`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async apagar(eg: IEstagioGrupo) {
    const sql = `delete from EstagioGrupo 
    where id_grupo=${eg.id_grupo} and id_estagio=${eg.id_estagio} and data='${eg.data}'`;
    return await db.query(sql);
  },
};

export default DBEstagioGrupo;
