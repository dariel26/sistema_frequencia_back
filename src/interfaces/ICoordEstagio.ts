import db from "../db/db";

export interface ICoordEstagio {
  id_coordenador: number;
  id_estagio: number;
}

const DBCoordEstagio = {
  valido(obj: any) {
    if (obj.id_coordenador !== undefined && obj.id_estagio !== undefined) {
      return true;
    }
    return false;
  },
  async associar(ce: ICoordEstagio) {
    const sql = `insert into CoordEstagio (id_coordenador, id_estagio) values (${ce.id_coordenador}, ${ce.id_estagio})`;
    await db.query(sql);
  },
  async listar() {
    const sql = `select * from CoordEstagio`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async apagar(ce: ICoordEstagio) {
    const sql = `delete from CoordEstagio where id_coordenador=${ce.id_coordenador} and id_estagio=${ce.id_estagio}`;
    await db.query(sql);
  },
};

export default DBCoordEstagio;
