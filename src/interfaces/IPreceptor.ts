import db from "../db/db";

export interface IPreceptor {
  id_preceptor?: number;
  senha: string;
  papel: string;
  estado: boolean;
  email: string;
  nome: string;
}

export const PAPEL_PRECEPTOR = "PRECEPTOR(A)";

const DBPreceptor = {
  valido(obj: any) {
    if (
      obj.nome === undefined ||
      obj.senha === undefined ||
      obj.estado === undefined ||
      obj.papel === undefined ||
      obj.email === undefined
    ) {
      return false;
    }
    return true;
  },
  async criar(p: IPreceptor) {
    const sql = `insert into Preceptor (nome, senha, estado, papel, email) 
        values ('${p.nome}', md5('${p.senha}'), ${false}, '${PAPEL_PRECEPTOR}', '${
      p.email
    }')`;
    return await db.query(sql);
  },
  async buscarPorEmail(email: string) {
    const sql = `select nome, estado, email, papel from Preceptor where email='${email}'`;
    const dados = await db.query(sql);
    return dados[0][0];
  },
  async deletar(email: string) {
    const sql = `delete from Preceptor where email='${email}'`;
    return await db.query(sql);
  },
  async mudarEstado(email: string, estado: boolean) {
    const sql = `update Preceptor set estado=${estado} where email='${email}'`;
    return await db.query(sql);
  },
  async listar() {
    const sql = `select id_preceptor, email, nome, papel, estado from Preceptor`;
    const dados = await db.query(sql);
    return dados[0];
  },
};

export default DBPreceptor;
