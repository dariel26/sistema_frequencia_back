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
    return await db.query(sql);
  },
  async buscarPorIdEstagio(id_estagio: number) {
    const sql = `select C.id_coordenador, C.nome, C.email from CoordEstagio as CE, Coordenador as C 
    where CE.id_estagio = ${id_estagio} and CE.id_coordenador = C.id_coordenador`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async apagar({ id_estagio }: { id_estagio: string }) {
    const sql = `delete from CoordEstagio where id_estagio=${id_estagio}`;
    return await db.query(sql);
  },
};

export default DBCoordEstagio;
