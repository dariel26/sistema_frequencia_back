import db from "../db/db";

export interface IPresenca {
  id_presenca?: number;
  data_hora: Date;
  estado: boolean;
  periodo: string;
  id_aluno: number;
  id_local: number;
  id_atividade: number;
  coordenadas: string;
}

const DBPresenca = {
  valido(obj: any) {
    if (
      (obj.data_hora === undefined,
      obj.estado === undefined,
      obj.periodo === undefined,
      obj.id_aluno === undefined,
      obj.id_local === undefined,
      obj.coordenadas === undefined,
      obj.id_atividade === undefined)
    ) {
      return false;
    }
    return true;
  },
  async criar(p: IPresenca) {
    const sql = `insert into Presenca (data_hora, estado, periodo, id_aluno, id_local, id_atividade, coordenadas)
    values ('${p.data_hora}', ${p.estado}, '${p.periodo}', ${p.id_aluno}, ${p.id_local}, ${p.id_atividade},'${p.coordenadas}')`;
    return await db.query(sql);
  },
  async buscarPorAluno(id_aluno: number) {
    const sql = `select * from Presenca where id_aluno=${id_aluno}`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async buscarPorAtividade(id_atividade: number) {
    const sql = `select * from Presenca where id_atividade=${id_atividade}`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async listar() {
    const sql = `select * from Presenca`;
    const dados = await db.query(sql);
    return dados[0];
  },
  async apagarPorId(id_presenca: number) {
    const sql = `delete from Presenca where id_presenca=${id_presenca}`;
    return await db.query(sql);
  },
};

export default DBPresenca;
