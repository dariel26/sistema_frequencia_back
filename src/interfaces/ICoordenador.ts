import db from "../db/db";

export interface ICoordenador {
  id_coordenador?: number;
  nome: string;
  senha: string;
  estado: boolean;
  papel: string;
  email: string;
}

const DBCoordenador = {
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
  async criar(c: ICoordenador) {
    const sql = `insert into Coordenador (nome, senha, estado, papel, email) 
        values ('${c.nome}', md5('${c.senha}'), ${false}, '${c.papel}', '${
      c.email
    }')`;
    return await db.query(sql);
  },
  async buscarPorEmail(email: string) {
    const sql = `select nome, estado, email, papel from Coordenador where email='${email}'`;
    const dados = await db.query(sql);
    return dados[0][0];
  },
  async deletar(email: string) {
    const sql = `delete from Coordenador where email='${email}'`;
    return await db.query(sql);
  },
  async mudarEstado(email: string, estado: boolean) {
    const sql = `update Coordenador set estado=${estado} where email='${email}'`;
    await db.query(sql);
  },
};

export default DBCoordenador;
