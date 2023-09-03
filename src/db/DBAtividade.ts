import { IAtividade, IViewAtividade } from "../interfaces";
import db from "./db";

const DBAtividade = {
  criar: async (atividades: IAtividade[]) => {
    const sql =
      "INSERT INTO Atividade (nome, id_estagio, hora_inicial, hora_final, intervalo_alunos, alunos_no_dia, segunda, terca, quarta, quinta, sexta, sabado, domingo) VALUES ?";
    const novasAtividades = atividades.map(
      ({
        nome,
        id_estagio,
        hora_inicial,
        hora_final,
        intervalo_alunos,
        alunos_no_dia,
        segunda,
        terca,
        quarta,
        quinta,
        sexta,
        sabado,
        domingo,
      }) => [
        nome,
        id_estagio,
        hora_inicial,
        hora_final,
        intervalo_alunos,
        alunos_no_dia,
        segunda,
        terca,
        quarta,
        quinta,
        sexta,
        sabado,
        domingo,
      ]
    );
    const res = await db.query(sql, [novasAtividades]);
    return res;
  },
  listar: async (): Promise<IViewAtividade[]> => {
    const sql = `SELECT * FROM view_atividade`;
    const [linhas] = await db.query(sql);
    return linhas;
  },
  editar: async (dados: {
    id_atividade: string;
    id_estagio: string;
    nome: string;
    hora_inicial: string;
    hora_final: string;
    intervalo_alunos: string;
    alunos_no_dia: string;
    segunda: string;
    terca: string;
    quarta: string;
    quinta: string;
    sexta: string;
    sabado: string;
    domingo: string;
  }) => {
    let sql = "UPDATE Atividade SET";
    const valores = [];

    if (dados.id_estagio) {
      sql += " id_estagio=?,";
      valores.push(dados.id_estagio);
    }
    if (dados.nome) {
      sql += " nome=?,";
      valores.push(dados.nome);
    }
    if (dados.hora_inicial) {
      sql += " hora_inicial=?,";
      valores.push(dados.hora_inicial);
    }
    if (dados.hora_final) {
      sql += " hora_final=?,";
      valores.push(dados.hora_final);
    }
    if (dados.intervalo_alunos) {
      sql += " intervalo_alunos=?,";
      valores.push(dados.intervalo_alunos);
    }
    if (dados.alunos_no_dia) {
      sql += " alunos_no_dia=?,";
      valores.push(dados.alunos_no_dia);
    }
    if (dados.segunda) {
      sql += " segunda=?,";
      valores.push(dados.segunda);
    }
    if (dados.terca) {
      sql += " terca=?,";
      valores.push(dados.terca);
    }
    if (dados.quarta) {
      sql += " quarta=?,";
      valores.push(dados.quarta);
    }
    if (dados.quinta) {
      sql += " quinta=?,";
      valores.push(dados.quinta);
    }
    if (dados.sexta) {
      sql += " sexta=?,";
      valores.push(dados.sexta);
    }
    if (dados.sabado) {
      sql += " sabado=?,";
      valores.push(dados.sabado);
    }
    if (dados.domingo) {
      sql += " domingo=?,";
      valores.push(dados.domingo);
    }

    sql = sql.slice(0, -1);
    sql += ` WHERE id_atividade=?`;
    valores.push(dados.id_atividade);

    await db.query(sql, valores);
  },
  deletar: async (ids: Array<string>) => {
    const sql = "DELETE FROM Atividade WHERE id_atividade IN (?)";
    return await db.query(sql, [ids]);
  },
};

export default DBAtividade;
