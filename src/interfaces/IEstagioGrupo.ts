import db from "../db/db";

export interface IEstagioGrupo {
  id_estagio: number;
  id_grupo: number;
  id_estagiogrupo?: number;
  data_inicio: Date;
  data_final: Date;
}

const DBEstagioGrupo = {
  valido(obj: any) {
    if (
      obj.id_grupo === undefined ||
      obj.id_estagio === undefined ||
      obj.data_inicio === undefined ||
      obj.data_final === undefined
    ) {
      return false;
    }
    return true;
  },
  async associar(eg: IEstagioGrupo) {
    const sql = `insert into EstagioGrupo (id_estagio, id_grupo, data_inicio, data_final) 
    values (${eg.id_estagio}, ${eg.id_grupo}, '${eg.data_inicio}', '${eg.data_final}')`;
    return await db.query(sql);
  },
  async buscarPorIdGrupo(id_grupo: number) {
    const sql = `select E.nome, E.id_estagio, EG.data_inicio, EG.data_final from Estagio as E, EstagioGrupo as EG 
    where EG.id_grupo = ${id_grupo} and EG.id_estagio = E.id_estagio`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async apagar({id_estagio, id_grupo}:{id_estagio: string, id_grupo: string}) {
    const sql = `delete from EstagioGrupo 
    where id_grupo=${id_grupo} and id_estagio=${id_estagio}`;
    return await db.query(sql);
  },
};

export default DBEstagioGrupo;
