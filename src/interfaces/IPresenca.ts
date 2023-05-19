export interface IPresenca {
  id_presenca?: number;
  data_hora: Date;
  estado: boolean;
  periodo: string;
  id_aluno: number;
  id_local: number;
  coordeadas: string;
}

const DBPresenca = {
  valido(obj: any) {
    if (
      (obj.data_hora === undefined,
      obj.estado === undefined,
      obj.periodo === undefined,
      obj.id_aluno === undefined,
      obj.id_local === undefined,
      obj.coordeadas === undefined)
    ) {
      return false;
    }
    return true;
  },
  criar(p: IPresenca) {
    const sql = `insert into Presenca (data_hora, estado, periodo, id_aluno, id_local, coordenadas)
    values ('${p.data_hora}', ${p.estado}, '${p.periodo}', ${p.id_aluno}, ${p.id_local}, '${p.coordeadas}')`;
  },
  buscarPorAluno(id_aluno: number) {},
  buscarPorAtividade(id_atividade: number) {},
};

export default DBPresenca;
