import db from "../db/db";

export interface IAluno {
  id_aluno?: number;
  id_grupo?: number;
  nome: string;
  estado: boolean;
  senha: string;
  aparelho?: string;
  papel: string;
  matricula: string;
}

const DBAluno = {
  valido(obj: any) {
    if (
      obj.nome === undefined ||
      obj.senha === undefined ||
      obj.estado === undefined ||
      obj.papel === undefined ||
      obj.matricula === undefined
    ) {
      return false;
    }
    return true;
  },
  async criar(a: IAluno) {
    const sql = `insert into Aluno (nome, senha, estado, papel, matricula) 
        values ('${a.nome}', md5('${a.senha}'), ${false}, '${a.papel}', '${
      a.matricula
    }')`;
    return await db.query(sql);
  },
  async buscarPorMatricula(matricula: string) {
    const sql = `select nome, estado, matricula, papel from Aluno where matricula='${matricula}'`;
    const dados = await db.query(sql);
    return dados[0][0];
  },
  async deletar(matricula: string) {
    const sql = `delete from Aluno where matricula='${matricula}'`;
    return await db.query(sql);
  },
  async mudarEstado(matricula: string, estado: boolean) {
    const sql = `update Aluno set estado=${estado} where matricula='${matricula}'`;
    return await db.query(sql);
  },
};

export default DBAluno;
