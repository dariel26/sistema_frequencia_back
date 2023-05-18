import db from "../db/db";

export interface ILocal {
  id_local?: number;
  nome: string;
  coordenadas: string;
}

const DBLocal = {
  valido(obj: any) {
    if (obj.nome === undefined || obj.coordenadas === undefined) {
      return false;
    }
    return true;
  },
  async criar(l: ILocal) {
    const sql = `insert into Local (nome, coordenadas) values ('${l.nome}', '${l.coordenadas}')`;
    return await db.query(sql);
  },
  async listar() {
    const sql = `select * from Local`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async editar(
    id_local: number,
    nome: string,
    coordenadas: Map<string, string>
  ) {
    const sql = `update Local set nome='${nome}', coordenadas='${coordenadas}' where id_local=${id_local}`;
    return await db.query(sql);
  },
  async apagar(id_local: number) {
    const sql = `delete from Local where id_local=${id_local}`;
    return await db.query(sql);
  },
};

export default DBLocal;
