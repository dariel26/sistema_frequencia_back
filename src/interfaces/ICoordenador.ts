import db from "../db/db";

export interface ICoordenador {
  id_coordenador?: number;
  nome: string;
  senha: string;
  estado: boolean;
  papel: string;
  email: string;
}

export const PAPEL_ADMIN: string = "ADMIN";
export const PAPEL_COORDENADOR: string = "COORDENADOR(A)";

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
  async listar() {
    const sql = `select id_coordenador, nome, email, papel, estado from Coordenador`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async quantidadeDeAdmins() {
    const sql = `select * from Coordenador where papel='${PAPEL_ADMIN}'`;
    const dados = await db.query(sql);
    return dados[0]?.length;
  },
  async criar(c: ICoordenador) {
    const sql = `insert into Coordenador (nome, senha, estado, papel, email) 
        values ('${c.nome}', md5('${
      c.senha
    }'), ${true}, '${PAPEL_COORDENADOR}', '${c.email}')`;
    return await db.query(sql);
  },
  async criarUmAdmin(c: ICoordenador) {
    const sql = `insert into Coordenador (nome, senha, estado, papel, email) 
        values ('${c.nome}', md5('${c.senha}'), ${true}, '${PAPEL_ADMIN}', '${
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
  async mudarPapel(email: string, papel: string, nome: string) {
    const sql = `update Coordenador set papel='${papel}', nome='${nome}' where email='${email}'`;
    return await db.query(sql);
  },
  async mudarSenha(email: string, senha: string) {
    const sql = `update Coordenador set senha=md5('${senha}') where email='${email}'`;
    return await db.query(sql);
  },
};

export default DBCoordenador;
